"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profilePicture, setProfilePicture] = useState(true);

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
                  <div className="relative">
                    <Image
                      src={`/profile/${user.userId}.jpg`}
                      alt="Profile picture"
                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer"
                      width={60}
                      height={50}
                      onClick={() => setProfilePicture(!profilePicture)}
                    />
                    {profilePicture && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={async () => {
                            await fetch("/api/auth/logout", {
                              method: "POST",
                              credentials: "include",
                            });
                            router.push("/login");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>{" "}
                      </div>
                    )}
                  </div>{" "}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
