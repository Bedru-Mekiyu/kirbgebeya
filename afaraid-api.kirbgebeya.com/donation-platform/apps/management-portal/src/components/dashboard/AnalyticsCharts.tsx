import Chart from "react-apexcharts";
import type {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexOptions,
} from "apexcharts";

interface AnalyticsChartsProps {
  donationOptions: ApexOptions;
  donationSeries: ApexAxisChartSeries | ApexNonAxisChartSeries;
  campaignOptions: ApexOptions;
  campaignSeries: ApexAxisChartSeries | ApexNonAxisChartSeries;
  hasDonationData: boolean;
}

export default function AnalyticsCharts({
  donationOptions,
  donationSeries,
  campaignOptions,
  campaignSeries,
  hasDonationData,
}: AnalyticsChartsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Donation velocity
            </h3>
            <p className="text-sm text-slate-500">
              Aggregated contribution totals (k ETB)
            </p>
          </div>
        </div>
        <div className="mt-4">
          {hasDonationData ? (
            <Chart
              options={donationOptions}
              series={donationSeries}
              type="area"
              height={280}
            />
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Waiting for donation data…
            </p>
          )}
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Campaign health
            </h3>
            <p className="text-sm text-slate-500">
              Distribution of active programs
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Chart
            options={campaignOptions}
            series={campaignSeries}
            type="bar"
            height={280}
          />
        </div>
      </article>
    </section>
  );
}


