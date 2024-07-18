import React from 'react'

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
        <input
          type="text"
          placeholder="Buscar"
          onChange={(e) => onSearch(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
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
