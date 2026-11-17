import { Profile } from "@/types";
import { Globe, Calendar, MapPin, Languages, Tag, Building } from "lucide-react";

interface Props {
  profile: Profile;
}

export default function QuickFactsTable({ profile }: Props) {
  const isDeceased = Boolean(profile.deathDate);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }
    return dateStr;
  };

  const facts = [
    {
      label: "Country",
      value: profile.country,
      icon: Globe,
    },
    {
      label: isDeceased ? "Born" : "Birth Date",
      value: `${formatDate(profile.birthDate)}`,
      icon: Calendar,
    },
    ...(isDeceased
      ? [
          {
            label: "Died",
            value: `${formatDate(profile.deathDate)}`,
            icon: Calendar,
          },
        ]
      : []),
    {
      label: "Birthplace",
      value: profile.birthPlace || "N/A",
      icon: MapPin,
    },
    {
      label: "Languages Spoken",
      value: profile.languages && profile.languages.length > 0 ? profile.languages.join(", ") : "N/A",
      icon: Languages,
    },
    {
      label: "Known As / Nickname",
      value: profile.nickname || "N/A",
      icon: Tag,
    },
    ...(profile.industry
      ? [
          {
            label: "Industry / Realm",
            value: profile.industry,
            icon: Building,
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        Quick Facts
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div key={fact.label} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {fact.label}
                </dt>
                <dd className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {fact.value}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

