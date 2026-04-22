import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = "no" | "en" | "es" | "de";

interface LanguageContextType {
    language: Lang;
    setLanguage: (language: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Lang>(() => {
        return (localStorage.getItem('app-language') as Lang) || 'no';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
    }, [language]);

    const value = { language, setLanguage };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}