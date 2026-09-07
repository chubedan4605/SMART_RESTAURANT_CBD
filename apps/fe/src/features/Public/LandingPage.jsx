import { Link } from "react-router-dom";
import {
  ArrowRight,
  QrCode,
  Leaf,
  ChefHat,
  Heart,
  Clock,
  Sparkles,
  Star,
  Users,
  Wine,
} from "lucide-react";
import WhyChooseUs from "../../Components/WhyChooseUs";
import SignatureDishes from "../../Components/SignatureDishes";
import HeroTitle from "../../Components/HeroTitle";
import { WelcomeCurtain } from "../../Components/WelcomeCurtain";
import BlogSection from "../../Components/BlogSection";
import { useEffect } from "react";
import { useState } from "react";
import { menuApi } from "../../services/menuApi";
import { useTranslation } from "react-i18next";
// --- COMPONENT CON: HIỆU ỨNG MÀN CHÀO MỪNG ---

// --- COMPONENT CHÍNH ---
const LandingPage = () => {
  const { t } = useTranslation();
  // 1. Dữ liệu Món ăn Signature
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

  // 2. Dữ liệu Tính năng
  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: t("landing.features.freshIngredients.title"),
      description: t("landing.features.freshIngredients.description"),
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: t("landing.features.experiencedChef.title"),
      description: t("landing.features.experiencedChef.description"),
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t("landing.features.cozySpace.title"),
      description: t("landing.features.cozySpace.description"),
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t("landing.features.fastService.title"),
      description: t("landing.features.fastService.description"),
    },
  ];

  // 3. Dữ liệu Hình ảnh Gallery
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
    <div className="relative w-full overflow-hidden bg-bistro-cream dark:bg-neutral-900 text-bistro-charcoal dark:text-gray-100 font-sans">
      {/* --- HIỆU ỨNG MÀN CHÀO MỪNG --- */}
      <WelcomeCurtain />

      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Restaurant Background"
            className="w-full h-full object-cover opacity-80 transition-transform duration-[10s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <HeroTitle />

          <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-10 font-sans font-light tracking-wide">
            {t("landing.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <Link
              to="/menu"
              className="px-10 py-4 bg-bistro-wine hover:bg-bistro-wine-light text-white font-sans text-sm tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
            >
              {t("landing.hero.viewMenu")}
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/signup"
              className="px-10 py-4 bg-transparent border border-white hover:bg-white dark:bg-neutral-950 hover:text-bistro-charcoal dark:text-gray-100 text-white font-sans text-sm tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center"
            >
              {t("landing.hero.registerMember")}
            </Link>
          </div>

          {/* Gợi ý quét QR */}
          <div className="mt-12 flex items-center gap-4 text-white/80 text-sm p-5 rounded-none border border-white/20 backdrop-blur-md bg-white dark:bg-neutral-950/5">
            <div className="bg-bistro-wine p-2">
              <QrCode size={24} className="text-white" />
            </div>
            <div className="text-left font-sans">
              <p className="text-white font-medium tracking-wide">
                {t("landing.hero.atRestaurant")}
              </p>
              <p className="text-white/70">{t("landing.hero.scanQRHint")}</p>
            </div>
          </div>
        </div>
      </div>

      <SignatureDishes signatureDishes={signatureDishes} />
      {/* 3. FEATURES / WHY CHOOSE US SECTION */}
      <WhyChooseUs />
      <BlogSection />

      {/* 4. GALLERY / RESTAURANT SPACE SECTION */}
      <section className="py-24 px-4 bg-bistro-cream dark:bg-neutral-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bistro-wine/5 border border-bistro-wine/10 mb-6">
              <Users className="w-4 h-4 text-bistro-wine" />
              <span className="text-bistro-wine font-sans text-xs uppercase tracking-[0.2em]">
                {t("landing.space.badge")}
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-bistro-charcoal dark:text-gray-100 mb-6">
              {t("landing.space.title")}{" "}
              <span className="italic text-bistro-wine">
                {t("landing.space.titleHighlight")}
              </span>
            </h2>
            <p className="text-bistro-charcoal dark:text-gray-100/70 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
              {t("landing.space.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden ${
                  index === 0 ? "md:col-span-2 h-96" : "h-80"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="font-display text-3xl text-white mb-2">
                    {image.title}
                  </h3>
                  <p className="font-sans text-white/80 text-sm tracking-wide">{image.description}</p>
                </div>

                <div className="absolute top-6 right-6 px-4 py-2 bg-bistro-wine text-white text-xs font-sans tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-md">
                  {t("landing.viewMore")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
