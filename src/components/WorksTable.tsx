import { FamousWork } from "@/types";

interface Props {
  works: FamousWork[];
}

export default function WorksTable({ works }: Props) {
  if (!works || works.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        Key Works & Notable Milestones
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-2.5 px-4 w-28">Year</th>
              <th className="py-2.5 px-4">Title / Milestone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {works.map((work, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                  {work.year}
                </td>
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                  {work.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

