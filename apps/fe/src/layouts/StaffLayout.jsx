import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ChefHat,
  ClipboardList,
  LogOut,
  Moon,
  Sun,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { logout as logoutAction } from "../store/slices/authSlice";
import BillRequestNotification from "../Components/BillRequestNotification";

export default function StaffLayout({ role: explicitRole }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isKitchen =
    explicitRole === "kitchen" || location.pathname.startsWith("/kitchen");
  const isWaiter =
    explicitRole === "waiter" || location.pathname.startsWith("/waiter");

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/signin");
  };

  const roleTitle = isKitchen ? "Bếp / Kitchen KDS" : "Phục vụ / Waiter";
  const roleSubtitle = isKitchen ? "Màn hình chế biến" : "Quản lý đơn bàn";
  const RoleIcon = isKitchen ? ChefHat : ClipboardList;
  const homePath = isKitchen ? "/kitchen" : "/waiter";

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Fixed Staff Navbar */}
      <nav className="fixed top-0 z-50 h-16 w-full border-b border-white/10 bg-neutral-950/95 backdrop-blur-md">
        <div className="container mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          {/* Brand & Role Badge */}
          <Link to={homePath} className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-lg ${
                isKitchen
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/20"
                  : "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-cyan-500/20"
              }`}
            >
              <RoleIcon className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-black tracking-wide text-white">
                Lumière Bistro
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-orange-400">
                {roleTitle}
              </div>
            </div>
          </Link>

          {/* Center Info on Desktop */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{roleSubtitle}</span>
            {user?.name && (
              <span className="text-gray-300 font-medium">
                • {user.name} ({user.role || (isKitchen ? "Kitchen" : "Waiter")})
              </span>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              title="Chuyển đổi giao diện Sáng / Tối"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5 text-orange-400" />
              <span>Đăng xuất</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="rounded-xl border border-white/10 p-2 text-gray-300 md:hidden hover:bg-white/10 hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-neutral-900/98 px-4 py-3 md:hidden">
            <div className="mb-2 text-xs text-gray-400">
              Đang đăng nhập:{" "}
              <strong className="text-white">{user?.name || "Nhân viên"}</strong>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-16">
        {/* Lắng nghe thông báo bill yêu cầu chỉ dành cho Phục vụ */}
        {isWaiter && <BillRequestNotification />}
        <Outlet />
      </main>
    </div>
  );
}
