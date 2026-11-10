import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  User,
  ShieldUser,
  LogOut,
  Menu as MenuIcon,
  X,
  Moon,
  Sun,
} from "lucide-react";

import { MdOutlineTableBar } from "react-icons/md";
import AdminNotificationCenter from "./AdminNotificationCenter";
import { useTheme } from "../../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../../store/slices/authSlice";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/accounts", label: "Accounts", icon: Users },
  { to: "/admin/tables", label: "Tables", icon: MdOutlineTableBar },
  { to: "/admin/table-assignments", label: "Assignments", icon: ClipboardList },
];

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [open]);

  const logout = () => {
    dispatch(logoutAction());
    navigate("/signin");
    toast.success("Đăng xuất thành công");
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-md border-b border-border h-16 font-sans">
        <div className="container mx-auto max-w-7xl px-4 h-full flex items-center justify-between">
          {/* Brand */}
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-10 h-10 border border-gold/40 bg-gold/15 flex items-center justify-center text-gold shadow-xs">
              <ShieldUser size={22} />
            </div>
            <div className="leading-tight">
              <div className="text-foreground font-serif text-lg font-semibold tracking-wide">
                Le Bistro
              </div>
              <div className="text-[10px] text-gold uppercase tracking-luxe font-medium">
                Executive Admin
              </div>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden xl:flex items-center gap-1.5">
            {navItems.map((it) => (
              <AdminNavLink
                key={it.to}
                to={it.to}
                label={it.label}
                icon={it.icon}
              />
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-gold" />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* Notification Center */}
            <AdminNotificationCenter />

            <Link
              to="/admin/profile"
              aria-label="Admin Profile"
              className="w-11 h-11 border border-border bg-card flex items-center justify-center text-foreground hover:text-gold hover:border-gold/40 transition-colors"
            >
              <User size={18} />
            </Link>

            <button
              type="button"
              onClick={logout}
              className="hidden xl:inline-flex items-center gap-2 min-h-11 px-4 border border-border bg-card hover:border-gold/40 hover:text-gold text-foreground text-xs uppercase tracking-luxe font-medium transition-colors cursor-pointer"
            >
              <LogOut size={15} className="text-gold" />
              Đăng xuất
            </button>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation drawer"
              className="xl:hidden w-11 h-11 flex items-center justify-center border border-border text-foreground hover:bg-muted cursor-pointer"
            >
              {open ? (
                <X size={20} className="text-gold" />
              ) : (
                <MenuIcon size={20} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-ink/75 z-40 xl:hidden transition-opacity duration-300 backdrop-blur-sm ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card z-40 border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out pt-20 px-6 flex flex-col xl:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6">
          <div className="text-foreground font-serif text-xl font-medium">Bảng Điều Khiển</div>
          <div className="text-gold text-xs uppercase tracking-luxe mt-1 font-sans">Quản trị toàn hệ thống</div>
        </div>

        <div className="flex flex-col gap-2">
          {navItems.map((it) => (
            <MobileAdminLink
              key={it.to}
              to={it.to}
              label={it.label}
              icon={it.icon}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>

        <div className="mt-auto mb-8">
          <button
            type="button"
            onClick={logout}
            className="w-full min-h-11 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold-soft text-ink font-sans text-xs uppercase tracking-luxe font-semibold transition-all shadow-md cursor-pointer"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-6 text-center font-sans">
            Admin Suite Executive v2.0
          </p>
        </div>
      </div>
    </>
  );
}

function AdminNavLink({ to, label, icon: Icon }) {
  const { pathname } = useLocation();
  const active =
    pathname === to || (to !== "/admin" && pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={[
        "px-3.5 py-2 text-xs font-sans uppercase tracking-luxe transition-all inline-flex items-center gap-2 min-h-11 border",
        active
          ? "bg-gold/15 border-gold/40 text-gold font-semibold shadow-xs"
          : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
      ].join(" ")}
    >
      <Icon
        size={15}
        className={active ? "text-gold" : "text-muted-foreground"}
      />
      {label}
    </Link>
  );
}

function MobileAdminLink({ to, label, icon: Icon, onClick }) {
  const { pathname } = useLocation();
  const active =
    pathname === to || (to !== "/admin" && pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={[
        "px-4 py-3 text-xs font-sans uppercase tracking-luxe transition-all inline-flex items-center gap-3 border min-h-11",
        active
          ? "bg-gold/15 border-gold/40 text-gold font-semibold shadow-xs"
          : "bg-background border-border text-foreground hover:border-gold/40",
      ].join(" ")}
    >
      <Icon
        size={17}
        className={active ? "text-gold" : "text-muted-foreground"}
      />
      {label}
    </Link>
  );
}
