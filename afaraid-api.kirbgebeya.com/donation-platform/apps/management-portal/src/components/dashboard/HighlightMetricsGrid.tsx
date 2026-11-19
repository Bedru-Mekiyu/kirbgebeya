import Chart from "react-apexcharts";
import { ArrowDownIcon, ArrowUpIcon } from "../../icons";
import type { HighlightCard } from "../../pages/Dashboard/Home";

interface HighlightMetricsGridProps {
  relativeUpdatedAt: string;
  highlightCards: HighlightCard[];
}

export default function HighlightMetricsGrid({
  relativeUpdatedAt,
  highlightCards,
}: HighlightMetricsGridProps) {

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {highlightCards.map((card) => (
        <article
          key={`detail-${card.id}`}
          className="rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50"
        >
          <div
            className={`rounded-t-3xl bg-gradient-to-r ${card.accent} px-5 py-4 text-white`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-2">
                <card.icon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70">
                  {card.label}
                </p>
                <p className="text-xl font-semibold">{card.value}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 px-5 py-4">
            <p className="text-sm text-slate-500">{card.helper}</p>
            <div className="flex items-center gap-2">
              {card.trend === "up" ? (
                <ArrowUpIcon className="size-4 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="size-4 text-rose-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  card.trend === "up" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {card.delta}
              </span>
              <span className="text-xs text-slate-400">
                {relativeUpdatedAt}
              </span>
            </div>
            <div className="pt-1">
              <Chart
                options={{
                  chart: {
                    type: "line",
                    sparkline: { enabled: true },
                    animations: { enabled: false },
                  },
                  stroke: {
                    curve: "smooth",
                    width: 2,
                    colors: [card.color],
                  },
                  tooltip: { enabled: false },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.3,
                      opacityTo: 0,
                    },
                  },
                }}
                series={[{ name: card.label, data: card.sparkline }]}
                type="area"
                height={70}
              />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}


