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
  const roleSubtitle = isKitchen ? "Màn hình chế biến món" : "Quản lý phục vụ bàn";
  const RoleIcon = isKitchen ? ChefHat : ClipboardList;
  const homePath = isKitchen ? "/kitchen" : "/waiter";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-gold/30 selection:text-gold">
      {/* Fixed Staff Navbar */}
      <nav className="fixed top-0 z-50 h-16 w-full border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          {/* Brand & Role Badge */}
          <Link to={homePath} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-none border border-gold/40 bg-gold/15 text-gold shadow-xs">
              <RoleIcon className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold tracking-wide text-foreground">
                Le Bistro
              </div>
              <div className="text-[10px] uppercase tracking-luxe text-gold font-medium">
                {roleTitle}
              </div>
            </div>
          </Link>

          {/* Center Info on Desktop */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-light">{roleSubtitle}</span>
            {user?.name && (
              <span className="text-foreground font-medium">
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
              aria-label="Toggle theme"
              className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Chuyển đổi giao diện Sáng / Tối"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-gold" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-2 min-h-11 border border-border bg-card px-4 text-xs font-sans uppercase tracking-luxe text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-gold" />
              <span>Đăng xuất</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="w-11 h-11 flex items-center justify-center border border-border text-foreground md:hidden hover:bg-muted cursor-pointer"
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
          <div className="border-b border-border bg-card px-4 py-3 md:hidden">
            <div className="mb-2 text-xs text-muted-foreground">
              Đang đăng nhập:{" "}
              <strong className="text-foreground">{user?.name || "Nhân viên"}</strong>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-none bg-destructive/10 px-3 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/20 cursor-pointer min-h-11"
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
