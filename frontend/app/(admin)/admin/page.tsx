export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900">
      <div className="text-center p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Welcome
        </h1>
        <p className="text-xl md:text-2xl text-indigo-100">
          We're excited to have you here!
        </p>
      </div>
    </div>
  );
}
