import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'default';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === 'default') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }

        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const value = { theme, setTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}