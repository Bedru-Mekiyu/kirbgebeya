import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { FaHandHoldingUsd } from "react-icons/fa";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20"></div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full blur-2xl"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #059669 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative flex w-full min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 dark:from-emerald-800 dark:via-green-800 dark:to-teal-800">
          <div className="flex items-center justify-center w-full p-12">
            <div className="max-w-md space-y-8 text-center">
              <div className="inline-block transform hover:scale-105 transition-transform duration-300">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 inline-flex">
                  <FaHandHoldingUsd className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Emergency Relief for
                  <span className="block text-emerald-200">Afar Families</span>
                </h1>

                <p className="text-lg text-emerald-100/90 leading-relaxed">
                  Supporting 2,131 families affected by natural disaster with
                  sustainable livelihood solutions through goat distribution.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">2,131</div>
                  <div className="text-sm text-emerald-200/80">Families</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">6,393</div>
                  <div className="text-sm text-emerald-200/80">Goats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-emerald-200/80">
                    Direct Impact
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-emerald-200/80">Support</div>
                </div>
              </div>

              <div className="flex justify-center space-x-6 pt-6 border-t border-emerald-500/30">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <div className="text-xs text-emerald-200/70">
                    Verified Families
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <div className="text-xs text-emerald-200/70">
                    Direct Delivery
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <div className="text-xs text-emerald-200/70">
                    Impact Tracking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center space-x-3">
                <div className="p-3 bg-emerald-600 rounded-xl">
                  <FaHandHoldingUsd className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    Afar Relief
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Emergency Support
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Access the management dashboard to coordinate relief efforts
                </p>
              </div>

              {children}
            </div>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Verified • Transparent • Impact-Focused
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                © {new Date().getFullYear()} Afar Emergency Relief Initiative
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 right-6">
          <div className=" dark:bg-gray-800 rounded-xl  p-3">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div>
    </div>
  );
}
