import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import donorsService from "../../services/donorsService";

type DonorStat = {
  totalDonors: number;
  activeDonors: number;
  totalDonations: number;
  averageDonation: number;
  topDonors: Array<{
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    donations?: {
      count?: number;
      totalAmount?: number;
      lastDonation?: string;
    };
  }>;
};

const REPORT_CURRENCY = "ETB";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: REPORT_CURRENCY,
    maximumFractionDigits: value >= 100000 ? 0 : 1,
  }).format(value ?? 0);
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("en-ET", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatDonorName(donor: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  const fullName = `${donor.firstName ?? ""} ${donor.lastName ?? ""}`.trim();
  return fullName || donor.email || "Unknown donor";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-ET", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DonorInsights() {
  const [stats, setStats] = useState<DonorStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await donorsService.getDonorStats();
        if (!isMounted) return;
        setStats(res);
      } catch (e) {
        if (!isMounted) return;
        setError(
          e instanceof Error ? e.message : "Unable to load donor insights"
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const topDonors = useMemo(
    () => stats?.topDonors?.slice(0, 10) ?? [],
    [stats]
  );

  return (
    <>
      <PageMeta
        title="Donor Insights | Afar Aid"
        description="Key metrics and top contributors across the donor base."
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Reports", href: "#" },
          { label: "Donor Insights" },
        ]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <ComponentCard title="Total donors">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatNumber(stats?.totalDonors)}
            </p>
          </ComponentCard>
          <ComponentCard title="Active donors">
            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatNumber(stats?.activeDonors)}
            </p>
          </ComponentCard>
          <ComponentCard title="Total donations">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatNumber(stats?.totalDonations)}
            </p>
          </ComponentCard>
          <ComponentCard title="Average donation value">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(stats?.averageDonation ?? 0)}
            </p>
          </ComponentCard>
        </div>

        <ComponentCard
          title="Top donors by lifetime value"
          subtitle="Based on total amount donated"
        >
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
              {error}
            </div>
          )}
          {isLoading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading donors…
            </p>
          ) : topDonors.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No donor insight data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-3 py-2">Donor</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Donations</th>
                    <th className="px-3 py-2">Total amount</th>
                    <th className="px-3 py-2">Last donation</th>
                  </tr>
                </thead>
                <tbody>
                  {topDonors.map((donor) => (
                    <tr
                      key={donor.id ?? donor.email}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {formatDonorName(donor)}
                      </td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                        {donor.email ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {formatNumber(donor.donations?.count ?? 0)}
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {formatCurrency(donor.donations?.totalAmount ?? 0)}
                      </td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                        {formatDate(donor.donations?.lastDonation)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}


