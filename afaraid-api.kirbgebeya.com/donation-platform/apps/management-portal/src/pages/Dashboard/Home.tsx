import {
  type ElementType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ApexOptions } from "apexcharts";
import PageMeta from "../../components/common/PageMeta";
import ExecutiveSummarySection from "../../components/dashboard/ExecutiveSummarySection";
import HighlightMetricsGrid from "../../components/dashboard/HighlightMetricsGrid";
import ServiceModuleGrid from "../../components/dashboard/ServiceModuleGrid";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts";
import StatusBreakdown from "../../components/dashboard/StatusBreakdown";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarLineIcon,
  GroupIcon,
  PieChartIcon,
  ShootingStarIcon,
  TaskIcon,
  BoxIcon,
} from "../../icons";
import { statsService } from "../../services/stats.Service";
import campaignService from "../../services/campaignsService";
import donationsService from "../../services/donationsService";
import donorsService from "../../services/donorsService";
import paymentsService from "../../services/paymentsService";
import goatsService from "../../services/goatsService";
import { socketService } from "@/services/socketService";

type DonationStats = {
  id?: string;
  familiesSupported: number;
  fundsRaised: number;
  goatsDistributed: number;
  updatedAt?: string;
  createdAt?: string;
};

type CampaignDetailRecord = {
  goalAmount?: number;
  raisedAmount?: number;
  donors?: number;
  location?: string;
  currency?: string;
  endDate?: string;
};

type CampaignRecord = {
  id: string;
  title?: string;
  status?: string;
  detail?: CampaignDetailRecord | CampaignDetailRecord[] | null;
};

type RecentDonation = {
  id: string;
  donor?: { firstName?: string; lastName?: string } | string | null;
  campaign?: { title?: string } | string | null;
  totalAmount?: number;
  status?: string;
  method?: string;
  date?: string;
  createdAt?: string;
};

type DonorStats = {
  totalDonors: number;
  activeDonors: number;
  totalDonations: number;
  averageDonation: number;
  topDonors: Array<{
    id?: string;
    firstName?: string;
    lastName?: string;
    donations?: {
      count?: number;
      totalAmount?: number;
      lastDonation?: string;
    };
  }>;
};

type PaymentStats = {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalAmount: number;
  averageAmount: number;
  refundedAmount: number;
};

type GoatAnalytics = {
  totalGoatsDonated: number;
  totalFamiliesSupported: number;
  goatsDonated: number;
  monthlyTrend: number;
  popularCampaigns: Array<{
    name: string;
    goatCount: number;
    percentage: number;
  }>;
  recentDonations: Array<{
    id: string;
    donorName: string;
    quantity: number;
    amount: number;
    date: string;
    campaign: string | null;
  }>;
  currency: string;
};

const PRIMARY_CURRENCY = "ETB";

const defaultStats: DonationStats = {
  familiesSupported: 0,
  fundsRaised: 0,
  goatsDistributed: 0,
};

const defaultDonorStats: DonorStats = {
  totalDonors: 0,
  activeDonors: 0,
  totalDonations: 0,
  averageDonation: 0,
  topDonors: [],
};

const defaultPaymentStats: PaymentStats = {
  totalPayments: 0,
  completedPayments: 0,
  pendingPayments: 0,
  failedPayments: 0,
  totalAmount: 0,
  averageAmount: 0,
  refundedAmount: 0,
};

function formatCurrency(value: number, currency: string = PRIMARY_CURRENCY) {
  const amount = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency,
      maximumFractionDigits: amount >= 100000 ? 0 : 1,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: amount >= 100000 ? 0 : 1,
    }).format(amount);
  }
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatRelativeTime(timestamp?: string) {
  if (!timestamp) return "moments ago";
  const updated = new Date(timestamp);
  if (Number.isNaN(updated.getTime())) return "moments ago";

  const diffMs = Date.now() - updated.getTime();
  const minutes = Math.max(Math.round(diffMs / (1000 * 60)), 0);
  if (minutes < 60) return `${minutes || 1} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function buildSparkline(base: number, fallback: number[] = [4, 5, 4.8, 5.2, 5.6, 6.1, 6.4, 6.8]) {
  if (!base) {
    return fallback;
  }
  const normalized = Math.max(base / 1000, 1);
  return Array.from({ length: 8 }, (_, idx) => {
    const factor = 0.85 + idx * 0.03;
    return Number((normalized * factor).toFixed(2));
  });
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getCampaignDetail(
  detail?: CampaignDetailRecord | CampaignDetailRecord[] | null
): CampaignDetailRecord | undefined {
  if (!detail) return undefined;
  return Array.isArray(detail) ? detail[0] : detail;
}

function clampPercentage(value?: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value as number)));
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

function getStatusColor(status?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === "completed" || normalized === "success") {
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (normalized === "pending") {
    return "text-amber-600 dark:text-amber-400";
  }
  if (normalized === "failed" || normalized === "cancelled") {
    return "text-rose-600 dark:text-rose-400";
  }
  return "text-slate-500 dark:text-slate-400";
}

export type ModuleCard = {
  id: string;
  title: string;
  icon: ElementType;
  value: string;
  detail: string;
  meta: string;
  accent: string;
};

export type SummaryStat = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type HighlightCard = {
  id: string;
  label: string;
  value: string;
  helper: string;
  delta: string;
  trend: "up" | "down";
  icon: ElementType;
  accent: string;
  color: string;
  sparkline: number[];
};

export default function Home() {
  const [stats, setStats] = useState<DonationStats>(defaultStats);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [donorStats, setDonorStats] = useState<DonorStats>(defaultDonorStats);
  const [paymentStats, setPaymentStats] =
    useState<PaymentStats>(defaultPaymentStats);
  const [goatAnalytics, setGoatAnalytics] = useState<GoatAnalytics | null>(
    null
  );
  const [moduleErrors, setModuleErrors] = useState<string[]>([]);
  const [syncTick, setSyncTick] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const hydrateDashboard = async () => {
      const alerts: string[] = [];
      try {
        const results = await Promise.allSettled([
          statsService.getStats(),
          campaignService.getAllCampaigns({ include: "detail" }),
          donationsService.getRecentDonations(6),
          donorsService.getDonorStats(),
          paymentsService.getPaymentStats(),
          goatsService.getGoatAnalytics(),
        ]);

        if (!isMounted) {
          return;
        }

        const [
          statsResult,
          campaignsResult,
          donationsResult,
          donorsResult,
          paymentsResult,
          goatsResult,
        ] = results;

        if (statsResult.status === "fulfilled") {
          setStats({
            ...defaultStats,
            ...statsResult.value,
          });
        } else {
          alerts.push("Stats service unavailable");
        }

        if (campaignsResult.status === "fulfilled") {
          setCampaigns(
            Array.isArray(campaignsResult.value) ? campaignsResult.value : []
          );
        } else {
          alerts.push("Campaign service unavailable");
        }

        if (donationsResult.status === "fulfilled") {
          setRecentDonations(
            Array.isArray(donationsResult.value) ? donationsResult.value : []
          );
        } else {
          alerts.push("Donations feed unavailable");
        }

        if (donorsResult.status === "fulfilled") {
          setDonorStats({
            ...defaultDonorStats,
            ...donorsResult.value,
            topDonors: donorsResult.value?.topDonors ?? [],
          });
        } else {
          alerts.push("Donor statistics unavailable");
        }

        if (paymentsResult.status === "fulfilled") {
          setPaymentStats({
            ...defaultPaymentStats,
            ...paymentsResult.value,
          });
        } else {
          alerts.push("Payments service unavailable");
        }

        if (goatsResult.status === "fulfilled") {
          setGoatAnalytics(goatsResult.value as GoatAnalytics);
        } else {
          alerts.push("Goat analytics offline");
        }
      } finally {
        if (isMounted) {
          setModuleErrors(alerts);
        }
      }
    };

    hydrateDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeRealtime = async () => {
      try {
        await socketService.connect();

        const connected = socketService.isConnected();

        if (connected && isMounted) {
          setIsConnected(true);
          socketService.on('stats_update', (data: any) => {
            if (data?.data && isMounted) {
              setStats(prev => ({ ...prev, ...data.data }));
            }
          });

          socketService.on('donations_update', (data: any) => {
            console.log('Received donations_update:', data);
            if (data?.data && isMounted) {
              setRecentDonations(prev => {
                const newDonations = Array.isArray(data.data) ? data.data : [data.data];
                const merged = [...newDonations, ...prev];
                const unique = merged.filter((donation, index, self) =>
                  index === self.findIndex(d => d.id === donation.id)
                );
                return unique.slice(0, 6);
              });
            }
          });

          socketService.on('connection_established', (data: any) => {
            setIsConnected(true);
          });

          socketService.on('disconnect', () => {
            setIsConnected(false);
          });

        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('❌ Failed to initialize real-time connection:', error);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    initializeRealtime();

    return () => {
      isMounted = false;
      socketService.off('stats_update');
      socketService.off('donations_update');
      socketService.off('connection_established');
      socketService.off('disconnect');
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTick((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socketService.connect();

    const handleStatsUpdate = (newStats: Partial<DonationStats>) => {
      setStats(prev => ({ ...prev, ...newStats, updatedAt: new Date().toISOString() }));
    };

    const handleCampaignsUpdate = (updatedCampaigns: CampaignRecord[]) => {
      setCampaigns(updatedCampaigns);
    };

    const handleDonationsUpdate = (newDonations: RecentDonation[]) => {
      setRecentDonations(prev => {
        const donationsArray = Array.isArray(newDonations) ? newDonations : [newDonations];
        const merged = [...donationsArray, ...prev];
        const unique = merged.filter((donation, index, self) =>
          index === self.findIndex(d => d.id === donation.id)
        );
        return unique.slice(0, 6);
      });
    };

    const handleDonorsUpdate = (newDonorStats: Partial<DonorStats>) => {
      setDonorStats(prev => ({ ...prev, ...newDonorStats }));
    };

    const handlePaymentsUpdate = (newPaymentStats: Partial<PaymentStats>) => {
      setPaymentStats(prev => ({ ...prev, ...newPaymentStats }));
    };

    const handleGoatsUpdate = (newGoatAnalytics: Partial<GoatAnalytics>) => {
      setGoatAnalytics(prev => prev ? { ...prev, ...newGoatAnalytics } : newGoatAnalytics as GoatAnalytics);
    };

    const handleConnectionStatus = () => {
      setIsConnected(socketService.isConnected());
    };

    socketService.on('stats_update', handleStatsUpdate);
    socketService.on('campaigns_update', handleCampaignsUpdate);
    socketService.on('donations_update', handleDonationsUpdate);
    socketService.on('donors_update', handleDonorsUpdate);
    socketService.on('payments_update', handlePaymentsUpdate);
    socketService.on('goats_update', handleGoatsUpdate);
    socketService.on('connect', handleConnectionStatus);
    socketService.on('disconnect', handleConnectionStatus);

    return () => {
      socketService.off('stats_update', handleStatsUpdate);
      socketService.off('campaigns_update', handleCampaignsUpdate);
      socketService.off('donations_update', handleDonationsUpdate);
      socketService.off('donors_update', handleDonorsUpdate);
      socketService.off('payments_update', handlePaymentsUpdate);
      socketService.off('goats_update', handleGoatsUpdate);
      socketService.off('connect', handleConnectionStatus);
      socketService.off('disconnect', handleConnectionStatus);
      socketService.disconnect();
    };
  }, []);

  const campaignOverview = useMemo(() => {
    if (!campaigns.length) {
      return {
        total: 0,
        active: 0,
        completed: 0,
        paused: 0,
        donors: 0,
        progressAvg: 0,
      };
    }

    const summary = campaigns.reduce(
      (acc, campaign) => {
        const detail = getCampaignDetail(campaign.detail);
        const goal = Number(detail?.goalAmount ?? 0);
        const raised = Number(detail?.raisedAmount ?? 0);
        const progress = goal > 0 ? (raised / goal) * 100 : 0;

        const status = campaign.status?.toLowerCase() ?? "";
        acc.active += status === "active" ? 1 : 0;
        acc.completed += progress >= 100 || status === "completed" ? 1 : 0;
        acc.paused += status === "paused" ? 1 : 0;
        acc.donors += Number(detail?.donors ?? 0);
        acc.progressAvg += progress;

        return acc;
      },
      {
        total: campaigns.length,
        active: 0,
        completed: 0,
        paused: 0,
        donors: 0,
        progressAvg: 0,
      }
    );

    summary.progressAvg = summary.total
      ? Math.round((summary.progressAvg / summary.total) * 10) / 10
      : 0;

    return summary;
  }, [campaigns]);

  const donationVolume = useMemo(
    () =>
      recentDonations.reduce(
        (sum, item) => sum + Number(item.totalAmount ?? 0),
        0
      ),
    [recentDonations]
  );

  const paymentSuccessRate = useMemo(() => {
    if (!paymentStats.totalPayments) return 0;
    return (
      Math.round(
        (paymentStats.completedPayments / paymentStats.totalPayments) * 1000
      ) / 10
    );
  }, [paymentStats]);

  const goatTrend = goatAnalytics?.monthlyTrend ?? 0;


  const serviceModules = useMemo<ModuleCard[]>(
    () => [
      {
        id: "campaigns",
        title: "Campaigns",
        icon: TaskIcon,
        value: `${campaignOverview.active} active`,
        detail: `${campaignOverview.total} total initiatives`,
        meta: `${campaignOverview.progressAvg}% avg funded`,
        accent: "bg-sky-50 dark:bg-sky-500/10",
      },
      {
        id: "donations",
        title: "Donations",
        icon: DollarLineIcon,
        value: formatCurrency(stats.fundsRaised),
        detail: `${recentDonations.length} new this week`,
        meta: `${formatCurrency(donorStats.averageDonation)} avg gift`,
        accent: "bg-emerald-50 dark:bg-emerald-500/10",
      },
      {
        id: "payments",
        title: "Payments",
        icon: PieChartIcon,
        value: formatCurrency(paymentStats.totalAmount),
        detail: `${paymentStats.completedPayments}/${paymentStats.totalPayments} settled`,
        meta: `${paymentSuccessRate}% success`,
        accent: "bg-indigo-50 dark:bg-indigo-500/10",
      },
      {
        id: "donors",
        title: "Donors",
        icon: GroupIcon,
        value: formatNumber(donorStats.totalDonors),
        detail: `${formatNumber(donorStats.activeDonors)} active`,
        meta: `${formatNumber(donorStats.totalDonations)} lifetime gifts`,
        accent: "bg-amber-50 dark:bg-amber-500/10",
      },
      {
        id: "goats",
        title: "Goat Program",
        icon: BoxIcon,
        value: formatNumber(
          goatAnalytics?.totalGoatsDonated ?? stats.goatsDistributed
        ),
        detail: `${formatNumber(
          goatAnalytics?.totalFamiliesSupported ??
          Math.floor(stats.goatsDistributed / 3)
        )} families`,
        meta: `${goatTrend >= 0 ? "+" : ""}${goatTrend.toFixed(1)}% monthly`,
        accent: "bg-rose-50 dark:bg-rose-500/10",
      },
    ],
    [
      campaignOverview,
      stats,
      recentDonations.length,
      donorStats,
      paymentStats,
      paymentSuccessRate,
      goatAnalytics,
      goatTrend,
    ]
  );

  const focusProjects = useMemo(() => {
    if (!campaigns.length) return [];
    return campaigns
      .map((campaign) => {
        const detail = getCampaignDetail(campaign.detail);
        const goal = Number(detail?.goalAmount ?? 0);
        const raised = Number(detail?.raisedAmount ?? 0);
        const currency = detail?.currency ?? "USD";
        const progress = goal > 0 ? clampPercentage((raised / goal) * 100) : 0;

        return {
          id: campaign.id,
          title: campaign.title ?? "Untitled campaign",
          amount: raised,
          currency,
          progress,
          owners: [detail?.location ?? "Headquarters"],
        };
      })
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
  }, [campaigns]);

  const activityLog = useMemo(
    () => [
      {
        id: "donations",
        title: `${formatCurrency(donationVolume)} captured`,
        detail: `${recentDonations.length} donations synced`,
        change: `${formatCurrency(
          donationVolume / Math.max(recentDonations.length || 1, 1)
        )} avg`,
        trend: "up" as const,
      },
      {
        id: "payments",
        title: `${paymentSuccessRate}% payment success`,
        detail: `${formatCurrency(paymentStats.totalAmount)} settled`,
        change: `${paymentStats.pendingPayments} pending`,
        trend: paymentSuccessRate >= 70 ? ("up" as const) : ("down" as const),
      },
      {
        id: "goats",
        title: `${formatNumber(
          goatAnalytics?.totalGoatsDonated ?? stats.goatsDistributed
        )} goats mobilized`,
        detail: `${formatNumber(
          goatAnalytics?.popularCampaigns?.[0]?.goatCount ?? 0
        )} from top campaign`,
        change: `${goatTrend >= 0 ? "+" : ""}${goatTrend.toFixed(1)}% trend`,
        trend: goatTrend >= 0 ? ("up" as const) : ("down" as const),
      },
    ],
    [
      donationVolume,
      recentDonations.length,
      paymentSuccessRate,
      paymentStats,
      goatAnalytics,
      goatTrend,
      stats.goatsDistributed,
    ]
  );

  const topDonors = donorStats.topDonors?.slice(0, 4) ?? [];
  const recentDonationEntries = useMemo(
    () => recentDonations.slice(0, 5),
    [recentDonations]
  );
  const goatLeaderboard = goatAnalytics?.popularCampaigns ?? [];
  const hasModuleAlerts = moduleErrors.length > 0;
  const heroAlert = hasModuleAlerts ? moduleErrors[0] : null;
  const summaryStats = useMemo<SummaryStat[]>(
    () => [
      {
        id: "managed-funds",
        label: "Managed funds (ETB)",
        value: formatCurrency(stats.fundsRaised, PRIMARY_CURRENCY),
        detail: "Verified treasury balance",
      },
      {
        id: "weekly-volume",
        label: "Weekly volume",
        value: formatCurrency(donationVolume, PRIMARY_CURRENCY),
        detail: `${recentDonations.length} donations processed`,
      },
      {
        id: "average-gift",
        label: "Average gift size",
        value: formatCurrency(donorStats.averageDonation, PRIMARY_CURRENCY),
        detail: "Rolling 30 day mean",
      },
    ],
    [
      stats.fundsRaised,
      donationVolume,
      recentDonations.length,
      donorStats.averageDonation,
    ]
  );
  const relativeUpdatedAt = useMemo(
    () => formatRelativeTime(stats.updatedAt),
    [stats.updatedAt, syncTick]
  );

  const enhancedModuleErrors = useMemo(() => {
    const errors = [...moduleErrors];
    if (!isConnected) {
      errors.unshift("Real-time updates disconnected - showing cached data");
    }
    return errors;
  }, [moduleErrors, isConnected]);
  const handleExportSnapshot = useCallback(() => {
    window.print();
  }, []);

  const fallbackDonationTrend = [
    { date: "2024-06-01", amount: 54000 },
    { date: "2024-06-08", amount: 62000 },
    { date: "2024-06-15", amount: 41000 },
    { date: "2024-06-22", amount: 73000 },
    { date: "2024-06-29", amount: 58000 },
    { date: "2024-07-06", amount: 76000 },
    { date: "2024-07-13", amount: 89000 },
  ];

  const donationTrend = useMemo(() => {
    const dataset =
      recentDonations.length > 0
        ? recentDonations.map((item) => ({
          date: item.date ?? item.createdAt ?? "",
          amount: Number(item.totalAmount ?? 0),
        }))
        : fallbackDonationTrend;

    const grouped = dataset.reduce<Record<string, number>>((acc, entry) => {
      const key = entry.date
        ? new Date(entry.date).toISOString().split("T")[0]
        : "unknown";
      if (!acc[key]) acc[key] = 0;
      acc[key] += entry.amount;
      return acc;
    }, {});

    const sorted = Object.entries(grouped)
      .filter(([key]) => key !== "unknown")
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-8);

    return {
      categories: sorted.map(([date]) =>
        new Date(date).toLocaleDateString("en-ET", {
          month: "short",
          day: "numeric",
        })
      ),
      values: sorted.map(([, amount]) =>
        Math.round((amount / 1000) * 10) / 10
      ),
    };
  }, [recentDonations]);

  const donationChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        fontFamily: "Outfit, sans-serif",
        toolbar: { show: false },
        sparkline: { enabled: false },
      },
      stroke: { curve: "smooth", width: 2 },
      dataLabels: { enabled: false },
      grid: { borderColor: "rgba(148,163,184,0.2)" },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0,
        },
      },
      xaxis: {
        categories: donationTrend.categories,
        labels: { style: { colors: "#64748B" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `${value.toFixed(0)}k`,
          style: { colors: "#64748B" },
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value.toFixed(1)}k ETB`,
        },
      },
      colors: ["#10B981"],
    }),
    [donationTrend]
  );

  const campaignStatusSeries = useMemo(
    () => ({
      categories: ["Active", "Completed", "Paused"],
      values: [
        campaignOverview.active,
        campaignOverview.completed,
        campaignOverview.paused,
      ],
    }),
    [campaignOverview]
  );

  const campaignChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        fontFamily: "Outfit, sans-serif",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
          borderRadius: 8,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: campaignStatusSeries.categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#64748B" } },
      },
      yaxis: {
        labels: { style: { colors: "#64748B" } },
      },
      colors: ["#2563EB"],
      grid: { borderColor: "rgba(148,163,184,0.2)" },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} campaigns`,
        },
      },
    }),
    [campaignStatusSeries]
  );
  const donationChartSeries = useMemo(
    () => [
      {
        name: "Donation volume (k ETB)",
        data: donationTrend.values,
      },
    ],
    [donationTrend]
  );

  const campaignChartSeries = useMemo(
    () => [
      {
        name: "Campaigns",
        data: campaignStatusSeries.values,
      },
    ],
    [campaignStatusSeries]
  );
  const paymentStatusSeries = useMemo(
    () => ({
      labels: ["Completed", "Pending", "Failed"],
      values: [
        paymentStats.completedPayments ?? 0,
        paymentStats.pendingPayments ?? 0,
        paymentStats.failedPayments ?? 0,
      ],
    }),
    [paymentStats]
  );

  const paymentStatusOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "Outfit, sans-serif",
      },
      labels: paymentStatusSeries.labels,
      legend: {
        show: true,
        position: "bottom",
        fontSize: "13px",
      },
      stroke: {
        colors: ["transparent"],
      },
      colors: ["#10B981", "#F59E0B", "#F87171"],
      dataLabels: {
        enabled: false,
      },
    }),
    [paymentStatusSeries]
  );

  const paymentStatusValues = paymentStatusSeries.values;

  const activeDonorPercent = useMemo(() => {
    if (!donorStats.totalDonors) return 0;
    return Math.round(
      (donorStats.activeDonors / donorStats.totalDonors) * 1000
    ) / 10;
  }, [donorStats]);

  const activeDonorOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "radialBar",
        fontFamily: "Outfit, sans-serif",
        sparkline: { enabled: true },
      },
      plotOptions: {
        radialBar: {
          hollow: { size: "65%" },
          track: { background: "rgba(99,102,241,0.12)" },
          dataLabels: {
            name: {
              show: true,
              fontSize: "14px",
              color: "#6B7280",
              offsetY: 20,
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: 600,
              formatter: (value: number) => `${value.toFixed(1)}%`,
            },
          },
        },
      },
      labels: ["Active donors"],
      colors: ["#6366F1"],
    }),
    []
  );

  const highlightCards = useMemo<HighlightCard[]>(
    () => [
      {
        id: "funds",
        label: "Funds Raised",
        value: formatCurrency(stats.fundsRaised),
        helper: `${formatNumber(
          paymentStats.completedPayments
        )} payments settled`,
        delta: `${paymentSuccessRate || 0}% success`,
        trend: paymentSuccessRate >= 70 ? ("up" as const) : ("down" as const),
        icon: DollarLineIcon,
        accent: "from-sky-500 to-blue-600",
        color: "#0ea5e9",
        sparkline: donationTrend.values.length
          ? donationTrend.values
          : [42, 45, 44, 48, 52, 54, 58, 61],
      },
      {
        id: "families",
        label: "Families Supported",
        value: formatNumber(stats.familiesSupported),
        helper: `${formatNumber(stats.goatsDistributed)} goats distributed`,
        delta: `${formatCurrency(donorStats.averageDonation)} avg gift`,
        trend: "up" as const,
        icon: GroupIcon,
        accent: "from-emerald-500 to-emerald-600",
        color: "#10b981",
        sparkline: buildSparkline(stats.familiesSupported, [
          3.5, 3.8, 4.2, 4.5, 4.8, 5.1, 5.5, 5.9,
        ]),
      },
      {
        id: "goats",
        label: "Goat Mobilization",
        value: formatNumber(
          goatAnalytics?.totalGoatsDonated ?? stats.goatsDistributed
        ),
        helper: `${formatNumber(
          goatAnalytics?.totalFamiliesSupported ??
          Math.floor(stats.goatsDistributed / 3)
        )} families aided`,
        delta: `${goatTrend >= 0 ? "+" : ""}${goatTrend.toFixed(1)}% trend`,
        trend: goatTrend >= 0 ? ("up" as const) : ("down" as const),
        icon: ShootingStarIcon,
        accent: "from-amber-500 to-orange-500",
        color: "#f59e0b",
        sparkline: buildSparkline(
          goatAnalytics?.totalGoatsDonated ?? stats.goatsDistributed,
          [2, 2.3, 2.1, 2.4, 2.8, 3.1, 3.5, 3.8]
        ),
      },
    ],
    [
      stats,
      paymentStats.completedPayments,
      paymentSuccessRate,
      donorStats.averageDonation,
      goatAnalytics,
      goatTrend,
      donationTrend.values,
    ]
  );

  return (
    <>
      <PageMeta
        title="Management Dashboard | Afar Aid"
        description="Live operational intelligence for Afar Aid leaders."
      />

      <div className={`rounded-3xl border p-4 ${isConnected
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100'
        : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`size-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <p className="text-sm font-semibold">
              {isConnected ? 'Live data connected' : 'Real-time updates disconnected'}
            </p>
          </div>
          <span className="text-xs opacity-75">
            Last updated: {relativeUpdatedAt}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {hasModuleAlerts && (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
            <p className="text-sm font-semibold uppercase tracking-wide">
              Service notifications
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {moduleErrors.map((alert) => (
                <span
                  key={alert}
                  className="rounded-full border border-amber-200 bg-white/60 px-3 py-1 text-amber-800 dark:border-white/20 dark:bg-white/5 dark:text-amber-100"
                >
                  {alert}
                </span>
              ))}
            </div>
          </section>
        )}

        <ExecutiveSummarySection
          highlightCards={highlightCards}
          summaryStats={summaryStats}
          heroAlert={heroAlert}
          relativeUpdatedAt={relativeUpdatedAt}
          familiesSupportedLabel={formatNumber(stats.familiesSupported)}
          onExportSnapshot={handleExportSnapshot}
          insightMetricValue={formatCurrency(stats.fundsRaised)}
          InsightIcon={TaskIcon}
          isLive={isConnected}
        />

        <ServiceModuleGrid modules={serviceModules} />

        <AnalyticsCharts
          donationOptions={donationChartOptions}
          donationSeries={donationChartSeries}
          campaignOptions={campaignChartOptions}
          campaignSeries={campaignChartSeries}
          hasDonationData={donationTrend.values.length > 0}
        />

        <StatusBreakdown
          paymentOptions={paymentStatusOptions}
          paymentSeries={paymentStatusValues}
          activeDonorOptions={activeDonorOptions}
          activeDonorPercent={activeDonorPercent}
          activeDonors={donorStats.activeDonors}
          totalDonors={donorStats.totalDonors}
        />

        <HighlightMetricsGrid
          relativeUpdatedAt={relativeUpdatedAt}
          highlightCards={highlightCards}
        />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Top donors
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Relationship strength
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-white/70">
                {formatNumber(donorStats.totalDonors)} total
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {topDonors.length === 0 && (
                <p className="text-sm text-slate-500">
                  No donor leaderboard available from the service yet.
                </p>
              )}
              {topDonors.map((donor) => (
                <div
                  key={donor.id ?? donor.firstName}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 dark:border-white/5"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatDonorName(donor)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {donor.donations?.count ?? 0} gifts • Last{" "}
                      {formatDate(donor.donations?.lastDonation)}
                    </p>
                  </div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(donor.donations?.totalAmount ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Goat deployment
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Campaign leaderboard
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-white/70">
                {formatNumber(goatAnalytics?.totalGoatsDonated ?? 0)} goats
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {goatLeaderboard.length === 0 && (
                <p className="text-sm text-slate-500">
                  Goat analytics service not returning leaderboard data yet.
                </p>
              )}
              {goatLeaderboard.map((entry) => (
                <div key={entry.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {entry.name}
                    </p>
                    <p className="text-slate-700 dark:text-slate-200">
                      {entry.goatCount} goats
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${clampPercentage(entry.percentage)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {clampPercentage(entry.percentage)}% of program volume
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Recent donations
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Live feed from donations service
              </h3>
            </div>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">
              {recentDonationEntries.length}/{recentDonations.length} showing
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {recentDonationEntries.length === 0 && (
              <p className="text-sm text-slate-500">
                Donation service has not returned any records yet.
              </p>
            )}
            {recentDonationEntries.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 dark:border-white/5 dark:hover:border-white/10 md:grid-cols-5"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Donor
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatDonorName(item.donor)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Campaign
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCampaignName(item.campaign)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Amount
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(item.totalAmount ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatDate(item.date)}
                  </p>
                </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Status
                    </p>
                    <p
                      className={`text-sm font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status ?? "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.method ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className="col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Field activity
                </h3>
                <p className="text-sm text-slate-500">
                  Interventions, logistics and funding indicators
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {activityLog.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 dark:border-white/5 dark:hover:border-white/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {entry.title}
                    </p>
                    <p className="text-xs text-slate-500">{entry.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {entry.trend === "up" ? (
                      <ArrowUpIcon className="size-4 text-emerald-500" />
                    ) : (
                      <ArrowDownIcon className="size-4 text-rose-500" />
                    )}
                    <span
                      className={
                        entry.trend === "up"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }
                    >
                      {entry.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Operational runway
                </h3>
                <p className="text-sm text-slate-500">
                  Priority programs with live allocations
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/5 dark:text-white/70">
                Auto-sync
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {focusProjects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {project.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        Owners: {project.owners.join(", ")}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(project.amount)}
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </>
  );
}
