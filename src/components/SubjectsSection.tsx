import { motion } from "framer-motion";
import { Calculator, Atom, FlaskConical, Leaf, BookOpen, Landmark, MapPin, Languages, Monitor, Scale, Music, Palette } from "lucide-react";

const subjects = [
  { icon: Calculator, name: "Toán học", range: "Lớp 1-12", color: "from-blue-500 to-indigo-600" },
  { icon: Atom, name: "Vật lý", range: "Lớp 6-12", color: "from-cyan-400 to-blue-500" },
  { icon: FlaskConical, name: "Hóa học", range: "Lớp 8-12", color: "from-green-400 to-emerald-600" },
  { icon: Leaf, name: "Sinh học", range: "Lớp 6-12", color: "from-emerald-400 to-teal-600" },
  { icon: BookOpen, name: "Ngữ văn", range: "Lớp 1-12", color: "from-rose-400 to-pink-600" },
  { icon: Landmark, name: "Lịch sử", range: "Lớp 4-12", color: "from-amber-400 to-orange-600" },
  { icon: MapPin, name: "Địa lý", range: "Lớp 4-12", color: "from-teal-400 to-cyan-600" },
  { icon: Languages, name: "Tiếng Anh", range: "Lớp 1-12", color: "from-violet-400 to-purple-600" },
  { icon: Monitor, name: "Tin học", range: "Lớp 3-12", color: "from-sky-400 to-blue-600" },
  { icon: Scale, name: "GDCD", range: "Lớp 6-12", color: "from-orange-400 to-red-500" },
  { icon: Music, name: "Âm nhạc", range: "Lớp 1-12", color: "from-pink-400 to-rose-600" },
  { icon: Palette, name: "Mỹ thuật", range: "Lớp 1-12", color: "from-fuchsia-400 to-purple-600" },
];

const SubjectsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden" id="subjects">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 text-neon text-sm font-semibold mb-4 dark:bg-neon/10 dark:text-neon">
            Chương trình học
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-foreground mb-4">
            12 môn học <span className="text-gradient">cơ bản</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Đầy đủ các môn học theo chương trình phổ thông, từ lớp 1 đến lớp 12
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group bg-card rounded-2xl p-5 text-center shadow-soft border border-border hover:border-neon/20 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-sm text-foreground font-display mb-1">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.range}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
