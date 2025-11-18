import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'system'
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      return savedTheme || 'system'
    }
    return 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    // Resolve initial theme immediately
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'system' || !savedTheme) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return savedTheme
    }
    return 'light'
  })

  useEffect(() => {
    // Apply theme to document immediately on mount and whenever it changes
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  useEffect(() => {
    // Save theme to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }

    // Resolve theme based on system preference if needed
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e) => {
          setResolvedTheme(e.matches ? 'dark' : 'light')
        }
        
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
        mediaQuery.addEventListener('change', handleChange)
        
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    // Immediately update resolved theme if not system
    if (newTheme !== 'system') {
      setResolvedTheme(newTheme)
      // Also update localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme)
        // Force apply theme
        const root = document.documentElement
        if (newTheme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }
  }

  const value = {
    theme,
    resolvedTheme,
    changeTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

