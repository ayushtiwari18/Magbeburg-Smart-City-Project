"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "de" | "en";

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (de: string, en: string) => string;
}

const LanguageContext = createContext<LangContextType>({
  lang: "de",
  toggle: () => {},
  t: (de) => de,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("de");
  const toggle = () => setLang((l) => (l === "de" ? "en" : "de"));
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
