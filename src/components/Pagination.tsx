// components/Pagination.tsx
"use client";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination flex gap-2 justify-center mt-4">
      {pages.map((page) => (
        <button
          key={page}
          className={`page-number border px-3 py-1 rounded ${
            currentPage === page
              ? "bg-[var(--primary)] text-white border-[var(--primary)]"
              : "border-gray-300"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
