import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl text-background">
                Edu<span className="text-secondary">Connect</span>
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Nền tảng kết nối gia sư và học sinh hàng đầu Việt Nam với công nghệ AI tiên tiến.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-background mb-4">Sản phẩm</h4>
            <ul className="space-y-2.5">
              <li><Link to="/find-tutor" className="text-background/60 text-sm hover:text-secondary transition-colors">Tìm gia sư</Link></li>
              <li><Link to="/register-tutor" className="text-background/60 text-sm hover:text-secondary transition-colors">Đăng ký làm gia sư</Link></li>
              <li><Link to="/exam-online" className="text-background/60 text-sm hover:text-secondary transition-colors">Thi thử online</Link></li>
              <li><Link to="/pricing" className="text-background/60 text-sm hover:text-secondary transition-colors">Bảng giá</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-background mb-4">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              <li><Link to="/help" className="text-background/60 text-sm hover:text-secondary transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link to="/faq" className="text-background/60 text-sm hover:text-secondary transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link to="/contact" className="text-background/60 text-sm hover:text-secondary transition-colors">Liên hệ</Link></li>
              <li><Link to="/refund" className="text-background/60 text-sm hover:text-secondary transition-colors">Chính sách hoàn tiền</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-background mb-4">Liên hệ</h4>
            <ul className="space-y-2.5">
              <li className="text-background/60 text-sm">support@educonnect.vn</li>
              <li className="text-background/60 text-sm">1900 1234</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">&copy; 2025 EduConnect. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-background/40 text-sm hover:text-background/60 transition-colors">Điều khoản sử dụng</Link>
            <Link to="/privacy" className="text-background/40 text-sm hover:text-background/60 transition-colors">Chính sách bảo mật</Link>
            <Link to="/gdpr" className="text-background/40 text-sm hover:text-background/60 transition-colors">GDPR</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
