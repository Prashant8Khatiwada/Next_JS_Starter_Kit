"use client"

import { useState, useCallback } from "react"

interface FilterOptions<T> {
  initialFilters?: Partial<T>
  onFilterChange?: (filters: Partial<T>) => void
}

export function useFilters<T extends Record<string, any>>({
  initialFilters = {} as Partial<T>,
  onFilterChange,
}: FilterOptions<T> = {}) {
  const [filters, setFilters] = useState<Partial<T>>(initialFilters)

  // Update a single filter
  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value }

        // Call the onChange callback if provided
        if (onFilterChange) {
          onFilterChange(newFilters)
        }

        return newFilters
      })
    },
    [onFilterChange],
  )

  // Update multiple filters at once
  const updateFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFilters((prev) => {
        const updatedFilters = { ...prev, ...newFilters }

        // Call the onChange callback if provided
        if (onFilterChange) {
          onFilterChange(updatedFilters)
        }

        return updatedFilters
      })
    },
    [onFilterChange],
  )

  // Reset filters to initial state or empty
  const resetFilters = useCallback(() => {
    setFilters(initialFilters)

    // Call the onChange callback if provided
    if (onFilterChange) {
      onFilterChange(initialFilters)
    }
  }, [initialFilters, onFilterChange])

  // Remove a specific filter
  const removeFilter = useCallback(
    <K extends keyof T>(key: K) => {
      setFilters((prev) => {
        const newFilters = { ...prev }
        delete newFilters[key]

        // Call the onChange callback if provided
        if (onFilterChange) {
          onFilterChange(newFilters)
        }

        return newFilters
      })
    },
    [onFilterChange],
  )

  // Convert filters to query params for API requests
  const getQueryParams = useCallback(() => {
    return Object.entries(filters).reduce(
      (params, [key, value]) => {
        // Skip null, undefined, or empty string values
        if (value === null || value === undefined || value === "") {
          return params
        }

        // Handle arrays
        if (Array.isArray(value)) {
          if (value.length === 0) return params
          return { ...params, [key]: value.join(",") }
        }

        // Handle objects (convert to JSON string)
        if (typeof value === "object") {
          return { ...params, [key]: JSON.stringify(value) }
        }

        return { ...params, [key]: value }
      },
      {} as Record<string, string | number | boolean>,
    )
  }, [filters])

  return {
    filters,
    setFilter,
    updateFilters,
    resetFilters,
    removeFilter,
    getQueryParams,
  }
}
