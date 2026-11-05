import React from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight, QrCode, TrendingUp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Reveal, SectionLabel, formatPrice } from "../../../Components/site/primitives";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SignatureDishes = ({ signatureDishes = [] }) => {
  return (
    <section className="py-24 px-4 bg-background text-foreground font-sans border-t border-border/50">
      <div className="container mx-auto max-w-7xl">
        {/* Header with SectionLabel & Reveal */}
        <Reveal className="text-center mb-16 flex flex-col items-center">
          <SectionLabel align="center" className="mb-4">
            Signature Selection
          </SectionLabel>

          <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-4 font-normal">
            Món Ăn <span className="italic text-gold">Đặc Trưng</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tuyển chọn những tinh hoa ẩm thực được bếp trưởng tâm huyết sáng tạo và đón nhận nhiều nhất.
          </p>
        </Reveal>

        {/* Slider */}
        <Reveal delay={150} className="mb-16 px-2">
          {signatureDishes.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 font-sans">
              Đang cập nhật thực đơn đặc sắc...
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={32}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4500,
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
                <SwiperSlide key={dish.id} className="!h-auto flex flex-col">
                  <div className="group w-full flex-1 relative bg-card text-card-foreground overflow-hidden border border-border hover:border-gold/50 transition-all duration-500 hover:shadow-xl flex flex-col rounded-none">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden shrink-0 bg-muted">
                      <img
                        src={
                          dish.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
                        }
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-ink/90 text-gold border border-gold/30 text-[10px] font-sans uppercase tracking-luxe shadow-md backdrop-blur-xs">
                          Chef’s Choice
                        </span>

                        {typeof dish.soldQty === "number" && (
                          <span className="px-3 py-1 bg-card/90 backdrop-blur-xs text-foreground text-[10px] font-sans uppercase tracking-widest shadow-md flex items-center gap-1 border border-border">
                            <TrendingUp className="w-3 h-3 text-gold" />
                            {dish.soldQty} đã đặt
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/90 backdrop-blur-xs px-2.5 py-1 shadow-md border border-border">
                        <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                        <span className="text-foreground text-xs font-semibold font-sans">
                          4.9
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 bg-card">
                      <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1 font-medium">
                        {dish.name}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex-1 leading-relaxed font-light">
                        {dish.description}
                      </p>

                      <div className="hairline mb-4" />

                      <div className="flex items-center justify-between mt-auto">
                        {/* Price */}
                        <span className="font-serif text-2xl font-normal text-gold">
                          {formatPrice(dish.price)}
                        </span>

                        {/* Order CTA */}
                        <Link
                          to={`/menu?itemId=${dish.id}`}
                          className="min-h-11 px-5 py-2.5 bg-transparent border border-gold/60 hover:border-gold hover:bg-gold hover:text-ink text-gold font-sans text-xs tracking-luxe uppercase transition-all duration-300 inline-flex items-center justify-center font-medium"
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
        </Reveal>

        {/* Buttons */}
        <Reveal delay={250} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            to="/menu"
            className="min-h-11 px-8 py-3.5 bg-gold text-ink hover:bg-gold-soft font-sans text-xs tracking-luxe uppercase font-semibold transition-all duration-300 inline-flex items-center gap-3 shadow-md cursor-pointer"
          >
            Xem Toàn Bộ Thực Đơn
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/booking"
            className="min-h-11 px-8 py-3.5 bg-transparent border border-border hover:border-gold text-foreground hover:text-gold font-sans text-xs tracking-luxe uppercase transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
          >
            <QrCode size={16} />
            Quét mã tại bàn
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default SignatureDishes;
