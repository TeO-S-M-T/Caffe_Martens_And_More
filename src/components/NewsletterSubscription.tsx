import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Send, Check, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "../i18n";

const LOCAL_TRANSLATIONS = {
  de: {
    title: "Newsletter & Event-Updates",
    description: "Melden Sie sich an, um Neuigkeiten, exklusive Rezepte, Event-Ankündigungen und wöchentliche Specials zu erhalten.",
    placeholder: "Ihre E-Mail-Adresse",
    button: "Abonnieren",
    subscribing: "Wird gesendet...",
    success: "Erfolgreich abonniert! Willkommen in der Café Martens Familie. ✨",
    errorInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  },
  pl: {
    title: "Newsletter i Nowości",
    description: "Zapisz się, aby otrzymywać informacje o koncertach, nowych strefach, menu oraz wyjątkowych promocjach.",
    placeholder: "Twój adres e-mail",
    button: "Zapisz się",
    subscribing: "Zapisywanie...",
    success: "Zapisano pomyślnie! Witamy w rodzinie Café Martens. ✨",
    errorInvalid: "Proszę podać poprawny adres e-mail.",
  },
  en: {
    title: "Newsletter & Event Updates",
    description: "Sign up to receive announcements about concerts, fresh menu additions, and special weekly offers.",
    placeholder: "Your email address",
    button: "Subscribe",
    subscribing: "Subscribing...",
    success: "Successfully subscribed! Welcome to the Café Martens family. ✨",
    errorInvalid: "Please enter a valid email address.",
  }
};

export default function NewsletterSubscription() {
  const { language } = useTranslation();
  const t = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS["de"];

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      setErrorMessage(t.errorInvalid);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Simulate backend subscription request
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="bg-[#383827]/90 border border-[#51513a] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
      {/* Visual background ambient details */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#e2e2d5]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#e2e2d5]/3 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Info Column */}
        <div className="max-w-md space-y-2 text-left">
          <div className="flex items-center gap-2 text-[#e2e2d5]">
            <div className="p-1.5 bg-[#41412e] rounded-lg border border-[#51513a]">
              <Mail size={16} />
            </div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#fdfcf7]">
              {t.title}
            </h4>
          </div>
          <p className="text-[#ecece0]/80 text-xs sm:text-sm font-light leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Input Form Column */}
        <div className="w-full md:max-w-xs shrink-0">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-green-950/40 border border-green-800/60 p-4 rounded-2xl flex items-start gap-2.5 text-left"
              >
                <div className="p-1 bg-green-900 rounded-full text-green-300 mt-0.5 shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <p className="text-xs text-green-200 leading-normal font-medium">
                  {t.success}
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                layout
                className="space-y-2"
              >
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder={t.placeholder}
                    disabled={status === "loading"}
                    className="w-full bg-[#2a2a1d] text-[#fdfcf7] placeholder-[#ecece0]/40 text-xs py-3.5 pl-4 pr-10 rounded-2xl border border-[#51513a] focus:outline-hidden focus:border-[#e2e2d5] focus:ring-1 focus:ring-[#e2e2d5] transition-all disabled:opacity-50"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || !email}
                    className="absolute right-2 p-2 bg-[#5A5A40] hover:bg-[#43432f] disabled:bg-neutral-800 text-[#fdfcf7] disabled:text-neutral-500 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    aria-label={t.button}
                  >
                    {status === "loading" ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-1.5 text-rose-300 text-[11px] text-left px-1"
                    >
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
