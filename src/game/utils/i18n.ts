// Internationalization (i18n) Support

export type Language = "en" | "es" | "ko";

export interface Translations {
  start: string;
  retry: string;
  gameOver: string;
  finalScore: string;
  score: string;
}

const translations: Record<Language, Translations> = {
  en: {
    start: "Play",
    retry: "Retry",
    gameOver: "Game Over",
    finalScore: "Final Score",
    score: "Score",
  },
  es: {
    start: "Jugar",
    retry: "Reintentar",
    gameOver: "Game Over",
    finalScore: "Puntaje Final",
    score: "Puntaje",
  },
  ko: {
    start: "시작",
    retry: "다시 시도",
    gameOver: "게임 오버",
    finalScore: "최종 점수",
    score: "점수",
  },
};

class I18n {
  private currentLanguage: Language = "es"; // Default to Spanish
  private listeners: Array<() => void> = [];

  constructor() {
    // Load saved language preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("frog-jump-language") as Language;
      if (saved && (saved === "en" || saved === "es" || saved === "ko")) {
        this.currentLanguage = saved;
      }
    }
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    if (typeof window !== "undefined") {
      localStorage.setItem("frog-jump-language", lang);
    }
    // Notify listeners
    this.listeners.forEach((listener) => listener());
  }

  t(key: keyof Translations): string {
    return translations[this.currentLanguage][key];
  }

  onLanguageChange(callback: () => void): () => void {
    this.listeners.push(callback);
    // Return cleanup function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
    return [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Español", flag: "🇪🇸" },
      { code: "ko", name: "한국어", flag: "🇰🇷" },
    ];
  }
}

export const i18n = new I18n();

