import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState, AppDispatch } from '../../redux/store'
import Drawer from '../../components/Drawer/Drawer'
import Alert from '../../components/Alert/Alert'
import {
  addInventoryItem,
  deleteInventoryItem,
  fetchInventory,
  updateInventoryItem,
} from '../../redux/slices/inventorySlice'
import InventoryList from './components/InventoryList'
import { InventoryItem } from '../../types'
import InventoryForm from './components/InventoryForm'
import Loading from '../../components/Loading/Loading'
import ListHeader from '../../components/ListHeader/ListHeader'
import Modal from '../../components/Modal/Modal'
import { fetchCategories } from '../../redux/slices/categoriesSlice'

const Inventory: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()
  const {
    items,
    addInventoryItemRequest,
    updateInventoryItemRequest,
    deleteInventoryItemRequest,
    fetchInventoryRequest,
  } = useSelector((state: RootState) => state.inventory)

  const { categories } = useSelector((state: RootState) => state.category)

  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchInventory())
    dispatch(fetchCategories())
  }, [dispatch])

  const handleCreateItem = (
    item: Omit<InventoryItem, 'id'>,
    images: File[],
    pdfs: File[]
  ) => {
    dispatch(addInventoryItem({ item, images, pdfs }))
  }

  const handleEditItem = (
    item: InventoryItem,
    images: File[],
    imagesToRemove: string[],
    pdfs: File[],
    pdfsToRemove: string[]
  ) => {
    dispatch(
      updateInventoryItem({
        item,
        newImages: images,
        imagesToRemove,
        newPDFs: pdfs,
        pdfsToRemove,
      })
    )
  }

  const handleSubmit = (
    item: Omit<InventoryItem, 'id'> | InventoryItem,
    images: File[],
    imagesToRemove: string[] = [],
    pdfs: File[] = [],
    pdfsToRemove: string[] = []
  ) => {
    if ('id' in item) {
      handleEditItem(
        item as InventoryItem,
        images,
        imagesToRemove,
        pdfs,
        pdfsToRemove
      )
    } else {
      handleCreateItem(item as Omit<InventoryItem, 'id'>, images, pdfs)
    }
  }

  const handleDeleteItem = (item: InventoryItem) => {
    setItemToDelete(item)
    setIsModalOpen(true)
  }

  const confirmDeleteItem = () => {
    if (
      itemToDelete &&
      itemToDelete.id &&
      itemToDelete.images &&
      itemToDelete.documentation
    ) {
      dispatch(
        deleteInventoryItem({
          id: itemToDelete.id,
          imageUrls: itemToDelete.images,
          pdfUrls: itemToDelete.documentation,
        })
      )
    }
    setIsModalOpen(false)
    setItemToDelete(null)
  }

  const handleOpenEditForm = (item: InventoryItem) => {
    setEditingItem(item)
    setOpen(true)
  }

  const handleCloseDrawer = () => {
    setOpen(false)
    setEditingItem(null)
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])

  if (fetchInventoryRequest.inProgress) {
    return <Loading />
  }

  return (
    <div className="mx-auto mb-8 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      {(addInventoryItemRequest.messages.length > 0 ||
        updateInventoryItemRequest.messages.length > 0 ||
        deleteInventoryItemRequest.messages.length > 0) && (
        <Alert
          message={
            addInventoryItemRequest.messages ||
            updateInventoryItemRequest.messages ||
            deleteInventoryItemRequest.messages
          }
        />
      )}
      <ListHeader
        title={t('inventory')}
        buttonLabel={t('addItem')}
        onOpen={() => setOpen(true)}
        onSearch={setSearchTerm}
      />
      <InventoryList
        items={filteredItems}
        onEdit={handleOpenEditForm}
        onDelete={handleDeleteItem}
      />
      <Drawer
        open={open}
        title={editingItem ? t('editItem') : t('addItem')}
        onClose={handleCloseDrawer}
        fullScreen={true}
      >
        <InventoryForm
          categories={categories}
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onClose={handleCloseDrawer}
        />
      </Drawer>
      <Modal
        title="Confirmar eliminación"
        description={`¿Estás seguro de que deseas eliminar el artículo ${itemToDelete?.title}?`}
        confirmButton="Eliminar"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteItem}
      />
    </div>
  )
}

export default Inventory
