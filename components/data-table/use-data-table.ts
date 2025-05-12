"use client"

import { useState, useCallback, useEffect } from "react"

interface UseDataTableOptions<T, F> {
  fetchData: (filters: F, page: number, pageSize: number) => Promise<{ data: T[]; total: number }>
  initialFilters?: F
  initialPage?: number
  initialPageSize?: number
  onError?: (error: Error) => void
}

export function useDataTable<T, F extends Record<string, any>>({
  fetchData,
  initialFilters = {} as F,
  initialPage = 1,
  initialPageSize = 10,
  onError,
}: UseDataTableOptions<T, F>) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [filters, setFilters] = useState<F>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Load data
  const loadData = useCallback(
    async (newPage = page, newPageSize = pageSize, newFilters = filters) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchData(newFilters, newPage, newPageSize)
        setData(result.data)
        setTotal(result.total)
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An error occurred")
        setError(error)
        if (onError) {
          onError(error)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [fetchData, page, pageSize, filters, onError],
  )

  // Load data on initial render
  useEffect(() => {
    loadData()
  }, [loadData])

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<F>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters }
        // Reset to page 1 when filters change
        setPage(1)
        loadData(1, pageSize, updated)
        return updated
      })
    },
    [loadData, pageSize],
  )

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setPage(1)
    loadData(1, pageSize, initialFilters)
  }, [initialFilters, loadData, pageSize])

  // Change page
  const changePage = useCallback(
    (newPage: number) => {
      setPage(newPage)
      loadData(newPage, pageSize, filters)
    },
    [loadData, pageSize, filters],
  )

  // Change page size
  const changePageSize = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize)
      // When changing page size, we usually want to go back to page 1
      setPage(1)
      loadData(1, newPageSize, filters)
    },
    [loadData, filters],
  )

  // Refresh data
  const refresh = useCallback(() => {
    loadData()
  }, [loadData])

  return {
    data,
    total,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    changePage,
    changePageSize,
    refresh,
    loadData,
  }
}
