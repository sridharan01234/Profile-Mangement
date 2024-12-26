"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Profile Management</h1>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, {user.username}!
                  </span>
                  <button
                    onClick={async () => {
                      await fetch("/api/auth/logout", {
                        method: "POST",
                        credentials: "include",
                      });
                      router.push("/login");
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-600">
              Welcome to your profile management dashboard!
            </p>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={() => router.push("/profile")}
                className="bg-white p-6 rounded-lg shadow-sm border hover:border-blue-500 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Update Profile
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage your personal information and preferences
                </p>
              </button>

              <button
                onClick={() => router.push("/profile/education")}
                className="bg-white p-6 rounded-lg shadow-sm border hover:border-blue-500 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">Education</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add or update your educational background
                </p>
              </button>

              <button
                onClick={() => router.push("/profile/experience")}
                className="bg-white p-6 rounded-lg shadow-sm border hover:border-blue-500 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Experience
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage your work experience and skills
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
