import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  MapPin,
  LogOut,
  ClipboardList,
} from "lucide-react";
// 1. Import useDispatch
import { useSelector, useDispatch } from "react-redux";
import { selectTotalItems } from "../store/slices/cartSlice";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  logout,
} from "../store/slices/authSlice";
import { IoRestaurant } from "react-icons/io5";
import Avatar from "../features/Customer/components/Avatar";
import logo from "../assets/logo.png";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 2. Khởi tạo dispatch và navigate
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Dùng để chuyển trang sau khi logout nếu cần

  const isLoggedIn = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // Xác định role hiện tại
  const role = user?.role;

  console.log("Current User Role in Navbar:", role); // Debug role

  const cartCount = useSelector(selectTotalItems);
  const tableNumber = localStorage.getItem("tableNumber");

  // Check qrToken in localStorage
  const [hasQrToken, setHasQrToken] = useState(false);
  // Thêm location.pathname vào dependency array
  useEffect(() => {
    // Kiểm tra kỹ hơn: Có token HOẶC có mã bàn thì coi như đã quét
    const token = localStorage.getItem("qrToken");
    const table = localStorage.getItem("tableNumber"); // Check thêm cái này cho chắc

    setHasQrToken(!!token || !!table);
  }, [location.pathname]); // <--- QUAN TRỌNG: Chạy lại mỗi khi đổi đường dẫn

  // --- HÀM ĐÓNG MENU ---
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // --- 3. HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    dispatch(logout()); // Gọi Redux action logout
    closeMenu();
    navigate("/"); // (Tuỳ chọn) Chuyển về trang chủ sau khi đăng xuất
    toast.success(t("navbar.logoutSuccess"));
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
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-bistro-charcoal/10 h-16 shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* 1. LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group z-50"
          >
            <img
              src={logo}
              alt="Lumière Bistro"
              className="h-20 w-auto object-contain drop-shadow-sm"
            />

            <div className="md:block">
              <h1 className="text-bistro-charcoal font-bold text-lg tracking-wide font-display">
                Lumière Bistro
              </h1>
            </div>
          </Link>

          {/* 2. DESKTOP MENU (Ẩn trên Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            {/* Menu cho từng role */}
            {role === "waiter" && (
              <>
                <NavLink to="/waiter" label="Đơn phục vụ" />
              </>
            )}
            {role === "kitchen" && (
              <>
                <NavLink to="/kitchen" label="Đơn bếp" />
              </>
            )}
            {/* Mặc định cho customer */}
            {(!role || role === "customer") && (
              <>
                <NavLink to="/" label={t("navbar.home")} />
                <NavLink to="/menu" label={t("navbar.menu")} />
                {!hasQrToken && (
                  <NavLink
                    to="/booking"
                    label={t("navbar.tableMap")}
                    icon={<MapPin size={16} />}
                  />
                )}
                <NavLink
                  to="/order-tracking"
                  label={t("navbar.orderTracking")}
                  icon={<ClipboardList size={16} />}
                />
              </>
            )}
          </div>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-3 z-50">
            {/* Language Switcher - Only show for customer interface */}
            {(!role || role === "customer") && (
              <LanguageSwitcher className="hidden sm:block" />
            )}

            {/* Giỏ hàng */}
            {role != "admin" && role != "waiter" && role != "kitchen" && (
              <>
                <Link
                  to="/cart"
                  onClick={closeMenu}
                  className="relative p-2 text-bistro-charcoal/70 hover:text-bistro-wine transition-colors"
                >
                  <ShoppingBag size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-bistro-wine text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Info / Login / Logout Desktop */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-bistro-charcoal/10">
                {/* Link Profile */}
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="group flex items-center gap-2"
                >
                  <Avatar
                    url={user?.avatarUrl || user?.avatar_url}
                    name={user?.name}
                    size={36}
                    className="group-hover:ring-2 group-hover:ring-bistro-wine transition shadow-sm"
                  />

                  <span className="max-w-30 truncate text-sm font-semibold text-bistro-charcoal group-hover:text-bistro-wine">
                    {user?.name}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  title={t("navbar.logout")}
                  className="p-2 text-bistro-charcoal/60 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-bistro-charcoal/10">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-bistro-charcoal/70 hover:text-bistro-charcoal"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-bistro-wine hover:bg-bistro-wine/90 text-white text-sm font-bold rounded-lg transition-all shadow-md"
                >
                  {t("navbar.register")}
                </Link>
              </div>
            )}

            {/* Hamburger Button (Chỉ hiện Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-bistro-charcoal hover:text-bistro-wine transition-transform active:scale-90"
            >
              {isMobileMenuOpen ? (
                <X size={26} className="text-bistro-wine" />
              ) : (
                <MenuIcon size={26} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- 4. MOBILE MENU OVERLAY & DRAWER --- */}

      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 backdrop-blur-sm ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-40 border-l border-bistro-charcoal/10 shadow-2xl transform transition-transform duration-300 ease-in-out pt-20 px-6 flex flex-col md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* User Info Mobile */}
        {isLoggedIn ? (
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 mb-8 pb-6 border-b border-bistro-charcoal/10"
          >
            <Avatar
              url={user?.avatarUrl || user?.avatar_url}
              name={user?.name}
              size={48}
              className="shadow-sm"
            />

            <div>
              <p className="text-bistro-charcoal font-bold truncate max-w-[160px]">
                {user?.name || t("navbar.customer")}
              </p>

              {/* Chỉ hiện cho customer hoặc khi role chưa có */}
              {(role === "customer" || !role) && (
                <p className="text-bistro-wine text-xs font-bold bg-bistro-wine/10 px-2 py-0.5 rounded-full inline-block mt-1">
                  {tableNumber
                    ? t("navbar.sittingAt", { table: tableNumber })
                    : t("navbar.noTable")}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="mb-8 pb-6 border-b border-bistro-charcoal/10">
            <p className="text-bistro-charcoal/70 text-sm mb-4 font-medium">{t("navbar.welcome")}</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/signin"
                onClick={closeMenu}
                className="py-2.5 text-center rounded-lg border border-bistro-charcoal/20 text-bistro-charcoal hover:bg-bistro-cream text-sm font-medium transition-colors"
              >
                {t("navbar.login")}
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="py-2.5 text-center rounded-lg bg-bistro-wine text-white font-bold hover:bg-bistro-wine/90 text-sm transition-colors shadow-md"
              >
                {t("navbar.register")}
              </Link>
            </div>
          </div>
        )}

        {/* Danh sách Link Mobile */}
        <div className="flex flex-col gap-2">
          {/* Menu cho từng role trên mobile */}
          {role === "waiter" && (
            <>
              <MobileLink
                to="/waiter"
                label="Đơn phục vụ"
                onClick={closeMenu}
              />
            </>
          )}
          {role === "kitchen" && (
            <>
              <MobileLink to="/kitchen" label="Đơn bếp" onClick={closeMenu} />
            </>
          )}
          {(!role || role === "customer") && (
            <>
              <MobileLink to="/" label={t("navbar.home")} onClick={closeMenu} />
              <MobileLink
                to="/menu"
                label={t("navbar.menu")}
                onClick={closeMenu}
              />
              {!hasQrToken && (
                <MobileLink
                  to="/booking"
                  label={t("navbar.booking")}
                  onClick={closeMenu}
                />
              )}
              <MobileLink
                to="/cart"
                label={t("navbar.yourCart")}
                onClick={closeMenu}
              />
              <MobileLink
                to="/order-tracking"
                label={t("navbar.orderTracking")}
                onClick={closeMenu}
              />
              {isLoggedIn && (
                <MobileLink
                  to="/history"
                  label={t("navbar.orderHistory")}
                  onClick={closeMenu}
                />
              )}
            </>
          )}
        </div>

        {/* Language Switcher for Mobile */}
        {(!role || role === "customer") && (
          <div className="py-4 border-t border-bistro-charcoal/10 mt-4">
            <LanguageSwitcher />
          </div>
        )}

        {/* Footer Mobile Menu */}
        <div className="mt-auto mb-8">
          {isLoggedIn && (
            // 5. Cập nhật nút đăng xuất Mobile gọi hàm handleLogout
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 w-full py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} /> {t("navbar.logout")}
            </button>
          )}
          <p className="text-xs text-bistro-charcoal/50 mt-6 text-center">
            Version 1.0.0
          </p>
        </div>
      </div>
    </>
  );
};

const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={
        `flex items-center gap-2 text-sm font-semibold transition-all ` +
        (isActive
          ? "text-bistro-wine"
          : "text-bistro-charcoal/70 hover:text-bistro-wine")
      }
    >
      {icon}
      {label}
    </Link>
  );
};

const MobileLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block py-3 px-4 rounded-xl text-base font-semibold text-bistro-charcoal/80 hover:bg-bistro-cream hover:text-bistro-wine transition-colors active:scale-95"
  >
    {label}
  </Link>
);

export default Navbar;
