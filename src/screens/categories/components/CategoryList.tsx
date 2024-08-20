import React, { useState, useEffect } from 'react'
import { CategoryItem, InventoryItem } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Pagination from '@/components/Pagination/Pagination'

type CategoriesListProps = {
  categories: CategoryItem[]
  items: InventoryItem[]
  onEdit: (category: CategoryItem) => void
  onDelete: (category: CategoryItem) => void
}

const UsersList: React.FC<CategoriesListProps> = ({
  categories,
  onEdit,
  onDelete,
  items,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentCategories, setCurrentCategories] = useState<CategoryItem[]>([])
  const categoriesPerPage = 10

  useEffect(() => {
    const indexOfLastCategory = currentPage * categoriesPerPage
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
    setCurrentCategories(
      categories.slice(indexOfFirstCategory, indexOfLastCategory)
    )
  }, [currentPage, categories])

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(categories.length / categoriesPerPage))
    )
  }

  const totalPages = Math.ceil(categories.length / categoriesPerPage)

  if (!categories) {
    return null
  }

  const getItemCountBySubcategory = (subcategoryName: string) => {
    return items.filter((item) => item.subcategory === subcategoryName).length
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-1"
                >
                  Categoría Principal
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-1"
                >
                  Subcategoría
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-1"
                >
                  Total items
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCategories.map((category) => (
                <tr key={category.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-1">
                    <div>{category.categoryName}</div>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {category.subcategoryName}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {getItemCountBySubcategory(category.subcategoryName || '')}
                  </td>
                  <td className="gap-x-2 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    <button
                      onClick={() => onEdit(category)}
                      className="mr-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <PencilIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      <TrashIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <span className="text-sm font-medium text-gray-700">
              Total registros: {categories.length}
            </span>
          </div>
          {totalPages > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default UsersList
