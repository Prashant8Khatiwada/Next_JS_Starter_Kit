"use client"

import { useState } from "react"

interface PaginationOptions {
  initialPage?: number
  initialPageSize?: number
  total?: number
}

export function usePagination({ initialPage = 1, initialPageSize = 10, total = 0 }: PaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0

  const nextPage = () => {
    if (totalPages === 0 || page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && (totalPages === 0 || pageNumber <= totalPages)) {
      setPage(pageNumber)
    }
  }

  const changePageSize = (size: number) => {
    setPageSize(size)
    // Adjust current page if needed
    if (totalPages > 0) {
      const newTotalPages = Math.ceil(total / size)
      if (page > newTotalPages) {
        setPage(newTotalPages)
      }
    }
  }

  return {
    page,
    pageSize,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    // For API requests
    paginationParams: {
      page,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
  }
}
