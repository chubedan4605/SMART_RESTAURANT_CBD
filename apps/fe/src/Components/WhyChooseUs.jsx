import React, { useState, useEffect, useRef } from "react";
import { Heart, Clock, Award, Leaf } from "lucide-react";

// --- HOOK NHỎ: KIỂM TRA XEM PHẦN TỬ CÓ ĐANG HIỂN THỊ TRÊN MÀN HÌNH KHÔNG ---
const useInView = (options) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Khi phần tử xuất hiện trong khung hình thì set là true
      if (entry.isIntersecting) {
        setIsInView(true);
        // Nếu muốn nó chạy 1 lần rồi thôi (không chạy lại khi lướt lên) thì unobserve luôn:
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isInView];
};

// --- COMPONENT THẺ CON (Tách ra để xử lý logic hiển thị riêng từng cái) ---
const FeatureCard = ({ feature, index }) => {
  // Dùng hook vừa tạo, threshold 0.2 nghĩa là hiện 20% thẻ thì bắt đầu chạy hiệu ứng
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`
        p-8 bg-bistro-cream rounded-none border border-black/5 
        transition-all duration-1000 ease-out font-sans

        /* --- LOGIC MOBILE (Mặc định) --- */
        /* Nếu đã lướt tới (isInView = true) -> Hiện rõ, về giữa */
        /* Nếu chưa lướt tới -> Mờ, Dịch sang trái/phải tùy chẵn lẻ */
        ${
          isInView
            ? "opacity-100 translate-x-0"
            : `opacity-0 ${
                index % 2 === 0 ? "-translate-x-16" : "translate-x-16"
              }`
        }

        /* --- LOGIC DESKTOP (Ghi đè bằng lg:) --- */
        /* Trên PC thì luôn mờ 40% và lệch sang bên, CHỜ HOVER mới hiện */
        lg:opacity-40 
        lg:translate-x-0 /* Reset vị trí mobile */
        
        /* Chỗ này giữ logic cũ của bạn cho Desktop */
        ${
          index % 2 === 0 ? "lg:translate-x-25" : "lg:translate-x-25"
        }

        /* Khi Hover chuột vào vùng cha (group) trên PC */
        lg:group-hover:opacity-100 
        lg:group-hover:translate-x-0
        
        /* Hover vào chính thẻ đó */
        hover:opacity-100 hover:scale-105 hover:border-bistro-wine/30 hover:bg-white hover:shadow-lg
      `}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-bistro-wine/5 text-bistro-wine mb-4">
        {feature.icon}
      </div>
      <h3 className="font-display text-2xl text-bistro-charcoal mb-2">{feature.title}</h3>
      <p className="text-bistro-charcoal/70 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const WhyChooseUs = () => {
  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Nguyên liệu tươi",
      description: "Cam kết 100% nguyên liệu nhập khẩu và tươi sống mỗi ngày.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Đầu bếp 20 năm",
      description: "Đội ngũ bếp chuyên nghiệp từ khách sạn 5 sao.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Không gian ấm cúng",
      description: "Thiết kế sang trọng, phù hợp gia đình & sự kiện.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Phục vụ nhanh",
      description: "Gọi món qua QR – món lên trong 15 phút.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-white group overflow-hidden font-sans">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* CỘT TRÁI (Tiêu đề) - Giữ nguyên */}
          {/* Thêm: flex flex-col items-center text-center (cho mobile) */}
          {/* Reset: lg:items-start lg:text-left (cho desktop) */}
          {/* Thêm: mb-8 (để tạo khoảng cách với phần Grid bên dưới trên mobile) */}
          <div className="w-full lg:w-1/3 sticky top-4 lg:top-10 z-10 flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0">
            {/* Badge: Giảm margin bottom từ mb-6 xuống mb-4 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bistro-wine/5 border border-bistro-wine/10 mb-6">
              <Heart className="w-4 h-4 text-bistro-wine" />
              <span className="text-bistro-wine font-sans text-xs uppercase tracking-[0.2em]">
                Why Choose Us
              </span>
            </div>

            {/* Heading: Giảm font size mobile (text-3xl) và giảm margin bottom (mb-4) */}
            <h2 className="font-display text-4xl md:text-5xl text-bistro-charcoal lg:mb-6 leading-tight">
              Đẳng cấp <br />
              <span className="italic text-bistro-wine">
                Ẩm Thực
              </span>
            </h2>


          </div>

          {/* CỘT PHẢI (Grid Features) */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              // Gọi Component con đã tách ra ở trên
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
