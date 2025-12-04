"use client";

import { useEffect } from "react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={clsx(
        "fixed bottom-6 left-1/2 z-[9999] w-[90%] max-w-sm -translate-x-1/2",
        "rounded-xl px-4 py-3 text-sm shadow-lg text-white",
        "animate-toast-slide-up",
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      )}
    >
      {message}
    </div>
  );
}
