import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import campaignsService from "../../services/campaignsService";

type CampaignDetailRecord = {
  goalAmount?: number;
  raisedAmount?: number;
  donors?: number;
  location?: string;
  currency?: string;
};

type CampaignRecord = {
  id: string;
  title?: string;
  status?: string;
  detail?: CampaignDetailRecord | CampaignDetailRecord[] | null;
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

function getDetail(
  detail?: CampaignDetailRecord | CampaignDetailRecord[] | null
): CampaignDetailRecord | undefined {
  if (!detail) return undefined;
  return Array.isArray(detail) ? detail[0] : detail;
}

export default function CampaignReports() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await campaignsService.getAllCampaigns({
          include: "detail",
        });
        if (!isMounted) return;
        setCampaigns(Array.isArray(res) ? res : []);
      } catch (e) {
        if (!isMounted) return;
        setError(
          e instanceof Error ? e.message : "Unable to load campaign reports"
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

  const summary = useMemo(() => {
    if (!campaigns.length) {
      return {
        total: 0,
        active: 0,
        completed: 0,
        totalGoal: 0,
        totalRaised: 0,
        donors: 0,
      };
    }
    return campaigns.reduce(
      (acc, campaign) => {
        const detail = getDetail(campaign.detail);
        const goal = Number(detail?.goalAmount ?? 0);
        const raised = Number(detail?.raisedAmount ?? 0);

        acc.total += 1;
        const status = campaign.status?.toLowerCase();
        if (status === "active") acc.active += 1;
        if (status === "completed" || raised >= goal) acc.completed += 1;
        acc.totalGoal += goal;
        acc.totalRaised += raised;
        acc.donors += Number(detail?.donors ?? 0);
        return acc;
      },
      {
        total: 0,
        active: 0,
        completed: 0,
        totalGoal: 0,
        totalRaised: 0,
        donors: 0,
      }
    );
  }, [campaigns]);

  const topCampaigns = useMemo(() => {
    if (!campaigns.length) return [];
    return campaigns
      .map((campaign) => {
        const detail = getDetail(campaign.detail);
        const goal = Number(detail?.goalAmount ?? 0);
        const raised = Number(detail?.raisedAmount ?? 0);
        const progress = goal > 0 ? Math.round((raised / goal) * 100) : 0;
        return {
          id: campaign.id,
          title: campaign.title ?? "Untitled campaign",
          location: detail?.location ?? "—",
          goal,
          raised,
          progress,
        };
      })
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  }, [campaigns]);

  return (
    <>
      <PageMeta
        title="Campaign Reports | Afar Aid"
        description="Performance reporting across active and completed campaigns."
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Reports", href: "#" },
          { label: "Campaign Reports" },
        ]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <ComponentCard title="Total campaigns">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatNumber(summary.total)}
            </p>
          </ComponentCard>
          <ComponentCard title="Active">
            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatNumber(summary.active)}
            </p>
          </ComponentCard>
          <ComponentCard title="Completed / fully funded">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatNumber(summary.completed)}
            </p>
          </ComponentCard>
          <ComponentCard title="Total donors across campaigns">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatNumber(summary.donors)}
            </p>
          </ComponentCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ComponentCard title="Total goal (ETB)" subtitle="All campaigns">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(summary.totalGoal)}
            </p>
          </ComponentCard>
          <ComponentCard title="Total raised (ETB)" subtitle="All campaigns">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(summary.totalRaised)}
            </p>
          </ComponentCard>
        </div>

        <ComponentCard
          title="Top campaigns by progress"
          subtitle="Based on percentage of goal reached"
        >
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
              {error}
            </div>
          )}
          {isLoading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading campaigns…
            </p>
          ) : topCampaigns.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No campaign data available.
            </p>
          ) : (
            <div className="space-y-3">
              {topCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="space-y-2 rounded-2xl border border-slate-100 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {campaign.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {campaign.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Raised / Goal
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(campaign.raised)} /{" "}
                        {formatCurrency(campaign.goal)}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      style={{ width: `${Math.min(campaign.progress, 130)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {campaign.progress}% of goal reached
                  </p>
                </div>
              ))}
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}


