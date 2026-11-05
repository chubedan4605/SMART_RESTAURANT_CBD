import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Star, ArrowRight, QrCode, TrendingUp } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SignatureDishes = ({ signatureDishes = [] }) => {
  const formatVND = useMemo(() => {
    return (value) => {
      const n = Number(value || 0);
      return n.toLocaleString("vi-VN") + " ₫";
    };
  }, []);

  return (
    <section className="py-24 px-4 bg-bistro-cream dark:bg-neutral-900 font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bistro-wine/5 border border-bistro-wine/10 mb-6">
            <Sparkles className="w-4 h-4 text-bistro-wine" />
            <span className="text-bistro-wine font-sans text-xs uppercase tracking-[0.2em]">
              Signature Dishes
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl text-bistro-charcoal dark:text-gray-100 mb-6">
            Món Ăn{" "}
            <span className="italic text-bistro-wine">
              Đặc Trưng
            </span>
          </h2>

          <p className="text-bistro-charcoal dark:text-gray-100/70 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            Top món được đầu bếp đề xuất và được gọi nhiều nhất
          </p>
        </div>

        {/* Slider */}
        <div className="mb-16 px-2">
          {signatureDishes.length === 0 ? (
            <div className="text-center text-bistro-charcoal dark:text-gray-100/50 py-10 font-sans">
              Chưa có dữ liệu món ăn.
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={32}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-16"
            >
              {signatureDishes.map((dish) => (
                <SwiperSlide key={dish.id} className="h-auto">
                  <div className="group h-[420px] relative bg-white dark:bg-neutral-950 overflow-hidden border border-black/5 hover:border-bistro-wine/30 transition-all duration-500 hover:shadow-xl flex flex-col rounded-sm">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <img
                        src={
                          dish.image || "https://via.placeholder.com/600x400"
                        }
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Badge thay cho category text */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-bistro-wine text-white text-[10px] font-sans uppercase tracking-widest shadow-md">
                          Chef’s Choice
                        </span>

                        {typeof dish.soldQty === "number" && (
                          <span className="px-3 py-1 bg-white dark:bg-neutral-950/90 backdrop-blur-md text-bistro-charcoal dark:text-gray-100 text-[10px] font-sans uppercase tracking-widest shadow-md flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {dish.soldQty} sold
                          </span>
                        )}
                      </div>

                      {/* Rating fake */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white dark:bg-neutral-950/90 backdrop-blur-md px-2 py-1 shadow-md">
                        <Star className="w-3 h-3 text-bistro-gold fill-bistro-gold" />
                        <span className="text-bistro-charcoal dark:text-gray-100 text-xs font-bold font-sans">
                          4.9
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow bg-white dark:bg-neutral-950">
                      <h3 className="font-display text-2xl text-bistro-charcoal dark:text-gray-100 mb-2 group-hover:text-bistro-wine transition-colors line-clamp-1">
                        {dish.name}
                      </h3>

                      <p className="text-bistro-charcoal dark:text-gray-100/60 font-sans text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        {/* Giá VND */}
                        <span className="font-sans text-xl font-medium text-bistro-wine">
                          {formatVND(dish.price)}
                        </span>

                        {/* Nút gọi món */}
                        <Link
                          to={`/menu?itemId=${dish.id}`}
                          className="px-5 py-2 bg-transparent border border-bistro-wine hover:bg-bistro-wine hover:text-white text-bistro-wine font-sans text-xs tracking-widest uppercase transition-all duration-300"
                        >
                          Gọi món
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/menu"
            className="px-10 py-4 bg-bistro-charcoal hover:bg-black text-white font-sans text-sm tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-3 shadow-lg"
          >
            Xem Toàn Bộ Menu
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/booking"
            className="px-10 py-4 bg-transparent border border-bistro-charcoal hover:bg-bistro-charcoal hover:text-white text-bistro-charcoal dark:text-gray-100 font-sans text-sm tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-3"
          >
            <QrCode size={18} />
            Quét mã QR
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignatureDishes;
