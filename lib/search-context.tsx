"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'
import { Blog } from './blogs'

interface SearchContextType {
  searchQuery: string
  searchResults: Blog[]
  isLoading: boolean
  hasSearched: boolean
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  performSearch: (query: string) => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    
    try {
      const response = await fetch(`/api/blogs?search=${encodeURIComponent(query.trim())}`)
      const data = await response.json()
      
      if (response.ok) {
        setSearchResults(data.data || [])
      } else {
        console.error('Search failed:', data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
    setHasSearched(false)
    setIsLoading(false)
  }, [])

  const value: SearchContextType = {
    searchQuery,
    searchResults,
    isLoading,
    hasSearched,
    setSearchQuery,
    clearSearch,
    performSearch
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
