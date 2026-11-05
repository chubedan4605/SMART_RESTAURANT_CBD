import React from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../Components/NavBar";
import FloatingBillRequest from "../Components/FloatingBillRequest";
import AiDiningAssistant from "../Components/customer/AiDiningAssistant";
import { UtensilsCrossed } from "lucide-react";

const CustomerLayout = () => {
  // Lấy thông tin table session từ context hoặc localStorage
  const tableId = localStorage.getItem("tableCode");
  const sessionId = localStorage.getItem("tableSessionId");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-gold/30 selection:text-gold">
      {/* Navbar luôn ở trên cùng */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Luxury Editorial Footer */}
      <footer className="bg-ink text-cream border-t border-gold/20 grain relative overflow-hidden py-16">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Brand & Philosophy */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold">
                  <UtensilsCrossed size={16} />
                </span>
                <span className="font-serif text-2xl tracking-wide text-cream font-semibold">
                  Le Bistro <span className="text-gold italic font-normal">Moderne</span>
                </span>
              </div>
              <p className="font-serif italic text-gold/90 text-lg max-w-md">
                "Nơi nghệ thuật ẩm thực tinh tế giao thoa cùng trải nghiệm phục vụ thông minh."
              </p>
              <p className="text-cream/60 text-sm max-w-md leading-relaxed">
                Được chuẩn hóa theo phong cách ẩm thực cao cấp, mỗi món ăn là một câu chuyện tôn vinh nguyên liệu thượng hạng cùng sự chăm chút tỉ mỉ từ những đầu bếp hàng đầu.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-[0.7rem] uppercase tracking-luxe text-gold mb-4 font-medium">
                Khám Phá
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/menu"
                    className="nav-underline text-cream/70 hover:text-gold transition-colors inline-flex items-center min-h-11"
                  >
                    Thực Đơn Mùa Này
                  </Link>
                </li>
                <li>
                  <Link
                    to="/booking"
                    className="nav-underline text-cream/70 hover:text-gold transition-colors inline-flex items-center min-h-11"
                  >
                    Đặt Bàn Riêng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order-tracking"
                    className="nav-underline text-cream/70 hover:text-gold transition-colors inline-flex items-center min-h-11"
                  >
                    Theo Dõi Gọi Món
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Service & Address */}
            <div>
              <h4 className="text-[0.7rem] uppercase tracking-luxe text-gold mb-4 font-medium">
                Thời Gian & Địa Điểm
              </h4>
              <div className="space-y-2 text-sm text-cream/70">
                <p>Thứ Hai – Chủ Nhật</p>
                <p className="font-serif text-gold text-base">10:00 – 23:00</p>
                <div className="hairline my-3" />
                <p className="text-xs text-cream/50 leading-relaxed">
                  Khu Đô Thị Sáng Tạo, Quận 1, TP. Hồ Chí Minh
                </p>
                <p className="text-xs text-gold/80 font-serif">
                  Hotline: (028) 3822 8899
                </p>
              </div>
            </div>
          </div>

          <div className="hairline mb-8" />

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/40">
            <p className="tracking-widest uppercase">
              Smart Restaurant System © {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-6">
              <span className="hover:text-gold transition-colors cursor-pointer min-h-11 inline-flex items-center">
                Chính sách bảo mật
              </span>
              <span className="hover:text-gold transition-colors cursor-pointer min-h-11 inline-flex items-center">
                Điều khoản dịch vụ
              </span>
              <span className="hover:text-gold transition-colors cursor-pointer min-h-11 inline-flex items-center">
                Liên hệ hỗ trợ
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bill Request - Chỉ hiện khi có tableId */}
      {tableId && (
        <FloatingBillRequest tableId={tableId} sessionId={sessionId} />
      )}

      {/* AI Sommelier & Smart Dining Assistant */}
      <AiDiningAssistant />
    </div>
  );
};

export default CustomerLayout;
