import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 gradient-hero relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
          Sẵn sàng bắt đầu hành trình học tập?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
          Đăng ký ngay hôm nay để tìm gia sư phù hợp hoặc bắt đầu sự nghiệp giảng dạy của bạn.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base px-8 h-12 rounded-xl shadow-elevated">
            <Link to="/find-tutor">Tìm gia sư ngay</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 h-12 rounded-xl">
            <Link to="/register-tutor">Trở thành gia sư</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
