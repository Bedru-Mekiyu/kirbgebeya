import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 Page Not Found | Afar Aid"
        description="The page you are looking for does not exist. Navigate back to the Afar Aid dashboard or homepage."
      />

      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <GridShape />

        <div className="relative z-10 mx-auto w-full max-w-[360px] text-center sm:max-w-[600px] lg:max-w-[800px]">
          <h1 className="mb-6 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600 dark:from-green-300 dark:via-green-400 dark:to-green-500 sm:text-7xl lg:text-8xl animate-pulse">
            404
          </h1>
          <h2 className="mb-8 text-xl font-semibold text-gray-700 dark:text-gray-300 sm:text-2xl lg:text-3xl">
            Oops! Page not found
          </h2>

          <div className="mb-8">
            <img
              src="/images/error/404.svg"
              alt="404"
              className="mx-auto dark:hidden w-48 sm:w-64 lg:w-80 animate-fade-in"
            />
            <img
              src="/images/error/404-dark.svg"
              alt="404"
              className="hidden dark:block mx-auto w-48 sm:w-64 lg:w-80 animate-fade-in"
            />
          </div>

          <p className="mb-6 text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl">
            We can’t seem to find the page you are looking for. It might have
            been moved or deleted.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-6 py-3 font-medium text-white shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 sm:px-8 sm:py-4 sm:text-lg"
          >
            Back to Home
          </Link>
        </div>

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Afar Emergency Relief Initiative
        </p>
      </div>
    </>
  );
}
