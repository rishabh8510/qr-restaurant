"use client";

import { FiCheckCircle } from "react-icons/fi";

interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-fade-in-up">
      <div className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
        <FiCheckCircle className="h-4 w-4 text-amber-400" />
        {message}
      </div>
    </div>
  );
}