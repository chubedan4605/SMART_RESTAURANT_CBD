import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  MapPin,
  LogOut,
  ClipboardList,
  Moon,
  Sun,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectTotalItems } from "../store/slices/cartSlice";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  logout,
} from "../store/slices/authSlice";
import Avatar from "../features/Customer/components/Avatar";
import logo from "../assets/logo.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

const Navbar = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const role = user?.role;

  const cartCount = useSelector(selectTotalItems);
  const tableNumber = localStorage.getItem("tableNumber");

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate("/");
    toast.success(t("navbar.logoutSuccess") || "Đăng xuất thành công");
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border/80 h-16 shadow-xs transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          {/* 1. LOGO & BRAND */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group z-50 focus-visible:outline-ring"
          >
            <img
              src={logo}
              alt="Lumière Bistro"
              className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-normal tracking-tight text-foreground transition-colors group-hover:text-gold">
                Lumière Bistro
              </span>
              <span className="text-[0.62rem] uppercase tracking-luxe text-gold -mt-1 font-sans">
                Haute Cuisine
              </span>
            </div>
          </Link>

          {/* 2. DESKTOP MENU (Navigation) */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {role === "admin" && (
              <NavLink to="/admin" label="Dashboard" />
            )}
            {role === "waiter" && (
              <NavLink to="/waiter" label="Đơn phục vụ" />
            )}
            {role === "kitchen" && (
              <NavLink to="/kitchen" label="Đơn bếp" />
            )}
            {(!role || role === "customer") && (
              <>
                <NavLink to="/" label={t("navbar.home") || "Trang chủ"} />
                <NavLink to="/menu" label={t("navbar.menu") || "Thực đơn"} />
                <NavLink
                  to="/booking"
                  label={t("navbar.tableMap") || "Đặt bàn"}
                  icon={<MapPin size={15} className="text-gold" />}
                />
                <NavLink
                  to="/order-tracking"
                  label={t("navbar.orderTracking") || "Theo dõi đơn"}
                  icon={<ClipboardList size={15} className="text-gold" />}
                />
              </>
            )}
          </nav>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-3 z-50">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="size-11 flex items-center justify-center rounded-sm text-foreground/80 hover:text-gold hover:bg-muted/50 transition-colors focus-visible:outline-ring"
              title="Toggle Theme"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-gold" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Language Switcher */}
            {(!role || role === "customer") && (
              <LanguageSwitcher className="hidden sm:block" />
            )}

            {/* Giỏ hàng (Cart) */}
            {role !== "admin" && role !== "waiter" && role !== "kitchen" && (
              <Link
                to="/cart"
                onClick={closeMenu}
                aria-label={`Giỏ hàng (${cartCount} món)`}
                className="relative size-11 flex items-center justify-center rounded-sm text-foreground/80 hover:text-gold hover:bg-muted/50 transition-colors focus-visible:outline-ring"
              >
                <ShoppingBag size={21} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-gold text-ink text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Auth Info (Desktop) */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="group flex items-center gap-2.5 focus-visible:outline-ring"
                >
                  <Avatar
                    url={user?.avatarUrl || user?.avatar_url}
                    name={user?.name}
                    size={36}
                    className="ring-1 ring-gold/40 group-hover:ring-gold transition shadow-xs"
                  />
                  <div className="flex flex-col text-left">
                    <span className="max-w-[120px] truncate text-xs font-medium text-foreground group-hover:text-gold transition-colors">
                      {user?.name}
                    </span>
                    {tableNumber && (
                      <span className="text-[10px] text-gold font-medium">
                        Bàn {tableNumber}
                      </span>
                    )}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title={t("navbar.logout") || "Đăng xuất"}
                  aria-label="Đăng xuất"
                  className="size-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm transition-colors focus-visible:outline-ring"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border">
                <Link
                  to="/signin"
                  className="text-xs uppercase tracking-wide-sm font-medium text-foreground/80 hover:text-gold transition-colors px-2 py-2"
                >
                  {t("navbar.login") || "Đăng nhập"}
                </Link>
                <Link
                  to="/signup"
                  className="h-10 px-5 flex items-center justify-center bg-gold text-ink text-xs uppercase tracking-wide-sm font-medium hover:bg-gold-soft rounded-sm transition-all shadow-xs focus-visible:outline-ring"
                >
                  {t("navbar.register") || "Đăng ký"}
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden size-11 flex items-center justify-center text-foreground hover:text-gold transition-colors focus-visible:outline-ring"
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* 4. MOBILE DRAWER */}
      <div
        className={cn(
          "fixed inset-0 bg-ink/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-background text-foreground z-40 border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out pt-20 px-6 flex flex-col md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Mobile Navigation Drawer"
      >
        {isLoggedIn ? (
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 mb-6 pb-6 border-b border-border"
          >
            <Avatar
              url={user?.avatarUrl || user?.avatar_url}
              name={user?.name}
              size={48}
              className="ring-1 ring-gold"
            />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg font-medium text-foreground truncate">
                {user?.name || "Khách hàng"}
              </p>
              {tableNumber ? (
                <p className="text-gold text-xs uppercase tracking-wide-sm font-medium mt-0.5">
                  Đang ngồi tại Bàn {tableNumber}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs font-sans mt-0.5">
                  Chưa vào bàn
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-xs uppercase tracking-wide-sm text-gold font-medium mb-3">
              Chào mừng quý khách
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/signin"
                onClick={closeMenu}
                className="h-11 flex items-center justify-center rounded-sm border border-border text-foreground hover:bg-muted text-xs uppercase tracking-wide-sm font-medium transition-colors"
              >
                {t("navbar.login") || "Đăng nhập"}
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="h-11 flex items-center justify-center rounded-sm bg-gold text-ink hover:bg-gold-soft text-xs uppercase tracking-wide-sm font-medium transition-colors shadow-xs"
              >
                {t("navbar.register") || "Đăng ký"}
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 overflow-y-auto flex-1 scroll-elegant py-2">
          {role === "admin" && (
            <MobileLink to="/admin" label="Dashboard Quản trị" onClick={closeMenu} />
          )}
          {role === "waiter" && (
            <MobileLink to="/waiter" label="Đơn phục vụ" onClick={closeMenu} />
          )}
          {role === "kitchen" && (
            <MobileLink to="/kitchen" label="Đơn bếp KDS" onClick={closeMenu} />
          )}
          {(!role || role === "customer") && (
            <>
              <MobileLink to="/" label={t("navbar.home") || "Trang chủ"} onClick={closeMenu} />
              <MobileLink to="/menu" label={t("navbar.menu") || "Thực đơn"} onClick={closeMenu} />
              <MobileLink to="/booking" label={t("navbar.booking") || "Đặt bàn"} onClick={closeMenu} />
              <MobileLink to="/cart" label={t("navbar.yourCart") || "Giỏ hàng"} onClick={closeMenu} />
              <MobileLink to="/order-tracking" label={t("navbar.orderTracking") || "Theo dõi đơn"} onClick={closeMenu} />
              {isLoggedIn && (
                <MobileLink to="/history" label={t("navbar.orderHistory") || "Lịch sử dùng bữa"} onClick={closeMenu} />
              )}
            </>
          )}
        </div>

        {(!role || role === "customer") && (
          <div className="py-4 border-t border-border mt-auto">
            <LanguageSwitcher />
          </div>
        )}

        {isLoggedIn && (
          <div className="pt-2 pb-6 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 text-destructive hover:bg-destructive/10 h-11 w-full px-4 rounded-sm text-sm font-medium transition-colors"
            >
              <LogOut size={18} /> {t("navbar.logout") || "Đăng xuất"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      data-active={isActive}
      className={cn(
        "nav-underline flex items-center gap-1.5 text-xs uppercase tracking-wide-sm font-medium transition-colors duration-200 py-1",
        isActive
          ? "text-gold font-semibold"
          : "text-foreground/80 hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const MobileLink = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "h-11 flex items-center px-4 rounded-sm text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-gold font-semibold"
          : "text-foreground/80 hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
};

export default Navbar;
