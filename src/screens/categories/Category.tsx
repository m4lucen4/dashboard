import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../redux/store'
import Drawer from '../../components/Drawer/Drawer'
import Alert from '../../components/Alert/Alert'
import { addCategory, updateCategory } from '../../redux/slices/categoriesSlice'
import { CategoryItem } from '../../types'
import Loading from '../../components/Loading/Loading'
import CategoryList from './components/CategoryList'
import { fetchCategories } from '../../redux/slices/categoriesSlice'
import CategoryForm from './components/CategoryForm'
import ListHeader from '../../components/ListHeader/ListHeader'

const Category: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const {
    categories,
    addCategoryRequest,
    updateCategoryRequest,
    fetchCategoriesRequest,
  } = useSelector((state: RootState) => state.category)

  const [open, setOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleCreateItem = (category: CategoryItem) => {
    dispatch(addCategory(category))
  }

  const handleEditItem = (category: CategoryItem) => {
    dispatch(updateCategory(category))
  }

  const handleOpenEditForm = (category: CategoryItem) => {
    setEditingCategory(category)
    setOpen(true)
  }

  const handleCloseDrawer = () => {
    setOpen(false)
    setEditingCategory(null)
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
        updateCategoryRequest.messages.length > 0) && (
        <Alert
          message={
            addCategoryRequest.messages || updateCategoryRequest.messages
          }
        />
      )}
      <ListHeader
        title="Categorías"
        buttonLabel="Añadir categoría"
        onOpen={() => setOpen(true)}
        onSearch={setSearchTerm}
      />
      <CategoryList categories={filteredItems} onEdit={handleOpenEditForm} />
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
    </div>
  )
}

export default Category
