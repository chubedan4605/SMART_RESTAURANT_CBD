import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BlogSection = () => {
  const { t } = useTranslation();

  // Blog posts data with i18n
  const blogPosts = [
    {
      id: 1,
      titleKey: "blog.posts.wagyu.title",
      excerptKey: "blog.posts.wagyu.excerpt",
      date: "05/01/2026",
      author: "Chef Ramsay",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
      categoryKey: "blog.categories.knowledge",
    },
    {
      id: 2,
      titleKey: "blog.posts.wine.title",
      excerptKey: "blog.posts.wine.excerpt",
      date: "02/01/2026",
      author: "Sommelier Tuan",
      image:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
      categoryKey: "blog.categories.tips",
    },
    {
      id: 3,
      titleKey: "blog.posts.romantic.title",
      excerptKey: "blog.posts.romantic.excerpt",
      date: "28/12/2025",
      author: "Admin",
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
      categoryKey: "blog.categories.events",
    },
    {
      id: 4,
      titleKey: "blog.posts.organic.title",
      excerptKey: "blog.posts.organic.excerpt",
      date: "20/12/2025",
      author: "Chef Linh",
      image:
        "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80",
      categoryKey: "blog.categories.ingredients",
    },
    {
      id: 5,
      titleKey: "blog.posts.omakase.title",
      excerptKey: "blog.posts.omakase.excerpt",
      date: "15/12/2025",
      author: "Chef Akira",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80",
      categoryKey: "blog.categories.culture",
    },
  ];

  return (
    <section className="py-24 px-4 bg-bistro-cream/50 font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bistro-wine/5 border border-bistro-wine/10 mb-6">
            <BookOpen className="w-4 h-4 text-bistro-wine" />
            <span className="text-bistro-wine font-sans text-xs uppercase tracking-[0.2em]">
              {t("blog.ourStories")}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-bistro-charcoal mb-6">
            {t("blog.corner")}{" "}
            <span className="italic text-bistro-wine">
              {t("blog.culinary")}
            </span>
          </h2>
          <p className="text-bistro-charcoal/70 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            {t("blog.description")}
          </p>
        </div>

        {/* SWIPER CAROUSEL */}
        <div className="mb-16">
          <Swiper
            modules={[Autoplay, Pagination]}
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
              640: {
                slidesPerView: 2, // Tablet: 2 cột
              },
              1024: {
                slidesPerView: 3, // PC: 3 cột
              },
            }}
            className="pb-16 px-2" // Padding bottom cho dấu chấm pagination
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post.id} className="h-auto">
                <article className="group h-[420px] flex flex-col bg-white overflow-hidden border border-black/5 hover:border-bistro-wine/30 transition-all duration-500 hover:shadow-xl rounded-sm">
                  {/* ẢNH THUMBNAIL */}
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <img
                      src={post.image}
                      alt={t(post.titleKey)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badge Category */}
                    <div className="absolute top-4 left-4 bg-bistro-wine text-white text-[10px] font-sans uppercase tracking-widest px-3 py-1 shadow-md">
                      {t(post.categoryKey)}
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500"></div>
                  </div>

                  {/* NỘI DUNG */}
                  <div className="p-8 flex flex-col grow bg-white">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-bistro-charcoal/50 mb-4 font-sans tracking-wide">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-bistro-wine" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-bistro-wine" />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl text-bistro-charcoal mb-3 line-clamp-2 group-hover:text-bistro-wine transition-colors">
                      <Link to={`/blog/${post.id}`}>{t(post.titleKey)}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-bistro-charcoal/60 font-sans text-sm mb-6 line-clamp-3 grow leading-relaxed">
                      {t(post.excerptKey)}
                    </p>

                    {/* Button */}
                    <button className="inline-flex items-center gap-2 text-bistro-wine font-sans text-xs uppercase tracking-widest group/link mt-auto hover:text-bistro-wine-light transition-colors">
                      {t("blog.viewDetails")}
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover/link:translate-x-2"
                      />
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* BUTTON XEM TẤT CẢ */}
        <div className="text-center">
          <button className="inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-bistro-charcoal hover:bg-bistro-charcoal hover:text-white text-bistro-charcoal font-sans text-sm tracking-[0.2em] uppercase transition-all duration-300">
            {t("blog.viewAllPosts")}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
