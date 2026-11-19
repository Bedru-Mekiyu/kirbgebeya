import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import donationsService from "../../services/donationsService";

type DonationStatResponse = {
  totalDonations: number;
  totalAmount: number;
  averageDonation: number;
};

type RecentDonation = {
  id: string;
  donor?: { firstName?: string; lastName?: string } | string | null;
  campaign?: { title?: string } | string | null;
  totalAmount?: number;
  status?: string;
  date?: string;
};

const REPORT_CURRENCY = "ETB";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: REPORT_CURRENCY,
    maximumFractionDigits: value >= 100000 ? 0 : 1,
  }).format(value ?? 0);
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

function formatDonorName(
  donor?: { firstName?: string; lastName?: string } | string | null
) {
  if (!donor) return "Anonymous";
  if (typeof donor === "string") return donor;
  const fullName = `${donor.firstName ?? ""} ${donor.lastName ?? ""}`.trim();
  return fullName || "Anonymous";
}

function formatCampaignName(
  campaign?: { title?: string } | string | null
): string {
  if (!campaign) return "General Donation";
  if (typeof campaign === "string") return campaign;
  return campaign.title ?? "General Donation";
}

export default function DonationReports() {
  const [stats, setStats] = useState<DonationStatResponse | null>(null);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statRes, recentRes] = await Promise.all([
          donationsService.getDonationStats(),
          donationsService.getRecentDonations(20),
        ]);
        if (!isMounted) return;
        setStats(statRes);
        setRecentDonations(Array.isArray(recentRes) ? recentRes : []);
      } catch (e) {
        if (!isMounted) return;
        setError(
          e instanceof Error ? e.message : "Unable to load donation reports"
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

  const headline = useMemo(() => {
    if (!stats) {
      return {
        total: "—",
        volume: "—",
        average: "—",
      };
    }
    return {
      total: new Intl.NumberFormat("en-ET").format(stats.totalDonations ?? 0),
      volume: formatCurrency(stats.totalAmount ?? 0),
      average: formatCurrency(stats.averageDonation ?? 0),
    };
  }, [stats]);

  return (
    <>
      <PageMeta
        title="Donation Reports | Afar Aid"
        description="Operational reporting on donation volume, trends, and recent activity."
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Reports", href: "#" },
          { label: "Donation Reports" },
        ]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <ComponentCard title="Total donations" subtitle="All-time records">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {headline.total}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Completed and pending donations recorded by the service
            </p>
          </ComponentCard>

          <ComponentCard title="Total volume (ETB)" subtitle="Gross donated">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {headline.volume}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Based on donation totals reported in ETB
            </p>
          </ComponentCard>

          <ComponentCard title="Average gift" subtitle="Per donation">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {headline.average}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Mean value across all recorded donations
            </p>
          </ComponentCard>
        </div>

        <ComponentCard
          title="Recent donations"
          subtitle="Latest 20 records from the donation service"
        >
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
              {error}
            </div>
          )}

          {isLoading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading donations…
            </p>
          ) : recentDonations.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No donation records available yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-3 py-2">Donor</th>
                    <th className="px-3 py-2">Campaign</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDonations.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {formatDonorName(item.donor)}
                      </td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                        {formatCampaignName(item.campaign)}
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.totalAmount ?? 0)}
                      </td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                        {item.status ?? "Unknown"}
                      </td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                        {formatDate(item.date)}
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


