import Chart from "react-apexcharts";
import type { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions } from "apexcharts";

interface StatusBreakdownProps {
  paymentOptions: ApexOptions;
  paymentSeries: ApexAxisChartSeries | ApexNonAxisChartSeries;
  activeDonorOptions: ApexOptions;
  activeDonorPercent: number;
  activeDonors: number;
  totalDonors: number;
}

export default function StatusBreakdown({
  paymentOptions,
  paymentSeries,
  activeDonorOptions,
  activeDonorPercent,
  activeDonors,
  totalDonors,
}: StatusBreakdownProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Payment status mix
            </h3>
            <p className="text-sm text-slate-500">
              Completed vs pending vs failed transactions
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Chart options={paymentOptions} series={paymentSeries} type="donut" height={300} />
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Active donor share
            </h3>
            <p className="text-sm text-slate-500">
              Portion of donors active this period
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <Chart
            options={activeDonorOptions}
            series={[activeDonorPercent]}
            type="radialBar"
            height={280}
          />
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          {activeDonors.toLocaleString("en-ET")} active of{" "}
          {totalDonors.toLocaleString("en-ET")} total donors
        </p>
      </article>
    </section>
  );
}


