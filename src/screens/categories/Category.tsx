import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import Drawer from '@/components/Drawer/Drawer'
import Alert from '@/components/Alert/Alert'
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from '@/redux/slices/categoriesSlice'
import { CategoryItem } from '@/types'
import Loading from '@/components/Loading/Loading'
import CategoryList from './components/CategoryList'
import { fetchCategories } from '@/redux/slices/categoriesSlice'
import CategoryForm from './components/CategoryForm'
import ListHeader from '@/components/ListHeader/ListHeader'
import { fetchInventory } from '@/redux/slices/inventorySlice'
import Modal from '@/components/Modal/Modal'

const Category: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const {
    categories,
    addCategoryRequest,
    updateCategoryRequest,
    fetchCategoriesRequest,
  } = useSelector((state: RootState) => state.category)
  const { items } = useSelector((state: RootState) => state.inventory)

  const [open, setOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchInventory())
  }, [dispatch])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleCreateItem = (category: CategoryItem) => {
    dispatch(addCategory(category))
  }

  const handleEditItem = (category: CategoryItem) => {
    dispatch(updateCategory(category))
  }

  const handleDeleteItem = (category: CategoryItem) => {
    setCategoryToDelete(category)
    setIsModalOpen(true)
  }

  const handleOpenEditForm = (category: CategoryItem) => {
    setEditingCategory(category)
    setOpen(true)
  }

  const handleCloseDrawer = () => {
    setOpen(false)
    setEditingCategory(null)
  }

  const confirmDeleteCategory = () => {
    if (categoryToDelete && categoryToDelete.id) {
      const linkedItems = items.filter(
        (item) =>
          item.category === categoryToDelete.categoryName &&
          item.subcategory === categoryToDelete.subcategoryName
      )
      if (linkedItems.length > 0) {
        setErrorMessage('Category cannot be deleted due to linked items')
        return
      }
      dispatch(deleteCategory(categoryToDelete.id))
    }
    setIsModalOpen(false)
    setCategoryToDelete(null)
  }

  const filteredItems = categories.filter(
    (category) =>
      category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (fetchCategoriesRequest.inProgress) {
    return <Loading />
  }

  return (
    <div className="mx-auto mb-8 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      {(addCategoryRequest.messages.length > 0 ||
        updateCategoryRequest.messages.length > 0 ||
        errorMessage) && (
        <Alert
          message={
            errorMessage ||
            addCategoryRequest.messages ||
            updateCategoryRequest.messages
          }
        />
      )}
      <ListHeader
        title="Categorías"
        buttonLabel="Añadir categoría"
        onOpen={() => setOpen(true)}
        onSearch={setSearchTerm}
      />
      <CategoryList
        categories={filteredItems}
        onEdit={handleOpenEditForm}
        onDelete={handleDeleteItem}
        items={items}
      />
      <Drawer
        open={open}
        title={editingCategory ? 'Editar categoría' : 'Añadir categoría'}
        onClose={handleCloseDrawer}
        fullScreen={true}
      >
        <CategoryForm
          onSubmit={editingCategory ? handleEditItem : handleCreateItem}
          editingCategory={editingCategory}
          onClose={handleCloseDrawer}
        />
      </Drawer>
      <Modal
        title="Confirmar eliminación"
        description={`¿Estás seguro de que deseas eliminar la categoría ${categoryToDelete?.categoryName}-${categoryToDelete?.subcategoryName}?`}
        confirmButton="Eliminar"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  )
}

export default Category
