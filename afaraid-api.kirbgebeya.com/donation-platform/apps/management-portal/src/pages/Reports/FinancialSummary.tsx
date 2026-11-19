import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import paymentsService from "../../services/paymentsService";

type PaymentStats = {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalAmount: number;
  averageAmount: number;
  refundedAmount: number;
};

type RecentPayment = {
  id: string;
  donationId: string;
  paymentMethod?: string;
  amount?: number;
  status?: string;
  tx_ref?: string;
  transactionId?: string;
  createdAt?: string;
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

function statusChip(status?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === "completed") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (normalized === "pending") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  if (normalized === "failed" || normalized === "refunded") {
    return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  }
  return "bg-slate-50 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200";
}

export default function FinancialSummary() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsRes, recentRes] = await Promise.all([
          paymentsService.getPaymentStats(),
          paymentsService.getRecentPayments(20),
        ]);
        if (!isMounted) return;
        console.log("Financial stats:", statsRes);
        console.log("Recent payments:", recentRes);
        setStats(statsRes);
        setRecentPayments(Array.isArray(recentRes) ? recentRes : []);
      } catch (e) {
        if (!isMounted) return;
        setError(
          e instanceof Error ? e.message : "Unable to load financial summary"
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

  const completionRate =
    stats && stats.totalPayments
      ? Math.round((stats.completedPayments / stats.totalPayments) * 1000) / 10
      : 0;

  return (
    <>
      <PageMeta
        title="Financial Summary | Afar Aid"
        description="High-level overview of payments, settlements and refunds."
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Reports", href: "#" },
          { label: "Financial Summary" },
        ]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <ComponentCard title="Total payments">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatNumber(stats?.totalPayments)}
            </p>
          </ComponentCard>
          <ComponentCard title="Completed">
            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatNumber(stats?.completedPayments)}
            </p>
          </ComponentCard>
          <ComponentCard title="Pending">
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
              {formatNumber(stats?.pendingPayments)}
            </p>
          </ComponentCard>
          <ComponentCard title="Failed / refunded">
            <p className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
              {formatNumber(
                (stats?.failedPayments ?? 0) + (stats?.refundedAmount ? 1 : 0)
              )}
            </p>
          </ComponentCard>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ComponentCard title="Total settled (ETB)">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(stats?.totalAmount ?? 0)}
            </p>
          </ComponentCard>
          <ComponentCard title="Average ticket size">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(stats?.averageAmount ?? 0)}
            </p>
          </ComponentCard>
          <ComponentCard title="Completion rate">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {completionRate}%
            </p>
          </ComponentCard>
        </div>

        <ComponentCard
          title="Recent payments"
          subtitle="Latest 20 records from the payment service"
        >
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
              {error}
            </div>
          )}
          {isLoading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading payments…
            </p>
          ) : recentPayments.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No payment data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-3 py-2">Transaction</th>
                    <th className="px-3 py-2">Method</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {payment.tx_ref ?? payment.tx_ref}
                      </td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                        {payment.paymentMethod ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {formatCurrency(payment.amount ?? 0)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusChip(
                            payment.status
                          )}`}
                        >
                          {payment.status ?? "Unknown"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                        {formatDate(payment.createdAt)}
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


