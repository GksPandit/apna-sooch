import React from "react";
import { Youtube, MessageSquare, Instagram, ExternalLink } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface FooterProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export default function Footer({ onTabChange, activeTab }: FooterProps) {
  const quickLinks = [
    { id: "home", label: "होम (Home)" },
    { id: "videos", label: "वीडियोस (Videos)" },
    { id: "shorts", label: "शॉर्ट्स (Shorts)" },
    { id: "gita", label: "दैनिक गीता (Daily Gita)" },
  ];

  const helperLinks = [
    { id: "about", label: "परिचय (About)" },
    { id: "contact", label: "संपर्क (Contact)" },
    { id: "community", label: "समुदाय (Community)" },
    { id: "bookmarks", label: "सुरक्षित वीडियोस (Saved)" },
  ];

  return (
    <footer 
      className="bg-[#161616] border-t border-white/5 mt-16 py-12 px-6 sm:px-8 md:px-12 relative overflow-hidden"
      id="brand-footer"
    >
      {/* Decorative Golden Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand Information Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" animate={true} />
            <div>
              <h4 className="text-base font-bold tracking-[0.1em] text-white">APNA SOOCH</h4>
              <span className="text-[10px] text-[#D4AF37] tracking-[0.2em] font-medium uppercase block leading-none">@apnasooch</span>
            </div>
          </div>
          <p className="text-[#bdbdbd] text-xs leading-relaxed">
            सत्य, सनातन धर्म और भगवद्गीता के विज्ञान को समर्पित भारत का अग्रणी आध्यात्मिक समुदाय।
          </p>
          <div className="text-xs text-[#D4AF37] font-semibold space-y-1.5 pt-1">
            <p className="flex items-center gap-1.5">🚩 <span className="tracking-wide">धर्मो रक्षति रक्षितः</span></p>
            <p className="flex items-center gap-1.5">✨ <span className="tracking-wide">वसुधैव कुटुम्बकम्</span></p>
            <p className="flex items-center gap-1.5">❤️ <span className="tracking-wide">जय श्री कृष्ण</span></p>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">त्वरित लिंक्स (Quick Links)</h5>
          <ul className="space-y-2.5 text-xs text-[#bdbdbd]">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <button 
                  onClick={() => onTabChange(link.id)} 
                  className={`text-left hover:text-[#D4AF37] transition-all clickable ${activeTab === link.id ? "text-[#D4AF37] font-bold" : ""}`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Helper Links Column */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">सहायक लिंक्स (Info)</h5>
          <ul className="space-y-2.5 text-xs text-[#bdbdbd]">
            {helperLinks.map((link) => (
              <li key={link.id}>
                <button 
                  onClick={() => onTabChange(link.id)} 
                  className={`text-left hover:text-[#D4AF37] transition-all clickable ${activeTab === link.id ? "text-[#D4AF37] font-bold" : ""}`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Connections Column */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">सोशल मीडिया (Socials)</h5>
          <div className="flex flex-col gap-2">
            <a 
              href="https://youtube.com/@apnasooch" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-2.5 bg-[#090909] hover:bg-[#FF0000] hover:text-white rounded-xl text-xs text-[#bdbdbd] transition-all group"
            >
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 fill-current text-current" /> 
                <span>YouTube Channel</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://youtube.com/@apnasooch/community" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-2.5 bg-[#090909] hover:bg-[#FF0000] hover:text-white rounded-xl text-xs text-[#bdbdbd] transition-all group"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> 
                <span>Community Tab</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://whatsapp.com/channel/0029VbBFNgA89inZldFAjK1c" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-2.5 bg-[#090909] hover:bg-green-600 hover:text-white rounded-xl text-xs text-[#bdbdbd] transition-all group"
            >
              <div className="flex items-center gap-2">
                <span>📱 WhatsApp Channel</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://instagram.com/brahmcharya_gks" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-2.5 bg-[#090909] hover:bg-pink-600 hover:text-white rounded-xl text-xs text-[#bdbdbd] transition-all group"
            >
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4" /> 
                <span>Instagram Page</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center text-[#bdbdbd] text-[11px] font-mono">
        <p>© 2026 Apna Sooch. All Rights Reserved.</p>
        <p>Designed with ❤️ for Sanatan Dharma</p>
      </div>
    </footer>
  );
}
