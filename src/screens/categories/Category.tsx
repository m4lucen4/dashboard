import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../redux/store'
import Drawer from '../../components/Drawer/Drawer'
import Alert from '../../components/Alert/Alert'
import {
  addInventoryItem,
  fetchInventory,
  updateInventoryItem,
} from '../../redux/slices/inventorySlice'
import InventoryList from './components/InventoryList'
import { InventoryItem } from '../../types'
import InventoryListHeader from './components/InventoryListHeader'
import InventoryForm from './components/InventoryForm'
import Loading from '../../components/Loading/Loading'
import CategoryList from './components/CategoryList'

const Category: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const {
    items,
    addInventoryItemRequest,
    updateInventoryItemRequest,
    fetchInventoryRequest,
  } = useSelector((state: RootState) => state.inventory)

  const [open, setOpen] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchInventory())
  }, [dispatch])

  const handleCreateItem = (item: {
    title: string
    description: string
    price: number
    units: number
    images: string[]
  }) => {
    dispatch(addInventoryItem(item))
  }

  const handleEditItem = (item: {
    id: string
    title: string
    description: string
    price: number
    units: number
    images: string[]
    newImages: File[]
  }) => {
    dispatch(updateInventoryItem(item))
  }

  const handleOpenEditForm = (item: InventoryItem) => {
    setEditingItem(item)
    setOpen(true)
  }

  const handleCloseDrawer = () => {
    setOpen(false)
    setEditingItem(null)
  }

  const handleCloseCategoriesDrawer = () => {
    setOpenCategories(false)
  }

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (fetchInventoryRequest.inProgress) {
    return <Loading />
  }

  return (
    <div className="mx-auto mb-8 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      {addInventoryItemRequest.messages.length > 0 && (
        <Alert message={addInventoryItemRequest.messages} />
      )}
      {updateInventoryItemRequest.messages.length > 0 && (
        <Alert message={updateInventoryItemRequest.messages} />
      )}
      <InventoryListHeader
        onOpen={() => setOpen(true)}
        onOpenCategories={() => setOpenCategories(true)}
        onSearch={setSearchTerm}
      />
      <InventoryList items={filteredItems} onEdit={handleOpenEditForm} />
      <Drawer
        open={open}
        title={editingItem ? 'Editar artículo' : 'Añadir artículo'}
        onClose={handleCloseDrawer}
        fullScreen={true}
      >
        <InventoryForm
          onSubmit={editingItem ? handleEditItem : handleCreateItem}
          editingItem={editingItem}
          onClose={handleCloseDrawer}
        />
      </Drawer>
      <Drawer
        open={openCategories}
        title={'Categorías'}
        onClose={handleCloseCategoriesDrawer}
        fullScreen={true}
      >
        <CategoryList />
      </Drawer>
    </div>
  )
}

export default Category
