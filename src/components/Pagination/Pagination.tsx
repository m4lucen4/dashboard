import React from 'react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="mt-4 flex justify-between">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Anterior
      </button>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Siguiente
      </button>
    </div>
  )
}

export default Pagination
