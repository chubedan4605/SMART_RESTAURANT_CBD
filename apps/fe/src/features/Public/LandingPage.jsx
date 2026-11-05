import { Link } from "react-router-dom";
import {
  ArrowRight,
  QrCode,
  Users,
} from "lucide-react";
import WhyChooseUs from "./components/WhyChooseUs";
import SignatureDishes from "./components/SignatureDishes";
import HeroTitle from "./components/HeroTitle";
import { WelcomeCurtain } from "./components/WelcomeCurtain";
import BlogSection from "./components/BlogSection";
import { useEffect, useState } from "react";
import { menuApi } from "../../services/menuApi";
import { useTranslation } from "react-i18next";
import { Reveal, SectionLabel } from "../../Components/site/primitives";

const LandingPage = () => {
  const { t } = useTranslation();
  const [signatureDishes, setSignatureDishes] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchTopDishes = async () => {
      try {
        const res = await menuApi.getTopChefBestSeller(5);
        const items = res?.data || [];
        if (mounted) setSignatureDishes(items);
      } catch (err) {
        console.error("fetchTopDishes error:", err);
        if (mounted) setSignatureDishes([]);
      }
    };

    fetchTopDishes();

    return () => {
      mounted = false;
    };
  }, []);

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
      title: t("landing.gallery.indoor.title"),
      description: t("landing.gallery.indoor.description"),
    },
    {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
      title: t("landing.gallery.dining.title"),
      description: t("landing.gallery.dining.description"),
    },
    {
      url: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600",
      title: t("landing.gallery.checkin.title"),
      description: t("landing.gallery.checkin.description"),
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
      title: t("landing.gallery.vip.title"),
      description: t("landing.gallery.vip.description"),
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-background text-foreground font-sans">
      {/* --- HIỆU ỨNG MÀN CHÀO MỪNG --- */}
      <WelcomeCurtain />

      {/* 1. HERO SECTION */}
      <div className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden flex items-center justify-center">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Restaurant Background"
            className="w-full h-full object-cover opacity-60 scale-100 transition-transform duration-[12s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-ink/75 to-ink/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col justify-center items-center text-center">
          <SectionLabel align="center" className="mb-6">
            Haute Cuisine & Smart Experience
          </SectionLabel>

          <HeroTitle />

          <p className="text-cream/80 text-base sm:text-lg md:text-xl max-w-2xl mb-10 font-sans font-light tracking-wide leading-relaxed">
            {t("landing.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link
              to="/menu"
              className="min-h-11 px-8 py-3.5 bg-gold hover:bg-gold-soft text-ink font-sans text-xs tracking-luxe uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-gold/20 cursor-pointer"
            >
              {t("landing.hero.viewMenu")}
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/signup"
              className="min-h-11 px-8 py-3.5 bg-transparent border border-cream/30 hover:border-gold hover:bg-cream/10 text-cream font-sans text-xs tracking-luxe uppercase transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              {t("landing.hero.registerMember")}
            </Link>
          </div>

          {/* Gợi ý quét QR */}
          <div className="mt-12 flex items-center gap-4 text-cream/90 text-sm p-4 sm:p-5 border border-gold/30 backdrop-blur-md bg-ink/40 max-w-md">
            <div className="w-11 h-11 bg-gold text-ink flex items-center justify-center shrink-0">
              <QrCode size={22} />
            </div>
            <div className="text-left font-sans">
              <p className="text-cream font-medium tracking-wide">
                {t("landing.hero.atRestaurant")}
              </p>
              <p className="text-cream/70 text-xs sm:text-sm font-light">
                {t("landing.hero.scanQRHint")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SIGNATURE DISHES */}
      <SignatureDishes signatureDishes={signatureDishes} />

      {/* 3. PHILOSOPHY / WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 4. CULINARY BLOG & STORIES */}
      <BlogSection />

      {/* 5. GALLERY / RESTAURANT AMBIENCE SECTION */}
      <section className="py-24 px-4 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-7xl">
          <Reveal className="text-center mb-16 flex flex-col items-center">
            <SectionLabel align="center" className="mb-4">
              {t("landing.space.badge")}
            </SectionLabel>

            <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-4 font-normal">
              {t("landing.space.title")}{" "}
              <span className="italic text-gold">
                {t("landing.space.titleHighlight")}
              </span>
            </h2>

            <p className="text-muted-foreground font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t("landing.space.description")}
            </p>
          </Reveal>

          <Reveal delay={150} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden border border-border hover:border-gold/50 transition-colors ${
                  index === 0 ? "md:col-span-2 h-96" : "h-80"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-3xl text-cream mb-2 font-medium">
                    {image.title}
                  </h3>
                  <p className="font-sans text-cream/70 text-sm tracking-wide font-light">
                    {image.description}
                  </p>
                </div>

                <div className="absolute top-6 right-6 px-3.5 py-1.5 bg-gold text-ink text-[10px] font-sans tracking-luxe uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-md font-semibold">
                  {t("landing.viewMore")}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
