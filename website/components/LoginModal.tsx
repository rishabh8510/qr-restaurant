"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FiUser,
  FiLock,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LoginModal() {
  const { showLoginModal, closeLoginModal, sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [debugOtp, setDebugOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSend = async () => {
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const r = await sendOtp(phone);
      const receivedOtp = r.debugCode || r.otp || "";
      if (receivedOtp) {
        setDebugOtp(receivedOtp);
        setCode(receivedOtp);
      }
      setStep("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    if (code.length < 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, code, name || undefined);
      setStep("phone");
      setPhone("");
      setCode("");
      setName("");
      setDebugOtp("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("phone");
    setPhone("");
    setCode("");
    setName("");
    setDebugOtp("");
    setError("");
    closeLoginModal();
  };

  return (
    <Dialog open={showLoginModal} onClose={handleClose} maxWidth="max-w-md">
      <DialogClose onClose={handleClose} />

      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

      <div className="p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 sm:mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full overflow-hidden shadow-md ring-2 ring-red-100">
            <img src="/logo.jpeg" alt="Lotus Hut" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            {step === "phone" ? "Sign in to Lotus Hut" : "Verify OTP"}
          </h2>
          <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-500">
            {step === "phone"
              ? "Fast, frictionless ordering with your mobile number"
              : debugOtp
              ? `Use the OTP shown below for +91 ${phone}`
              : `Enter the 6-digit code sent to ${phone}`}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 sm:mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            <FiAlertCircle className="shrink-0" size={14} />
            <span>{error}</span>
          </div>
        )}

        {step === "phone" ? (
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div>
              <label className="mb-1 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-600">
                Mobile Number
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 sm:px-3.5 shadow-2xs transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
                <span className="text-xs font-bold text-gray-500">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full bg-transparent py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleSend}
              className="w-full gap-2 text-xs sm:text-sm font-bold py-2.5 sm:py-3"
            >
              <span>Get OTP</span>
              <FiArrowRight size={14} />
            </Button>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            {debugOtp && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 sm:p-3.5 text-emerald-900 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-800">
                    <FiCheckCircle className="shrink-0 text-emerald-600" size={14} />
                    <span>SMS service not active yet</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCode(debugOtp)}
                    className="text-[10px] sm:text-[11px] font-bold text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
                <div className="mt-1.5 sm:mt-2 flex items-center justify-between rounded-lg bg-white/90 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-emerald-100">
                  <span className="text-[11px] sm:text-xs text-gray-600 font-medium">Your OTP:</span>
                  <span className="text-base sm:text-lg font-black tracking-[0.25em] text-emerald-800 font-mono">
                    {debugOtp}
                  </span>
                </div>
                <p className="mt-1 text-[10px] sm:text-[11px] text-emerald-700/80">
                  We have auto-filled this code for you. Click below to continue.
                </p>
              </div>
            )}

            <div>
              <label className="mb-1 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-600">
                Your Name <span className="font-normal text-gray-400 lowercase">(optional)</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 sm:px-3.5 shadow-2xs transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
                <FiUser className="shrink-0 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent py-2 sm:py-2.5 text-xs sm:text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-600">
                Enter 6-Digit OTP
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 sm:px-3.5 shadow-2xs transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
                <FiLock className="shrink-0 text-gray-400" size={14} />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="w-full bg-transparent py-2 sm:py-2.5 text-center text-sm sm:text-base font-bold tracking-[0.3em] sm:tracking-[0.4em] text-gray-900 outline-none placeholder:tracking-normal placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleVerify}
              className="w-full gap-2 text-xs sm:text-sm font-bold py-2.5 sm:py-3"
            >
              <FiCheckCircle size={14} />
              <span>Verify &amp; Continue</span>
            </Button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setDebugOtp("");
                  setError("");
                }}
                className="flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-900 transition cursor-pointer text-[11px] sm:text-xs"
              >
                <FiArrowLeft size={12} />
                Change number
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSend}
                className="font-bold text-amber-600 hover:text-amber-700 disabled:opacity-50 transition cursor-pointer text-[11px] sm:text-xs"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 sm:mt-6 text-center text-[10px] sm:text-[11px] leading-relaxed text-gray-400">
          By signing in, you agree to our Terms of Service &amp; Privacy Policy.
        </p>
      </div>
    </Dialog>
  );
}
