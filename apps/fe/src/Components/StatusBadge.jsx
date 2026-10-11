import React from "react";

export default function StatusBadge({ status }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        Chờ xử lý
      </span>
    );
  }
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        Đã chấp nhận
      </span>
    );
  }
  if (status === "received") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
        Đã nhận đơn
      </span>
    );
  }
  if (status === "preparing") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-pulse" />
        Đang chuẩn bị
      </span>
    );
  }
  if (status === "completed") {  
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-300 text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
        Đã hoàn thành
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 text-xs font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
      Đã từ chối
    </span>
  );
}
