import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import {
  resetAddInventoryItemRequest,
  resetUpdateInventoryItemRequest,
} from '../../../redux/slices/inventorySlice'

type InventoryFormProps = {
  onSubmit: (item: {
    id?: string
    title: string
    description: string
    price: string
    units: string
    newImages: File[]
    images: string[]
  }) => void
  editingItem?: {
    id: string
    title: string
    description: string
    price: string
    units: string
    images: string[]
  } | null
  onClose: () => void
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  onSubmit,
  editingItem,
  onClose,
}) => {
  const dispatch = useDispatch()
  const { addInventoryItemRequest, updateInventoryItemRequest } = useSelector(
    (state: RootState) => state.inventory
  )
  const [title, setTitle] = useState(editingItem?.title || '')
  const [description, setDescription] = useState(editingItem?.description || '')
  const [price, setPrice] = useState(editingItem?.price || '')
  const [units, setUnits] = useState(editingItem ? editingItem.units : '')
  const [newImages, setNewImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(
    editingItem?.images || []
  )

  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const item = {
      title,
      description,
      price,
      newImages,
      images: existingImages,
      units,
    }
    if (editingItem) {
      onSubmit({ ...item, id: editingItem.id })
    } else {
      onSubmit(item)
    }
  }
  useEffect(() => {
    if (addInventoryItemRequest.ok) {
      setTitle('')
      setDescription('')
      setPrice('')
      setNewImages([])
      setExistingImages([])
      onClose()
      dispatch(resetAddInventoryItemRequest())
    }
  }, [addInventoryItemRequest.ok, dispatch, onClose])

  useEffect(() => {
    if (updateInventoryItemRequest.ok) {
      setTitle('')
      setDescription('')
      setPrice('')
      setNewImages([])
      setExistingImages([])
      onClose()
      dispatch(resetUpdateInventoryItemRequest())
    }
  }, [updateInventoryItemRequest.ok, dispatch, onClose])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)])
    }
  }

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Complete the information to add or edit an inventory item.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nombre
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Descripción
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Precio
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="units"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Unidades
              </label>
              <div className="mt-2">
                <input
                  id="units"
                  name="units"
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="existing-images"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Imágenes existentes
              </label>
              <div className="mt-2 flex flex-wrap gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Existing Preview ${index}`}
                      className="h-24 w-24 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute right-0 top-0 rounded-full bg-red-600 p-1 text-white"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="new-images"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nuevas imágenes
              </label>
              <input
                id="new-images"
                name="new-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="mt-2 flex flex-wrap gap-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Preview ${index}`}
                      className="h-24 w-24 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute right-0 top-0 rounded-full bg-red-600 p-1 text-white"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Guardar
        </button>
      </div>
    </form>
  )
}

export default InventoryForm
