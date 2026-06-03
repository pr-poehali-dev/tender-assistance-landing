import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";


const HERO_IMAGE = "https://cdn.poehali.dev/projects/1eecdf67-3b96-4300-8830-375376f7427c/files/400191c8-6667-4611-b847-6bb837fffbc3.jpg";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const t = threshold;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: t });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView };
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", consent: false });

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; setSent(false); }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,30,56,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ animation: "modalIn 0.3s ease-out" }}>
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #0a2b4e, #c9a03d)" }} />
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <Icon name="X" size={22} />
        </button>
        <div className="p-8">
          {!sent ? (
            <>
              <h3 className="font-display text-2xl font-bold text-navy mb-1">Бесплатная консультация</h3>
              <p className="text-sm text-gray-500 mb-6">Ответим в течение 30 минут в рабочее время</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Ваше имя *" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" />
                <input required placeholder="Телефон *" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" />
                <input type="email" placeholder="Email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" />
                <textarea placeholder="Кратко опишите вашу задачу..." rows={3} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none" />
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required checked={form.consent}
                    onChange={e => setForm({ ...form, consent: e.target.checked })} className="mt-0.5" />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    Я согласен на обработку персональных данных в соответствии с политикой конфиденциальности
                  </span>
                </label>
                <button type="submit" className="w-full py-3.5 rounded-lg font-semibold text-white text-sm tracking-wide transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0a2b4e, #0d3660)" }}>
                  Отправить заявку
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#e8f0f9" }}>
                <Icon name="CheckCircle" size={32} className="text-navy" />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy mb-2">Заявка отправлена (демо)</h3>
              <p className="text-gray-500 text-sm mb-6">Наш специалист свяжется с вами в течение 30 минут</p>
              <button onClick={onClose} className="px-8 py-3 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#0a2b4e" }}>
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border overflow-hidden transition-all" style={{ borderColor: open ? "#c9a03d" : "#e5e7eb" }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-navy pr-4 text-sm md:text-base">{question}</span>
        <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: open ? "#c9a03d" : "rgba(10,43,78,0.06)" }}>
          <Icon name={open ? "Minus" : "Plus"} size={14} className={open ? "text-white" : "text-navy"} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{answer}</div>
      )}
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", consent: false });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  if (sent) return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(10,43,78,0.08)" }}>
        <Icon name="CheckCircle" size={28} className="text-navy" />
      </div>
      <h3 className="font-display text-xl font-bold text-navy mb-2">Заявка принята (демо)!</h3>
      <p className="text-gray-500 text-sm">Ответим в течение 30 минут в рабочее время</p>
    </div>
  );
  return (
    <>
      <h3 className="font-display text-xl font-bold text-navy mb-5">Бесплатная консультация</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Ваше имя *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy transition-colors" />
        <input required placeholder="Телефон *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy transition-colors" />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-navy transition-colors" />
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" required checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} className="mt-0.5" />
          <span className="text-xs text-gray-400 leading-relaxed">Согласен на обработку персональных данных</span>
        </label>
        <button type="submit" className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0a2b4e, #0d3660)" }}>
          Отправить заявку
        </button>
      </form>
    </>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans bg-white min-h-screen text-gray-800">
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .text-navy { color: #0a2b4e; }
        .text-gold { color: #c9a03d; }
        .bg-navy { background: #0a2b4e; }
        .border-gold { border-color: #c9a03d; }
        .focus\\:border-gold:focus { border-color: #c9a03d; }
        .focus\\:border-navy:focus { border-color: #0a2b4e; }
      `}</style>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,43,78,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.18)" : "none",
        }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#c9a03d" }}>
              <Icon name="Scale" size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-wide">ТендерПро</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[["Услуги", "services"], ["Кейсы", "cases"], ["Отзывы", "reviews"], ["Контакты", "contacts"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm text-white/80 hover:text-white transition-colors font-medium tracking-wide"
                style={{ color: "rgba(255,255,255,0.8)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a03d")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}>
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+79174905751" className="text-sm text-white/90 font-medium">+7 917 490-57-51</a>
            <button onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#c9a03d" }}>
              Заказать звонок
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ background: "rgba(10,43,78,0.97)", borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="px-5 py-4 space-y-3">
              {[["Услуги", "services"], ["Кейсы", "cases"], ["Отзывы", "reviews"], ["Контакты", "contacts"]].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left text-white/80 hover:text-white py-2 text-sm font-medium">{label}</button>
              ))}
              <button onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}
                className="w-full mt-2 py-3 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#c9a03d" }}>
                Заказать звонок
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Тендерное сопровождение" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,30,56,0.93) 0%, rgba(10,43,78,0.82) 60%, rgba(10,43,78,0.5) 100%)" }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(201,160,61,0.04) 60px, rgba(201,160,61,0.04) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(201,160,61,0.04) 60px, rgba(201,160,61,0.04) 61px)"
        }} />

        <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-16 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase"
              style={{ background: "rgba(201,160,61,0.15)", border: "1px solid rgba(201,160,61,0.4)", color: "#c9a03d" }}>
              <Icon name="Shield" size={14} /> Защита от ФАС · Гарантия допуска к торгам
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Выигрывайте<br />
              <span style={{ color: "#c9a03d" }}>тендеры с нами</span><br />
              — под ключ
            </h1>
            <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: "rgba(255,255,255,0.75)" }}>
              Юридическое и аналитическое сопровождение торгов 44‑ФЗ, 223‑ФЗ.
              Подготовим заявку без ошибок, защитим от отклонений и обжалуем результаты.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #c9a03d, #e2b84a)", boxShadow: "0 8px 32px rgba(201,160,61,0.35)" }}>
                <Icon name="MessageSquare" size={18} />
                Бесплатная консультация
              </button>
              <button onClick={() => scrollTo("services")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white transition-all hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.35)" }}>
                Наши услуги
                <Icon name="ArrowDown" size={18} />
              </button>
            </div>

            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[["2 млрд+", "Сумма контрактов"], ["10+ лет", "Опыт команды"], ["300+", "Победных тендеров"], ["100%", "Гарантия допуска"]].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="font-display text-2xl md:text-3xl font-bold" style={{ color: "#c9a03d" }}>{num}</div>
                  <div className="text-xs mt-1 leading-tight" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section className="py-20 bg-gray-50" id="problems">
        <div className="max-w-6xl mx-auto px-5">
          <AnimatedSection className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Знакомые ситуации?</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "#0a2b4e" }}>С чем сталкивается бизнес</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "FileX", title: "Отклонение заявки", desc: "Формальные ошибки в документах приводят к отклонению даже сильных предложений" },
              { icon: "AlertTriangle", title: "Штрафы и риски", desc: "Нарушения при исполнении контракта грозят внесением в реестр недобросовестных поставщиков" },
              { icon: "Clock", title: "Потеря времени", desc: "Самостоятельная подготовка занимает недели, а результат не гарантирован" },
              { icon: "TrendingDown", title: "Упущенная прибыль", desc: "Госзаказ доступен, но без опыта участия деньги уходят конкурентам" },
            ].map(({ icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(10,43,78,0.08)" }}>
                    <Icon name={icon} size={22} style={{ color: "#0a2b4e" }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: "#0a2b4e" }}>{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24" id="services">
        <div className="max-w-6xl mx-auto px-5">
          <AnimatedSection className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Что мы делаем</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "#0a2b4e" }}>Услуги под ключ</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Берём на себя весь цикл — от поиска подходящих торгов до получения подписанного контракта</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", icon: "FileCheck", title: "Полное сопровождение тендера", desc: "Подбор закупок по вашему профилю, подготовка и подача заявки, отслеживание результатов. Работаем по 44-ФЗ и 223-ФЗ.", tags: ["Подбор закупок", "Подготовка заявки", "Подача и контроль"], accent: false },
              { num: "02", icon: "Search", title: "Юридический аудит заявки", desc: "Проверим вашу готовую заявку на ошибки и риски. Укажем на уязвимости до подачи, пока ещё можно исправить.", tags: ["Анализ ошибок", "Снижение рисков", "Рекомендации"], accent: true },
              { num: "03", icon: "Gavel", title: "Представительство в ФАС", desc: "Обжалование незаконных отклонений и нарушений заказчика. Защитим ваши интересы на любом этапе торгов.", tags: ["Жалоба в ФАС", "Защита интересов", "Обжалование"], accent: true },
              { num: "04", icon: "GraduationCap", title: "Тендерный консалтинг", desc: "Обучение вашей команды работе с госзакупками. Настройка внутренних процессов для регулярного участия.", tags: ["Обучение команды", "Настройка процессов", "Стратегия"], accent: false },
            ].map(({ num, icon, title, desc, tags, accent }, i) => (
              <AnimatedSection key={num} delay={i * 0.12}>
                <div className="group rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all bg-white h-full flex flex-col">
                  <div className="flex items-start gap-5 flex-1">
                    <div className="shrink-0">
                      <span className="font-display text-4xl font-bold leading-none" style={{ color: "rgba(10,43,78,0.08)" }}>{num}</span>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mt-1"
                        style={{ background: accent ? "rgba(201,160,61,0.12)" : "rgba(10,43,78,0.08)" }}>
                        <Icon name={icon} size={22} style={{ color: accent ? "#c9a03d" : "#0a2b4e" }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2" style={{ color: "#0a2b4e" }}>{title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(t => (
                          <span key={t} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(10,43,78,0.06)", color: "#0a2b4e" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setModalOpen(true)}
                    className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all"
                    style={{ color: "#c9a03d" }}>
                    Узнать подробнее <Icon name="ArrowRight" size={16} />
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-20 text-white" style={{ background: "linear-gradient(135deg, #061e38 0%, #0a2b4e 100%)" }}>
        <div className="max-w-6xl mx-auto px-5">
          <AnimatedSection className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Почему выбирают нас</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Наши преимущества</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "Award", title: "10+ лет опыта", desc: "Команда юристов со стажем в сфере госзакупок и тендерного права" },
              { icon: "ShieldCheck", title: "Гарантия допуска", desc: "Вернём деньги, если вас отклонят по нашей вине. Работаем на результат" },
              { icon: "DollarSign", title: "Фиксированные цены", desc: "Никаких скрытых доплат. Цена фиксируется в договоре до начала работ" },
              { icon: "TrendingUp", title: "2+ млрд контрактов", desc: "Суммарный объём успешно сопровождённых государственных контрактов" },
            ].map(({ icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl h-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(201,160,61,0.15)" }}>
                    <Icon name={icon} size={26} style={{ color: "#c9a03d" }} />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <AnimatedSection className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Процесс работы</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "#0a2b4e" }}>Как мы работаем</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
              style={{ background: "linear-gradient(90deg, #c9a03d, #0a2b4e)" }} />
            {[
              { num: "1", icon: "Search", title: "Анализ и подбор", desc: "Изучаем ваш профиль и подбираем закупки с максимальным шансом победы" },
              { num: "2", icon: "FileText", title: "Подготовка заявки", desc: "Юридическая проверка и оформление всех документов строго по требованиям" },
              { num: "3", icon: "Send", title: "Подача и защита", desc: "Подаём заявку, следим за процедурой и защищаем ваши интересы" },
              { num: "4", icon: "Trophy", title: "Победа и контракт", desc: "Фиксируем результат и сопровождаем подписание контракта до конца" },
            ].map(({ num, icon, title, desc }, i) => (
              <AnimatedSection key={num} delay={i * 0.15}>
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                      style={{ background: "linear-gradient(135deg, #0a2b4e, #0d3660)" }}>
                      <Icon name={icon} size={28} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "#c9a03d" }}>
                      {num}
                    </div>
                  </div>
                  <h3 className="font-semibold mt-4 mb-2" style={{ color: "#0a2b4e" }}>{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="py-24" id="cases">
        <div className="max-w-6xl mx-auto px-5">
          <AnimatedSection className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Реальные результаты</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "#0a2b4e" }}>Кейсы наших клиентов</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tag: "44-ФЗ", category: "Медицинское оборудование", title: "Поставка медоборудования для областной больницы", amount: "14 000 000 ₽", result: "Победа с первого участия", benefit: "Сэкономили 3 недели на подготовке", icon: "Heart" },
              { tag: "223-ФЗ", category: "IT-услуги", title: "Техническая поддержка систем ГосКорпорации", amount: "38 500 000 ₽", result: "Обжаловали незаконное отклонение", benefit: "Контракт подписан после жалобы в ФАС", icon: "Monitor" },
              { tag: "44-ФЗ", category: "Строительство", title: "Ремонт административного здания администрации", amount: "6 200 000 ₽", result: "Снижение цены конкурента на 12%", benefit: "Победа при наличии 7 участников", icon: "Building" },
            ].map(({ tag, category, title, amount, result, benefit, icon }, i) => (
              <AnimatedSection key={title} delay={i * 0.12}>
                <div className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all bg-white h-full flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(10,43,78,0.08)", color: "#0a2b4e" }}>{tag}</span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,160,61,0.12)" }}>
                        <Icon name={icon} size={18} style={{ color: "#c9a03d" }} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">{category}</div>
                    <h3 className="font-semibold mb-3 leading-snug" style={{ color: "#0a2b4e" }}>{title}</h3>
                    <div className="font-display text-3xl font-bold mb-3" style={{ color: "#c9a03d" }}>{amount}</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="CheckCircle" size={15} style={{ color: "#2e7d32" }} /> {result}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="Zap" size={15} style={{ color: "#c9a03d" }} /> {benefit}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <button onClick={() => setModalOpen(true)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                      style={{ background: "rgba(10,43,78,0.06)", color: "#0a2b4e" }}>
                      Хочу похожий результат
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 bg-gray-50" id="reviews">
        <div className="max-w-6xl mx-auto px-5">
          <AnimatedSection className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Клиенты о нас</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "#0a2b4e" }}>Отзывы</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Андрей Волков", role: "Генеральный директор", company: "ООО «СтройПоставка»", text: "Обратились после двух отклонённых заявок. Команда нашла ошибки за 2 часа, исправили — и выиграли на следующем тендере. Работаем уже год.", rating: 5 },
              { name: "Елена Соколова", role: "Коммерческий директор", company: "ЗАО «МедТехника»", text: "ФАС признала отклонение незаконным благодаря грамотной жалобе. Контракт на 14 млн получили. Рекомендую всем, кто участвует в госзакупках.", rating: 5 },
              { name: "Дмитрий Петров", role: "Учредитель", company: "ИП Петров", text: "Фиксированная цена, никаких сюрпризов. Подготовили заявку за 3 дня. Я занимался бизнесом, они — тендером. Результат — подписанный контракт.", rating: 5 },
            ].map(({ name, role, company, text, rating }, i) => (
              <AnimatedSection key={name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#c9a03d"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">«{text}»</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #0a2b4e, #0d3660)" }}>
                      {name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "#0a2b4e" }}>{name}</div>
                      <div className="text-xs text-gray-400">{role}, {company}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-5">
          <AnimatedSection className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Вопросы и ответы</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "#0a2b4e" }}>FAQ</h2>
          </AnimatedSection>
          <div className="space-y-3">
            {[
              { q: "Сколько стоит сопровождение тендера?", a: "Стоимость зависит от типа закупки и объёма работ. Базовый аудит заявки — от 5 000 ₽. Полное сопровождение тендера — от 15 000 ₽. Все цены фиксируются в договоре, скрытых доплат нет." },
              { q: "Что входит в услугу «под ключ»?", a: "Полное сопровождение включает: поиск и анализ закупок, подготовку всего пакета документов, подачу заявки через ЭТП, мониторинг процедуры, юридическое представительство и помощь в подписании контракта." },
              { q: "Сколько времени занимает подготовка заявки?", a: "Стандартная заявка готовится за 1–3 рабочих дня. При срочной необходимости — от 4 часов. Важно обращаться минимум за 5 дней до окончания срока подачи." },
              { q: "Какие штрафы могут быть при участии в тендерах?", a: "За нарушения при исполнении контракта — до 30% от стоимости. Злостные нарушители попадают в реестр недобросовестных поставщиков (РНП) на 2 года. Мы помогаем избежать таких ситуаций с самого начала." },
              { q: "Какие риски вы берёте на себя?", a: "Если ваша заявка будет отклонена по нашей вине — мы вернём оплату. Это закреплено в договоре. Опыт обжалования незаконных отклонений — наш ключевой актив." },
            ].map(({ q, a }, i) => <FAQItem key={i} question={q} answer={a} />)}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section className="py-24 text-white" style={{ background: "linear-gradient(135deg, #061e38 0%, #0a2b4e 100%)" }} id="contacts">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#c9a03d" }}>Напишите нам</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Оставьте заявку</h2>
              <p className="leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
                Расскажите о вашей задаче — проанализируем ситуацию и предложим оптимальное решение. Первая консультация бесплатно.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 917 490-57-51", href: "tel:+79174905751" },
                  { icon: "Mail", label: "Email", value: "ak4urinal@yandex.ru", href: "mailto:ak4urinal@yandex.ru" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 9:00–19:00", href: null },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,160,61,0.15)" }}>
                      <Icon name={icon} size={18} style={{ color: "#c9a03d" }} />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
                      {href ? <a href={href} className="font-semibold hover:text-gold transition-colors">{value}</a> : <div className="font-semibold">{value}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-2xl p-8">
                <ContactForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ background: "#061e38", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "#c9a03d" }}>
              <Icon name="Scale" size={15} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold text-white">ТендерПро</span>
          </div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>© 2024 ТендерПро. Все права защищены.</div>
          <div className="flex items-center gap-4">
            <button className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>Политика конфиденциальности</button>
            <div className="flex gap-2">
              {["MessageCircle", "Send"].map(ic => (
                <button key={ic} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <Icon name={ic} size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING BUTTON */}
      <div className="fixed right-5 bottom-8 z-40">
        <button onClick={() => setModalOpen(true)}
          className="group flex items-center overflow-hidden rounded-full font-semibold text-sm text-white shadow-2xl transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #c9a03d, #e2b84a)", boxShadow: "0 8px 32px rgba(201,160,61,0.4)" }}>
          <div className="w-14 h-14 flex items-center justify-center shrink-0">
            <Icon name="ClipboardCheck" size={22} className="text-white" />
          </div>
          <span className="pr-0 max-w-0 group-hover:max-w-xs group-hover:pr-5 overflow-hidden transition-all duration-300 whitespace-nowrap">
            Оценить заявку
          </span>
        </button>
      </div>
    </div>
  );
}