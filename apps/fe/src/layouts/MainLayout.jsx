import React from "react";
import { Outlet } from "react-router-dom";
import CustomerLayout from "./CustomerLayout";
import AdminLayout from "./AdminLayout";
import StaffLayout from "./StaffLayout";

export default function MainLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role === "customer") {
    return <CustomerLayout />;
  }
  if (user.role === "admin") {
    return <AdminLayout />;
  }
  if (user.role === "kitchen" || user.role === "waiter") {
    return <StaffLayout role={user.role} />;
  }

  return <Outlet />;
}
