import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
  resetAddCategoryRequest,
  resetUpdateCategoryRequest,
} from '@/redux/slices/categoriesSlice'
import { CategoryItem } from '@/types'
import ActionButtonsForm from '@/components/ActionButtonsForm/ActionButtonsForm'

interface CategoryFormProps {
  onSubmit: (category: CategoryItem) => void
  editingCategory?: CategoryItem | null
  onClose: () => void
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  editingCategory,
  onClose,
}) => {
  const dispatch = useDispatch()
  const { addCategoryRequest, updateCategoryRequest } = useSelector(
    (state: RootState) => state.category
  )

  const [categoryName, setCategoryName] = useState(
    editingCategory?.categoryName || ''
  )
  const [subcategoryName, setSubcategoryName] = useState(
    editingCategory?.subcategoryName || ''
  )

  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const timestamp = new Date().toISOString()

    if (editingCategory) {
      const updatedCategory: CategoryItem = {
        ...editingCategory,
        categoryName,
        subcategoryName,
        updatedAt: timestamp,
      }
      onSubmit(updatedCategory)
    } else {
      const newCategory: Omit<CategoryItem, 'id'> = {
        categoryName,
        subcategoryName,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      onSubmit(newCategory as CategoryItem)
    }
  }

  useEffect(() => {
    if (addCategoryRequest.ok || updateCategoryRequest.ok) {
      setCategoryName('')
      setSubcategoryName('')
      onClose()
      dispatch(resetAddCategoryRequest())
      dispatch(resetUpdateCategoryRequest())
    }
  }, [addCategoryRequest.ok, updateCategoryRequest.ok, dispatch, onClose])

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="category-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Categoría Principal
              </label>
              <div className="mt-2">
                <input
                  id="category-name"
                  name="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  autoComplete="given-name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="subcategory-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Subcategoría
              </label>
              <div className="mt-2">
                <input
                  id="subcategory-name"
                  name="subcategory-name"
                  type="text"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ActionButtonsForm onClose={onClose} />
    </form>
  )
}

export default CategoryForm
