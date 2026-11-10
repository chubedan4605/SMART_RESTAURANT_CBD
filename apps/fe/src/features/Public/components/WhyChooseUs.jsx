import React from "react";
import { Heart, Clock, Award, Leaf } from "lucide-react";
import { Reveal, SectionLabel } from "../../../Components/site/primitives";

const FeatureCard = ({ feature, index }) => {
  return (
    <Reveal
      delay={index * 100}
      className="p-8 bg-card text-card-foreground border border-border hover:border-gold/40 transition-all duration-500 font-sans group hover:shadow-lg rounded-none"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/20 text-gold mb-6 group-hover:bg-gold group-hover:text-ink transition-colors duration-300">
        {feature.icon}
      </div>
      <h3 className="font-serif text-2xl text-foreground mb-3 font-medium group-hover:text-gold transition-colors">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed font-light">
        {feature.description}
      </p>
    </Reveal>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Nguyên Liệu Thượng Hạng",
      description: "Cam kết 100% nguyên liệu tươi sạch, nguồn gốc xuất xứ rõ ràng và tuyển chọn kỹ lưỡng mỗi sớm.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Bếp Trưởng Kinh Nghiệm",
      description: "Đội ngũ chuyên gia ẩm thực hàng đầu với bề dày phục vụ các bữa tiệc chuẩn fine-dining quốc tế.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Không Gian Tinh Tế",
      description: "Thiết kế giao thoa cổ điển và hiện đại, ấm cúng hoàn hảo cho gia đình, gặp gỡ đối tác và tiệc kỷ niệm.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Phục Vụ Chu Đáo & Nhanh Chóng",
      description: "Trải nghiệm gọi món số hóa liền mạch, phục vụ tận tâm với thời gian chờ tối ưu chuẩn nhà hàng cao cấp.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-background border-t border-border/50 overflow-hidden font-sans">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* CỘT TRÁI (Tiêu đề) */}
          <div className="w-full lg:w-1/3 sticky top-4 lg:top-24 z-10 flex flex-col items-center lg:items-start text-center lg:text-left mb-4 lg:mb-0">
            <Reveal>
              <SectionLabel className="mb-4">
                Our Philosophy
              </SectionLabel>

              <h2 className="font-serif text-4xl md:text-5xl text-foreground lg:mb-6 leading-tight font-normal">
                Đẳng Cấp <br />
                <span className="italic text-gold">Ẩm Thực Đích Thực</span>
              </h2>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md font-light">
                Mỗi món ăn gửi gắm triết lý ẩm thực sâu sắc: sự hài hòa của hương vị, tính thẩm mỹ của bài trí và lòng hiếu khách chân thành.
              </p>
            </Reveal>
          </div>

          {/* CỘT PHẢI (Grid Features) */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
