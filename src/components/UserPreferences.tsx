'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface UserPreferences {
  favorites: string[]
  history: string[]
  toggleFavorite: (toolId: string) => void
  isFavorite: (toolId: string) => boolean
  addToHistory: (toolId: string) => void
  clearHistory: () => void
}

const UserPreferencesContext = createContext<UserPreferences | undefined>(undefined)

const FAVORITES_KEY = 'zutils_favorites'
const HISTORY_KEY = 'zutils_history'
const MAX_HISTORY = 10

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY)
    const storedHistory = localStorage.getItem(HISTORY_KEY)
    
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (e) {
        console.error('Failed to parse favorites:', e)
      }
    }
    
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory))
      } catch (e) {
        console.error('Failed to parse history:', e)
      }
    }
  }, [])

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (toolId: string) => favorites.includes(toolId)

  const addToHistory = (toolId: string) => {
    setHistory(prev => {
      const newHistory = [toolId, ...prev.filter(id => id !== toolId)].slice(0, MAX_HISTORY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  return (
    <UserPreferencesContext.Provider value={{
      favorites,
      history,
      toggleFavorite,
      isFavorite,
      addToHistory,
      clearHistory,
    }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}
