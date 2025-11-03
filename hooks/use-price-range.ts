import { useState, useEffect } from 'react'

export interface PriceOption {
  value: string
  label: string
}

export interface PriceRangeData {
  minPrice: number
  maxPrice: number
  roundedMinPrice: number
  roundedMaxPrice: number
  priceOptions: {
    min: PriceOption[]
    max: PriceOption[]
  }
  totalProperties: number
}

const defaultPriceRange: PriceRangeData = {
  minPrice: 0,
  maxPrice: 1,
  roundedMinPrice: 0,
  roundedMaxPrice: 1,
  priceOptions: {
    min: [
      { value: 'none', label: 'No Min' },
      { value: '500000', label: '500K' },
      { value: '1000000', label: '1M' },
      { value: '2000000', label: '2M' },
      { value: '5000000', label: '5M' },
      { value: '10000000', label: '10M' }
    ],
    max: [
      { value: 'none', label: 'No Max' },
      { value: '1000000', label: '1M' },
      { value: '2000000', label: '2M' },
      { value: '5000000', label: '5M' },
      { value: '10000000', label: '10M' },
      { value: '20000000', label: '20M+' }
    ]
  },
  totalProperties: 0
}

export function usePriceRange() {
  const [priceRange, setPriceRange] = useState<PriceRangeData>(defaultPriceRange)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/properties/price-range')
        
        if (!response.ok) {
          throw new Error('Failed to fetch price range')
        }
        
        const data = await response.json()
        setPriceRange(data)
      } catch (err) {
        console.error('Error fetching price range:', err)
        setError(err instanceof Error ? err.message : 'Failed to load price range')
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchPriceRange()
  }, [])

  return {
    priceRange,
    loading,
    error,
    refresh: () => {
      setLoading(true)
      setError(null)
      // Re-run the effect
      window.location.reload()
    }
  }
}
