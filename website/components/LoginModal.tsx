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
      if (r.debugCode) setDebugOtp(r.debugCode);
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

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
            {step === "phone" ? <FiPhone size={22} /> : <FiLock size={22} />}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {step === "phone" ? "Sign in with Mobile" : "Verify OTP"}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {step === "phone"
              ? "Fast, frictionless ordering with your phone"
              : `Enter the 6-digit code sent to ${phone}`}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
            <FiAlertCircle className="shrink-0" size={15} />
            <span>{error}</span>
          </div>
        )}

        {step === "phone" ? (
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Mobile Number
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 shadow-2xs transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
                <span className="text-xs font-bold text-gray-500">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full bg-transparent py-2.5 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleSend}
              className="w-full gap-2 text-sm font-bold"
            >
              <span>Get OTP</span>
              <FiArrowRight size={15} />
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {debugOtp && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 font-medium">
                <FiCheckCircle className="shrink-0 text-emerald-600" size={15} />
                <span>
                  Demo OTP: <strong className="tracking-widest font-black">{debugOtp}</strong>
                </span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Your Name <span className="font-normal text-gray-400 lowercase">(optional)</span>
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 shadow-2xs transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
                <FiUser className="shrink-0 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Enter 6-Digit OTP
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 shadow-2xs transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
                <FiLock className="shrink-0 text-gray-400" size={16} />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="w-full bg-transparent py-2.5 text-center text-base font-bold tracking-[0.4em] text-gray-900 outline-none placeholder:tracking-normal placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleVerify}
              className="w-full gap-2 text-sm font-bold"
            >
              <FiCheckCircle size={15} />
              <span>Verify & Continue</span>
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setCode("");
                setDebugOtp("");
                setError("");
              }}
              className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
            >
              <FiArrowLeft size={13} />
              Change mobile number
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] leading-relaxed text-gray-400">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </Dialog>
  );
}
