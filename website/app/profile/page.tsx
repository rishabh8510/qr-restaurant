"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiPhone,
  FiPackage,
  FiLogOut,
  FiArrowLeft,
  FiShoppingBag,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, isLoggedIn, loading, logout, updateProfile, openLoginModal } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(() => user?.name ?? "");
  const [saved, setSaved] = useState(false);
  const [syncedUserId, setSyncedUserId] = useState<string | null>(
    user?.id ? String(user.id) : null
  );

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      openLoginModal(() => {});
    }
  }, [loading, isLoggedIn, openLoginModal]);

  if (user?.id && String(user.id) !== syncedUserId) {
    setSyncedUserId(String(user.id));
    if (user.name) setName(user.name);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        <p className="mt-4 text-xs font-bold text-gray-500">Loading your profile…</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
          <FiUser size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view profile</h2>
        <p className="mt-1.5 text-xs text-gray-500 max-w-xs mx-auto">
          Login with your mobile number to view personal information and order history.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => openLoginModal()}
          className="mt-6 px-8 text-sm font-bold"
        >
          Sign In with Mobile
        </Button>
      </section>
    );
  }

  const handleSave = () => {
    updateProfile({ name: name.trim() || user.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initial = (user.name || user.phone || "U").charAt(0).toUpperCase();

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
      >
        <FiArrowLeft className="h-4 w-4" />
        <span>Back to Menu</span>
      </Link>

      <div className="mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          Account &amp; Profile
        </h1>
        <p className="mt-1 text-xs font-semibold text-gray-500">
          Manage your personal details and quick order access
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Avatar & quick links */}
        <div className="lg:col-span-5">
          <Card className="border-gray-100 bg-white shadow-xs">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400 text-3xl font-black text-black shadow-md ring-4 ring-amber-100">
                {initial}
              </div>
              <h2 className="mt-4 text-lg font-black text-gray-900">
                {user.name || "Customer"}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <FiPhone className="h-3 w-3" />
                <span>{user.phone || "—"}</span>
              </div>
              <Badge variant="emerald" className="mt-3 text-[10px] font-bold">
                ✓ Verified Customer
              </Badge>

              <div className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                <Link
                  href="/orders"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center transition hover:border-gray-200 hover:bg-white hover:shadow-2xs"
                >
                  <FiPackage className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-bold text-gray-900">Orders</span>
                </Link>
                <Link
                  href="/"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center transition hover:border-gray-200 hover:bg-white hover:shadow-2xs"
                >
                  <FiShoppingBag className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-bold text-gray-900">Menu</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Personal details */}
        <div className="space-y-4 lg:col-span-7">
          <Card className="border-gray-100 bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Registered Mobile Number
                </label>
                <div className="mt-1.5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-800">
                  {user.phone || "—"}
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Used for OTP verification and receipt SMS.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="mt-1.5 flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-2xs outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  className="gap-2 text-sm font-bold"
                >
                  {saved ? (
                    <>
                      <FiCheckCircle className="h-4 w-4" />
                      <span>Saved Successfully</span>
                    </>
                  ) : (
                    <span>Save Name</span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white p-3.5 text-xs font-bold text-red-600 shadow-2xs transition hover:bg-red-50 hover:text-red-700"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Sign Out from this Device</span>
          </button>
        </div>
      </div>
    </section>
  );
}
