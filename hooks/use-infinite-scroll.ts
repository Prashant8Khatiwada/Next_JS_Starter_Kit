"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface InfiniteScrollOptions<T> {
  fetchFn: (page: number, limit: number) => Promise<T[]>
  initialLimit?: number
  threshold?: number
}

export function useInfiniteScroll<T>({ fetchFn, initialLimit = 10, threshold = 200 }: InfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  // Function to load more items
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const newItems = await fetchFn(page, initialLimit)

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setItems((prev) => [...prev, ...newItems])
        setPage((prev) => prev + 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred while fetching data"))
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, initialLimit, loading, hasMore])

  // Setup intersection observer for infinite scrolling
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return

      if (observer.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore()
          }
        },
        {
          rootMargin: `0px 0px ${threshold}px 0px`,
        },
      )

      if (node) {
        observer.current.observe(node)
      }
    },
    [loading, hasMore, loadMore, threshold],
  )

  // Initial load
  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    items,
    loading,
    error,
    hasMore,
    lastItemRef,
    refresh: () => {
      setItems([])
      setPage(1)
      setHasMore(true)
      loadMore()
    },
  }
}
