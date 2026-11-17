const fs = require('fs');
const path = require('path');
const https = require('https');

const profilesDir = path.join(__dirname, '..', 'data', 'profiles');
const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent': 'ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)',
          'Accept': 'application/json',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchJson(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return resolve(null);
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(null);
          }
        });
      }
    ).on('error', () => resolve(null));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent': 'ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadImage(res.headers.location, destPath).then(resolve);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return resolve(false);
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      }
    ).on('error', () => resolve(false));
  });
}

async function run() {
  const files = fs.readdirSync(profilesDir).filter((f) => f.endsWith('.json'));
  console.log(`Processing ${files.length} profile JSON files...`);

  let successCount = 0;

  for (const file of files) {
    const filePath = path.join(profilesDir, file);
    const profiles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    for (const p of profiles) {
      const destPath = path.join(avatarsDir, `${p.slug}.jpg`);
      const webPath = `/avatars/${p.slug}.jpg`;

      // Check if image already exists
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
        if (p.image !== webPath) {
          p.image = webPath;
          p.imageCredit = 'Wikimedia Commons (CC BY-SA / Public Domain)';
          modified = true;
        }
        continue;
      }

      // Determine Wikipedia title
      let wikiTitle = '';
      if (p.sources && p.sources.length > 0) {
        const wikiUrl = p.sources.find((s) => s.includes('wikipedia.org/wiki/'));
        if (wikiUrl) {
          const parts = wikiUrl.split('/wiki/');
          if (parts[1]) wikiTitle = parts[1].split('#')[0].split('?')[0];
        }
      }

      if (!wikiTitle) {
        wikiTitle = p.name.replace(/\s+/g, '_');
      }

      let cleanTitle = wikiTitle;
      try {
        cleanTitle = encodeURIComponent(decodeURIComponent(wikiTitle));
      } catch (e) {
        cleanTitle = encodeURIComponent(wikiTitle);
      }

      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanTitle}`;
      const data = await fetchJson(apiUrl);

      if (data && (data.thumbnail || data.originalimage)) {
        const imageUrl = (data.thumbnail && data.thumbnail.source) || (data.originalimage && data.originalimage.source);
        if (imageUrl) {
          const ok = await downloadImage(imageUrl, destPath);
          if (ok) {
            p.image = webPath;
            p.imageCredit = `Wikimedia Commons / ${data.title || p.name}`;
            modified = true;
            successCount++;
            console.log(`[✓] Downloaded image for ${p.name}`);
          }
        }
      } else {
        console.log(`[!] No image found for ${p.name}`);
      }

      await sleep(150); // Respect Wikipedia rate limits
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2), 'utf8');
    }
  }

  console.log(`Finished! Total new images downloaded: ${successCount}`);
}

run();

