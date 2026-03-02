import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-foreground dark:bg-card py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-neon flex items-center justify-center">
                <span className="text-neon-foreground font-bold text-base font-display">E</span>
              </div>
              <span className="font-bold text-xl font-display text-background dark:text-foreground">
                Edu<span className="text-neon">Connect</span>
              </span>
            </div>
            <p className="text-background/50 dark:text-muted-foreground text-sm leading-relaxed mb-5">
              Nền tảng kết nối gia sư và học sinh hàng đầu Việt Nam với công nghệ AI tiên tiến.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-background/50 dark:text-muted-foreground text-sm">
                <Mail className="w-4 h-4" /> support@educonnect.vn
              </div>
              <div className="flex items-center gap-2 text-background/50 dark:text-muted-foreground text-sm">
                <Phone className="w-4 h-4" /> 1900 1234
              </div>
            </div>
          </div>

          {[
            {
              title: "Sản phẩm",
              links: [
                { to: "/find-tutor", label: "Tìm gia sư" },
                { to: "/register-tutor", label: "Đăng ký làm gia sư" },
                { to: "/exam-online", label: "Thi thử online" },
                { to: "/pricing", label: "Bảng giá" },
              ],
            },
            {
              title: "Hỗ trợ",
              links: [
                { to: "/help", label: "Trung tâm trợ giúp" },
                { to: "/faq", label: "Câu hỏi thường gặp" },
                { to: "/contact", label: "Liên hệ" },
                { to: "/refund", label: "Chính sách hoàn tiền" },
              ],
            },
            {
              title: "Pháp lý",
              links: [
                { to: "/terms", label: "Điều khoản sử dụng" },
                { to: "/privacy", label: "Chính sách bảo mật" },
                { to: "/gdpr", label: "GDPR" },
              ],
            },
          ].map((group) => (
            <div key={group.title}>
              <h4 className="font-bold text-background dark:text-foreground font-display mb-5">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-background/50 dark:text-muted-foreground text-sm hover:text-neon transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 dark:border-border pt-8 text-center">
          <p className="text-background/30 dark:text-muted-foreground text-sm">
            &copy; 2025 EduConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
