import { useEffect, useState } from "react";

export default function ProgressCard({ campaign, formatAmount }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressPercentage =
    (campaign.detail.raisedAmount / campaign.detail.goalAmount) * 100;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 10;

    const increment = (progressPercentage / duration) * stepTime;

    const interval = setInterval(() => {
      start += increment;
      if (start >= progressPercentage) {
        start = progressPercentage;
        clearInterval(interval);
      }
      setAnimatedProgress(start);
    }, stepTime);

    return () => clearInterval(interval);
  }, [progressPercentage]);

  const remainingAmount = Math.max(
    campaign.detail.goalAmount - campaign.detail.raisedAmount,
    0
  );

  const remainingPercentage = Math.max(100 - animatedProgress, 0);

  const getProgressColor = (progress) => {
    if (progress >= 100) return "from-green-600 to-emerald-500";
    if (progress >= 75) return "from-green-500 to-emerald-400";
    if (progress >= 50) return "from-lime-400 to-amber-400";
    return "from-amber-400 to-yellow-400";
  };

  const getStatusColor = (progress) => {
    if (progress >= 100)
      return "bg-gradient-to-r from-green-600 to-emerald-500";
    if (progress >= 75) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (progress >= 50) return "bg-gradient-to-r from-lime-400 to-amber-400";
    return "bg-gradient-to-r from-amber-400 to-yellow-400";
  };

  const getRemainingColor = (progress) => {
    if (progress >= 100) return "from-gray-100 to-gray-200";
    if (progress >= 75) return "from-amber-50 to-yellow-100";
    if (progress >= 50) return "from-amber-100 to-orange-100";
    return "from-orange-100 to-red-100";
  };

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/60 p-4 w-full transform hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-sm">
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getProgressColor(
          animatedProgress
        )} opacity-5 blur-lg group-hover:opacity-10 transition-opacity duration-500`}
      ></div>

      <div className="relative mb-4 flex items-center gap-2">
        <div
          className={`p-1.5 rounded-xl bg-gradient-to-br ${getProgressColor(
            animatedProgress
          )} shadow-md`}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {campaign.title || "Funding Campaign"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Help us reach our goal!
          </p>
        </div>
      </div>

      <div className="relative space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/60">
              <p className="text-sm font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent text-center">
                {formatAmount(
                  campaign.detail.raisedAmount,
                  campaign.detail.currency
                )}
              </p>
              <p className="text-xs text-green-700 text-center font-semibold">
                Raised
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-xs font-bold text-gray-800">
                  {formatAmount(
                    campaign.detail.goalAmount,
                    campaign.detail.currency
                  )}
                </p>
                <p className="text-xs text-gray-600 font-medium">Goal</p>
              </div>

              <div className="text-center p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-xs font-bold text-amber-700">
                  {formatAmount(remainingAmount, campaign.detail.currency)}
                </p>
                <p className="text-xs text-amber-600 font-medium">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`absolute left-0 top-0 h-full rounded-l-full bg-gradient-to-r ${getProgressColor(
                animatedProgress
              )} transition-all duration-700 ease-out z-20`}
              style={{ width: `${animatedProgress}%` }}
            ></div>

            <div
              className={`absolute right-0 top-0 h-full rounded-r-full bg-gradient-to-l ${getRemainingColor(
                animatedProgress
              )} transition-all duration-700 ease-out border-l-2 border-white/50`}
              style={{ width: `${remainingPercentage}%` }}
            ></div>

            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-lg z-30 transition-all duration-700 ease-out"
              style={{ left: `${animatedProgress}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${getProgressColor(
                  animatedProgress
                )}`}
              ></div>
              <span className="text-gray-600 font-medium">
                Raised: {animatedProgress.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-l ${getRemainingColor(
                  animatedProgress
                )}`}
              ></div>
              <span className="text-gray-600 font-medium">
                Remaining: {remainingPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xs font-semibold text-gray-500 px-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-xs text-gray-600">
              {campaign.detail.donors || 124}
            </span>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(
              animatedProgress
            )}`}
          >
            {animatedProgress >= 100 ? "🎉 Goal!" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
