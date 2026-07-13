import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Instagram, 
  Youtube, 
  MessageSquare, 
  HelpCircle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  MessageCircle,
  Mail,
  User,
  BookOpen,
  Info
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function ContactCenter() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Quick contact links
  const contactCards = [
    {
      title: "WhatsApp Channel",
      icon: <MessageCircle className="w-6 h-6 text-[#25D366]" />,
      description: "हमारे मुख्य व्हाट्सएप चैनल से जुड़ें और महत्वपूर्ण संदेश सीधे अपने फोन पर प्राप्त करें।",
      linkText: "Join Channel",
      url: "https://whatsapp.com/channel/0029VbBFNgA89inZldFAjK1c",
      color: "hover:border-[#25D366]/30 hover:shadow-[#25D366]/10"
    },
    {
      title: "Instagram Page",
      icon: <Instagram className="w-6 h-6 text-[#E1306C]" />,
      description: "दैनिक आध्यात्मिक विचार, प्रेरक उद्धरण और लघु ज्ञानवर्धक रील्स देखने के लिए फॉलो करें।",
      linkText: "Follow Us",
      url: "https://instagram.com/brahmcharya_gks",
      color: "hover:border-[#E1306C]/30 hover:shadow-[#E1306C]/10"
    },
    {
      title: "YouTube Channel",
      icon: <Youtube className="w-6 h-6 text-[#FF0000]" />,
      description: "सत्य की खोज, गीता व्याख्यान और जीवन की कड़वी सच्चाइयों पर आधारित लंबी वीडियो देखें।",
      linkText: "Subscribe",
      url: "https://youtube.com/@apnasooch",
      color: "hover:border-[#FF0000]/30 hover:shadow-[#FF0000]/10"
    },
    {
      title: "Community Hub",
      icon: <MessageSquare className="w-6 h-6 text-[#D4AF37]" />,
      description: "समान विचारधारा वाले साधकों के विचार पढ़ने और उनसे संवाद करने के लिए हमारे समुदाय में आएं।",
      linkText: "Explore Community",
      url: "https://youtube.com/@apnasooch/community",
      color: "hover:border-[#D4AF37]/30 hover:shadow-[#D4AF37]/10"
    }
  ];

  // Expandable FAQs
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "मैं 'अपना सोच' के साथ सहयोग कैसे कर सकता हूँ?",
      answer: "यदि आप एक लेखक, वीडियो संपादक या शोधकर्ता हैं और सनातन धर्म, दर्शन या मनोविज्ञान में गहरी रुचि रखते हैं, तो आप हमारे साथ सहयोग कर सकते हैं। आप फॉर्म में सहयोग का प्रस्ताव भरकर भेजें, या सीधे हमारे इंस्टाग्राम पेज (@brahmcharya_gks) पर संदेश भेजें। हमारी टीम जल्द ही आपसे संपर्क करेगी।"
    },
    {
      id: 2,
      question: "क्या मैं किसी विशिष्ट विषय पर वीडियो बनाने का सुझाव दे सकता हूँ?",
      answer: "बिल्कुल! हम हमेशा अपने दर्शकों के सुझावों का स्वागत करते हैं। यदि आप चाहते हैं कि हम भगवद्गीता, ब्रह्मचर्य, मन के नियंत्रण या किसी सामाजिक/मनोवैज्ञानिक मुद्दे पर वीडियो बनाएं, तो आप नीचे दिए गए फॉर्म के माध्यम से अपना विषय और उससे जुड़ा विवरण हमें भेज सकते हैं।"
    },
    {
      id: 3,
      question: "मैं 'अपना सोच' टीम से सीधे संपर्क कैसे करूँ?",
      answer: "सीधे संपर्क के लिए आप नीचे दिए गए 'Send via WhatsApp' फॉर्म का उपयोग करें। जैसे ही आप इसे भरकर भेजेंगे, यह सीधे हमारी आधिकारिक टीम के व्हाट्सएप नंबर (7870735386) पर संदेश के रूप में खुल जाएगा, जिससे आपकी बात सीधे हमसे हो सकेगी।"
    },
    {
      id: 4,
      question: "क्या मेरे द्वारा भेजे गए संदेश और विवरण गोपनीय रहेंगे?",
      answer: "हाँ, आपकी निजता हमारे लिए अत्यंत महत्वपूर्ण है। आपके नाम, ईमेल और संदेश का उपयोग केवल आपके प्रश्नों का उत्तर देने और आपसे संवाद करने के लिए किया जाएगा। इसे किसी भी तीसरे पक्ष के साथ साझा नहीं किया जाता।"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("कृपया सभी क्षेत्रों को सही ढंग से भरें। (Please fill in all fields.)");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("कृपया एक वैध ईमेल पता दर्ज करें। (Please enter a valid email address.)");
      return;
    }

    // Activate redirecting animation
    setIsRedirecting(true);

    // Format WhatsApp Message
    const formattedMessage = `Name:
${formData.name}

Email:
${formData.email}

Subject:
${formData.subject}

Message:
${formData.message}`;

    const encodedText = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/7870735386?text=${encodedText}`;

    // Delay redirection for a premium feel
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsRedirecting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1800);
  };

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(prev => (prev === id ? null : id));
  };

  return (
    <div id="contact-center-page" className="space-y-16 max-w-7xl mx-auto px-4 md:px-8 py-4">
      
      {/* HEADER SECTION */}
      <div id="contact-header" className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold px-3 py-1 rounded-full border border-[#D4AF37]/20 uppercase tracking-widest"
        >
          📞 Connect With Us
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          Contact
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/60 text-sm md:text-base leading-relaxed"
        >
          Have a question, suggestion or want to connect? <br className="hidden sm:inline" /> We would love to hear from you.
        </motion.p>
      </div>

      {/* TWO COLUMNS: FORM AND QUICK CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: CONTACT FORM (GLASSMORPHISM) */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden group"
          >
            {/* Ambient Gold glow corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none transition-opacity group-hover:opacity-100" />
            
            <h3 className="text-xl font-bold text-white tracking-wide border-l-4 border-[#D4AF37] pl-3 mb-6 flex items-center gap-2">
              <span>📩 संदेश भेजें • Send Message</span>
            </h3>

            <AnimatePresence mode="wait">
              {isRedirecting ? (
                <motion.div
                  key="redirecting-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-20 space-y-5 text-center"
                >
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-[#25D366]/15 border-t-[#25D366] animate-spin" />
                    <MessageCircle className="absolute inset-0 m-auto text-[#25D366] animate-pulse" size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">Redirecting to WhatsApp...</h4>
                    <p className="text-xs text-white/50 max-w-xs mx-auto">
                      कृपया प्रतीक्षा करें। हम आपका सुरक्षित रूप से एन्कोडेड संदेश तैयार कर रहे हैं।
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
                  {/* Full Name & Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="name-input" className="text-white/40 text-[10px] font-bold uppercase tracking-wider block ml-1">
                        Full Name <span className="text-[#D4AF37]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="name-input"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="जैसे: राहुल कुमार"
                          className="w-full bg-black/40 border border-white/5 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3.5 text-xs md:text-sm text-white placeholder-white/20 outline-none transition-all"
                        />
                        <User size={14} className="absolute left-3.5 top-4 text-white/30" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email-input" className="text-white/40 text-[10px] font-bold uppercase tracking-wider block ml-1">
                        Email Address <span className="text-[#D4AF37]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="email-input"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="rahul@example.com"
                          className="w-full bg-black/40 border border-white/5 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3.5 text-xs md:text-sm text-white placeholder-white/20 outline-none transition-all"
                        />
                        <Mail size={14} className="absolute left-3.5 top-4 text-white/30" />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject-input" className="text-white/40 text-[10px] font-bold uppercase tracking-wider block ml-1">
                      Subject <span className="text-[#D4AF37]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="subject-input"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="सहयोग, सुझाव या सामान्य प्रश्न..."
                        className="w-full bg-black/40 border border-white/5 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3.5 text-xs md:text-sm text-white placeholder-white/20 outline-none transition-all"
                      />
                      <BookOpen size={14} className="absolute left-3.5 top-4 text-white/30" />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message-input" className="text-white/40 text-[10px] font-bold uppercase tracking-wider block ml-1">
                      Message <span className="text-[#D4AF37]">*</span>
                    </label>
                    <textarea
                      id="message-input"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="अपना विस्तृत संदेश यहाँ लिखें..."
                      className="w-full bg-black/40 border border-white/5 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 rounded-xl px-4 py-3.5 text-xs md:text-sm text-white placeholder-white/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Validation Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center font-medium"
                    >
                      ⚠️ {error}
                    </motion.p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-extrabold py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    <MessageCircle size={16} fill="currentColor" />
                    <span>Send via WhatsApp</span>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: QUICK CONTACT CARDS */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white tracking-wide border-l-4 border-[#D4AF37] pl-3 mb-4">
              ✨ त्वरित संपर्क • Quick Contact
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className={`bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-3 backdrop-blur-md transition-all duration-300 ${card.color}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-xl">
                        {card.icon}
                      </div>
                      <h4 className="font-bold text-white text-sm tracking-wide">
                        {card.title}
                      </h4>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-white/80 hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10"
                  >
                    <span>{card.linkText}</span>
                    <ExternalLink size={12} className="opacity-60" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* FAQ SECTION */}
      <div id="contact-faq" className="border-t border-white/5 pt-12 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-wide">💡 अक्सर पूछे जाने वाले सवाल • FAQ</h3>
          <p className="text-xs text-white/40">संवाद शुरू करने से पहले सामान्य प्रश्नों के उत्तर यहाँ जानें।</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isExpanded = expandedFAQ === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 select-none outline-none"
                >
                  <span className="font-bold text-sm md:text-base text-white/90 hover:text-white transition-colors">
                    {faq.question}
                  </span>
                  <div className="p-1.5 bg-white/5 rounded-lg text-white/60">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-white/60 leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
