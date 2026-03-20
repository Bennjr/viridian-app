import { useState, useEffect } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'default');

    useEffect(() => {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    return { theme, setTheme };
}