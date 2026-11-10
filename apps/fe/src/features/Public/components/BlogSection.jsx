import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Reveal, SectionLabel } from "../../../Components/site/primitives";

import "swiper/css";
import "swiper/css/pagination";

const BlogSection = () => {
  const { t } = useTranslation();

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
    <section className="py-24 px-4 bg-background/50 border-t border-border/50 font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <Reveal className="text-center mb-16 flex flex-col items-center">
          <SectionLabel align="center" className="mb-4">
            {t("blog.ourStories")}
          </SectionLabel>

          <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-4 font-normal">
            Góc <span className="italic text-gold">Ẩm Thực & Cảm Hứng</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("blog.description")}
          </p>
        </Reveal>

        {/* SWIPER CAROUSEL */}
        <Reveal delay={150} className="mb-16">
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
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-16 px-2"
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post.id} className="!h-auto flex flex-col">
                <article className="group w-full flex-1 flex flex-col bg-card text-card-foreground overflow-hidden border border-border hover:border-gold/40 transition-all duration-500 hover:shadow-xl rounded-none">
                  {/* Thumbnail */}
                  <div className="relative h-56 overflow-hidden shrink-0 bg-muted">
                    <img
                      src={post.image}
                      alt={t(post.titleKey)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badge Category */}
                    <div className="absolute top-4 left-4 bg-ink/90 text-gold border border-gold/30 text-[10px] font-sans uppercase tracking-luxe px-3 py-1 shadow-md backdrop-blur-xs">
                      {t(post.categoryKey)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1 bg-card">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-sans tracking-wide">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gold" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-gold" />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl text-foreground mb-3 line-clamp-2 min-h-[4rem] group-hover:text-gold transition-colors font-medium flex items-start">
                      <Link to={`/blog/${post.id}`}>{t(post.titleKey)}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground font-sans text-sm mb-6 line-clamp-3 leading-relaxed font-light flex-1 min-h-[4.5rem]">
                      {t(post.excerptKey)}
                    </p>

                    {/* Button */}
                    <div className="pt-4 border-t border-border/40 mt-auto flex items-center">
                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 text-gold font-sans text-xs uppercase tracking-luxe group/link hover:text-gold-soft transition-colors min-h-11 font-medium"
                      >
                        {t("blog.viewDetails")}
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover/link:translate-x-1.5"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>

        {/* BUTTON XEM TẤT CẢ */}
        <Reveal delay={250} className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 min-h-11 px-8 py-3.5 bg-transparent border border-border hover:border-gold text-foreground hover:text-gold font-sans text-xs tracking-luxe uppercase transition-all duration-300 cursor-pointer"
          >
            {t("blog.viewAllPosts")}
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default BlogSection;
