import React from "react";

const MenuSkeletonCard = () => (
  <div className="flex gap-4 p-3 sm:p-4 rounded-none border border-border bg-card">
    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-none bg-muted animate-pulse shrink-0" />
    <div className="flex-1 py-1">
      <div className="h-5 w-2/3 bg-muted rounded-none animate-pulse" />
      <div className="mt-2 h-4 w-full bg-muted rounded-none animate-pulse" />
      <div className="mt-2 h-4 w-5/6 bg-muted rounded-none animate-pulse" />
      <div className="mt-4 flex items-end justify-between">
        <div className="h-6 w-24 bg-muted rounded-none animate-pulse" />
        <div className="h-9 w-16 bg-muted rounded-none animate-pulse" />
      </div>
    </div>
  </div>
);

export default function MenuSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <MenuSkeletonCard key={i} />
      ))}
    </div>
  );
}
