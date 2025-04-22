"use client";

import React, { useEffect } from "react";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] text-[var(--text)] rounded-lg shadow-2xl p-6 max-w-lg w-full mx-4 relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
