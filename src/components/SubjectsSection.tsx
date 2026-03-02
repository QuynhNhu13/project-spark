import { motion } from "framer-motion";
import { Calculator, Atom, FlaskConical, Leaf, BookOpen, Landmark, MapPin, Languages, Monitor, Scale, Music, Palette } from "lucide-react";

const subjects = [
  { icon: Calculator, name: "Toán học", range: "Lớp 1-12" },
  { icon: Atom, name: "Vật lý", range: "Lớp 6-12" },
  { icon: FlaskConical, name: "Hóa học", range: "Lớp 8-12" },
  { icon: Leaf, name: "Sinh học", range: "Lớp 6-12" },
  { icon: BookOpen, name: "Ngữ văn", range: "Lớp 1-12" },
  { icon: Landmark, name: "Lịch sử", range: "Lớp 4-12" },
  { icon: MapPin, name: "Địa lý", range: "Lớp 4-12" },
  { icon: Languages, name: "Tiếng Anh", range: "Lớp 1-12" },
  { icon: Monitor, name: "Tin học", range: "Lớp 3-12" },
  { icon: Scale, name: "GDCD", range: "Lớp 6-12" },
  { icon: Music, name: "Âm nhạc", range: "Lớp 1-12" },
  { icon: Palette, name: "Mỹ thuật", range: "Lớp 1-12" },
];

const SubjectsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background" id="subjects">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">12 môn học cơ bản</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Đầy đủ các môn học theo chương trình phổ thông, từ lớp 1 đến lớp 12
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group bg-card rounded-2xl p-5 text-center shadow-card border border-border hover:border-secondary/40 hover:shadow-elevated transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light group-hover:bg-secondary-light mx-auto flex items-center justify-center mb-3 transition-colors">
                <s.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.range}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
