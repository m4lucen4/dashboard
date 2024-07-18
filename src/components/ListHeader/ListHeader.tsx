import React, { useState } from 'react'

type ListHeaderProps = {
  title: string
  buttonLabel: string
  onOpen: () => void
  onSearch: (searchTerm: string) => void
}

const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  buttonLabel,
  onOpen,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    onSearch(newSearchTerm)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="space-y-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
          >
            Limpiar
          </button>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

export default ListHeader
