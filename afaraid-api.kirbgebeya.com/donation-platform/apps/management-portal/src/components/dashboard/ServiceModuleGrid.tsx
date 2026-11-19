import type { ModuleCard } from "../../pages/Dashboard/Home";

interface ServiceModuleGridProps {
  modules: ModuleCard[];
}

export default function ServiceModuleGrid({ modules }: ServiceModuleGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {modules.map((module) => (
        <article
          key={module.id}
          className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50"
        >
          <div
            className={`inline-flex size-12 items-center justify-center rounded-2xl ${module.accent}`}
          >
            <module.icon className="size-5 text-slate-700 dark:text-white/80" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {module.title}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {module.value}
            </p>
          </div>
          <p className="text-sm text-slate-500">{module.detail}</p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {module.meta}
          </p>
        </article>
      ))}
    </section>
  );
}


