import React from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const delta = 1

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push('...')
      }
    }

    // Filter duplicate consecutive ellipses
    return pages.filter((item, index) => item !== '...' || pages[index - 1] !== '...')
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-sm text-gray-700 ${className}`}
    >
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
          currentPage <= 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <FiArrowLeft size={14} />
        <span>Previous</span>
      </button>

      {/* Number Buttons */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs"
              >
                ...
              </span>
            )
          }

          const isCurrent = page === currentPage
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isCurrent
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
          currentPage >= totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <span>Next</span>
        <FiArrowRight size={14} />
      </button>
    </nav>
  )
}

export default Pagination
