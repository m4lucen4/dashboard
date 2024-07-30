import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import {
  resetAddInventoryItemRequest,
  resetUpdateInventoryItemRequest,
} from '../../../redux/slices/inventorySlice'
import ActionButtonsForm from '../../../components/ActionButtonsForm/ActionButtonsForm'
import { InventoryItem } from '../../../types'

type InventoryFormProps = {
  onSubmit: (
    item: Omit<InventoryItem, 'id'>,
    images: File[],
    imagesToRemove?: string[],
    pdfs?: File[],
    pdfsToRemove?: string[]
  ) => void
  editingItem?: InventoryItem | null
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
  const [price, setPrice] = useState(editingItem?.price || 0)
  const [units, setUnits] = useState(editingItem ? editingItem.units : 0)
  const [breakageFee, setBreakageFee] = useState(
    editingItem ? editingItem.breakageFee : 0
  )
  const [block, setBlock] = useState(editingItem ? editingItem.block : 0)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(
    editingItem?.images || []
  )
  const [pdfs, setPdfs] = useState<File[]>([])
  const [pdfUrls, setPdfUrls] = useState<string[]>(
    editingItem?.documentation || []
  )
  const formRef = useRef<HTMLFormElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfs([...pdfs, ...Array.from(e.target.files)])
    }
  }

  const handleImageRemove = (url: string) => {
    setImageUrls(imageUrls.filter((imageUrl) => imageUrl !== url))
  }

  const handlePdfRemove = (url: string) => {
    setPdfUrls(pdfUrls.filter((pdfUrl) => pdfUrl !== url))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const timestamp = new Date().toISOString()

    if (editingItem) {
      const updatedItem: InventoryItem = {
        ...editingItem,
        title,
        description,
        price,
        units,
        breakageFee,
        block,
        images: imageUrls,
        documentation: pdfUrls,
        updatedAt: timestamp,
      }
      onSubmit(
        updatedItem,
        images,
        imageUrls.filter((url) => !editingItem.images?.includes(url)),
        pdfs,
        pdfUrls.filter((url) => !editingItem.documentation?.includes(url))
      )
    } else {
      const newItem: Omit<InventoryItem, 'id'> = {
        title,
        description,
        price,
        units,
        breakageFee,
        block,
        images: imageUrls,
        documentation: pdfUrls,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      onSubmit(newItem, images, [], pdfs)
    }
  }

  useEffect(() => {
    if (addInventoryItemRequest.ok || updateInventoryItemRequest.ok) {
      setTitle('')
      setDescription('')
      setPrice(0)
      setBreakageFee(0)
      setUnits(0)
      setBlock(0)
      setImages([])
      setImageUrls([])
      setPdfs([])
      setPdfUrls([])
      onClose()
      dispatch(resetAddInventoryItemRequest())
      dispatch(resetUpdateInventoryItemRequest())
    }
  }, [
    addInventoryItemRequest.ok,
    updateInventoryItemRequest.ok,
    dispatch,
    onClose,
  ])

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        {/* First column */}
        <div className="col-span-1 p-4">
          <div className="space-y-12">
            <div className="pb-12">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

                <div className="sm:col-span-3">
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
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
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
                      onChange={(e) => setUnits(Number(e.target.value))}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Coste de rotura
                  </label>
                  <div className="mt-2">
                    <input
                      id="breakageFee"
                      name="breakageFee"
                      type="number"
                      value={breakageFee}
                      onChange={(e) => setBreakageFee(Number(e.target.value))}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="block"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Bloqueo
                  </label>
                  <div className="mt-2">
                    <input
                      id="block"
                      name="block"
                      type="number"
                      value={block}
                      onChange={(e) => setBlock(Number(e.target.value))}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Second column */}
        <div className="col-span-1 p-4">
          <div className="space-y-6">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Imágenes
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`image-${index}`}
                    className="h-50 w-50 rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 rounded-full bg-red-600 p-1 text-white"
                    onClick={() => handleImageRemove(url)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-6">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Documentos PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handlePdfChange}
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-4">
              {pdfUrls.map((url, index) => (
                <div key={index} className="relative">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-blue-500 underline"
                  >
                    PDF {index + 1}
                  </a>
                  <button
                    type="button"
                    className="absolute right-0 top-0 rounded-full bg-red-600 p-1 text-white"
                    onClick={() => handlePdfRemove(url)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ActionButtonsForm onClose={onClose} />
    </form>
  )
}

export default InventoryForm
