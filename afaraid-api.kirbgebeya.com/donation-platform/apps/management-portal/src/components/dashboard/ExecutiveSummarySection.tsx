import { PieChartIcon, BoltIcon } from "../../icons";
import type { HighlightCard, SummaryStat } from "../../pages/Dashboard/Home";
import type { ElementType } from "react";

interface ExecutiveSummarySectionProps {
  highlightCards: HighlightCard[];
  summaryStats: SummaryStat[];
  heroAlert: string | null;
  relativeUpdatedAt: string;
  familiesSupportedLabel: string;
  onExportSnapshot: () => void;
  insightMetricValue: string;
  InsightIcon: ElementType;
  isLive?: boolean;
}

export default function ExecutiveSummarySection({
  highlightCards,
  summaryStats,
  heroAlert,
  relativeUpdatedAt,
  familiesSupportedLabel,
  onExportSnapshot,
  insightMetricValue,
  InsightIcon,
  isLive = false,
}: ExecutiveSummarySectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <article className="relative col-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 text-slate-900 shadow-lg transition dark:border-white/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 dark:text-white">
        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-slate-200/60 blur-3xl animate-[spin_40s_linear_infinite] dark:bg-white/10" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl animate-[pulse_8s_ease-in-out_infinite] dark:bg-emerald-500/10" />

        {/* Real-time connection indicator */}
        {isLive && (
          <div className="pointer-events-none absolute -right-4 -top-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-60 blur-lg animate-ping" />
              <div className="relative rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                LIVE
              </div>
            </div>
          </div>
        )}

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">
                  Executive Summary
                </p>
                {isLive && (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    REAL-TIME
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-semibold leading-tight">
                Afar Aid impact snapshot
              </h1>
              <p className="mt-2 text-base text-slate-600 dark:text-white/70">
                Centralized visibility into funding, beneficiary reach, and
                logistics with live reporting and alerting.
                {isLive && (
                  <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                    • Live updates active
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onExportSnapshot}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-semibold text-slate-700 shadow transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-600 dark:border-white/20 dark:bg-white/10 dark:text-white/80"
            >
              <PieChartIcon className="size-4" />
              Export snapshot
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {highlightCards.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:bg-white/10 ${isLive ? 'ring-1 ring-emerald-200/50 dark:ring-emerald-500/20' : ''
                  }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">
                    {card.label}
                  </p>
                  {isLive && (
                    <div className="flex items-center gap-1">
                      <div className="relative flex">
                        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-60 blur-[1px] animate-ping" />
                        <span className="relative size-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/60">
                  {card.helper}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${card.trend === 'up'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                    }`}>
                    {card.trend === 'up' ? '↗' : '↘'} {card.delta}
                  </span>
                  {isLive && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      • live
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {summaryStats.map((stat) => (
              <div
                key={stat.id}
                className={`rounded-2xl border border-white/80 bg-white/70 p-4 text-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 dark:border-white/10 dark:bg-white/5 ${isLive ? 'ring-1 ring-blue-200/30 dark:ring-blue-500/10' : ''
                  }`}
              >
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">
                  {stat.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-white/70">
            <span className={`inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-slate-700 shadow transition dark:bg-white/10 dark:text-white ${isLive ? 'ring-1 ring-emerald-200 dark:ring-emerald-500/30' : ''
              }`}>
              <span className="relative flex items-center gap-2">
                <span className="relative flex">
                  <span className={`absolute inset-0 rounded-full opacity-60 blur-[1px] animate-ping ${isLive
                      ? 'bg-emerald-400'
                      : 'bg-slate-400'
                    }`} />
                  <span className={`relative size-2 rounded-full ${isLive
                      ? 'bg-emerald-500'
                      : 'bg-slate-500'
                    }`} />
                </span>
                <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-widest">
                  <BoltIcon className="size-3.5" />
                  {isLive ? 'Live sync' : 'Cached data'}
                </span>
              </span>
              {relativeUpdatedAt}
            </span>

            {heroAlert ? (
              <span className="text-rose-500 dark:text-rose-200">
                {heroAlert} — monitoring
              </span>
            ) : isLive ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Live tracking {familiesSupportedLabel} active family records
              </span>
            ) : (
              <span>Tracking {familiesSupportedLabel} active family records</span>
            )}
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Insight mode
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              Impact control room
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                LIVE
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-white/70">
              v2.1 beta
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Active funds
              </p>
              {isLive && (
                <div className="relative flex">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-60 blur-[1px] animate-ping" />
                  <span className="relative size-1.5 rounded-full bg-emerald-500" />
                </div>
              )}
            </div>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">
              {insightMetricValue}
            </p>
            <p className="text-xs text-slate-500">
              {isLive ? 'Live validation by finance' : 'Validated by finance'}
            </p>
          </div>

          <div className={`flex flex-col gap-3 rounded-2xl p-4 ${isLive
              ? 'bg-emerald-50/80 ring-1 ring-emerald-200/30 dark:bg-emerald-500/10 dark:ring-emerald-500/20'
              : 'bg-slate-50 dark:bg-slate-800/60'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-2xl shadow ${isLive
                  ? 'bg-white ring-1 ring-emerald-200 dark:bg-slate-900'
                  : 'bg-white dark:bg-slate-900'
                }`}>
                <InsightIcon className={`size-5 ${isLive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-white/80'
                  }`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Operational focus</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  4 live initiatives
                </p>
              </div>
            </div>
            <p className={`text-sm ${isLive
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-slate-500 dark:text-slate-400'
              }`}>
              {isLive
                ? 'Real-time resource prioritization from logistics workflows.'
                : 'Resource prioritization updated from logistics workflows.'
              }
            </p>
          </div>

          {/* Real-time status indicator */}
          {isLive && (
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 ring-1 ring-emerald-200/20 dark:from-emerald-500/5 dark:to-green-500/5 dark:ring-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                  <BoltIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Real-time Mode Active
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    All metrics updating live from field operations
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}