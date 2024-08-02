import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { InventoryItem, IRequest } from '../../types'
import {
  uploadImages,
  deleteImages,
  uploadPDF,
  deletePDF,
} from '../../helpers/uploadStorage'

interface InventoryState {
  items: InventoryItem[]
  fetchInventoryRequest: IRequest
  addInventoryItemRequest: IRequest
  updateInventoryItemRequest: IRequest
  deleteInventoryItemRequest: IRequest
}

const initialState: InventoryState = {
  items: [],
  fetchInventoryRequest: { inProgress: false, messages: '', ok: false },
  addInventoryItemRequest: { inProgress: false, messages: '', ok: false },
  updateInventoryItemRequest: { inProgress: false, messages: '', ok: false },
  deleteInventoryItemRequest: { inProgress: false, messages: '', ok: false },
}

// #region Async thunks for CRUD operations on Categories
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'inventory'))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InventoryItem[]
  }
)

export const addInventoryItem = createAsyncThunk(
  'inventory/addInventoryItem',
  async ({
    item,
    images,
    pdfs,
  }: {
    item: Omit<
      InventoryItem,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'images'
      | 'documentation'
      | 'specialPrice'
    >
    images: File[]
    pdfs: File[]
  }) => {
    const timestamp = new Date().toISOString()
    const docRef = await addDoc(collection(db, 'inventory'), {
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
      images: [],
      documentation: [],
      specialPrice: [],
    })
    const imageUrls = await uploadImages(images, docRef.id)
    const pdfUrls = await uploadPDF(pdfs, docRef.id)
    await updateDoc(docRef, {
      images: imageUrls,
      documentation: pdfUrls,
    })
    return {
      id: docRef.id,
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
      images: imageUrls,
      documentation: pdfUrls,
      specialPrice: [],
    }
  }
)

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateInventoryItem',
  async ({
    item,
    newImages,
    imagesToRemove,
    newPDFs,
    pdfsToRemove,
  }: {
    item: InventoryItem
    newImages: File[]
    imagesToRemove: string[]
    newPDFs: File[]
    pdfsToRemove: string[]
  }) => {
    const { id, images, documentation, specialPrice, ...data } = item
    const timestamp = new Date().toISOString()

    await deleteImages(imagesToRemove)
    await deletePDF(pdfsToRemove)
    const newImageUrls = await uploadImages(newImages, id)
    const newPDFUrls = await uploadPDF(newPDFs, id)
    const updatedImages = [
      ...(images || []).filter((url) => !imagesToRemove.includes(url)),
      ...newImageUrls,
    ]
    const updatedPDFs = [
      ...(documentation || []).filter((url) => !pdfsToRemove.includes(url)),
      ...newPDFUrls,
    ]

    await updateDoc(doc(db, 'inventory', id), {
      ...data,
      updatedAt: timestamp,
      images: updatedImages,
      documentation: updatedPDFs,
      specialPrice: specialPrice || [],
    })
    return {
      ...item,
      updatedAt: timestamp,
      images: updatedImages,
      documentation: updatedPDFs,
      specialPrice: specialPrice || [],
    }
  }
)

export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteInventoryItem',
  async ({
    id,
    imageUrls,
    pdfUrls,
  }: {
    id: string
    imageUrls: string[]
    pdfUrls: string[]
  }) => {
    await deleteDoc(doc(db, 'inventory', id))
    await deleteImages(imageUrls)
    await deletePDF(pdfUrls)
    return id
  }
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    resetAddInventoryItemRequest: (state) => {
      state.addInventoryItemRequest = {
        inProgress: false,
        messages: '',
        ok: false,
      }
    },
    resetUpdateInventoryItemRequest: (state) => {
      state.updateInventoryItemRequest = {
        inProgress: false,
        messages: '',
        ok: false,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // #region FETCH INVENTORY
      .addCase(fetchInventory.pending, (state) => {
        state.fetchInventoryRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        fetchInventory.fulfilled,
        (state, action: PayloadAction<InventoryItem[]>) => {
          state.items = action.payload
          state.fetchInventoryRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(fetchInventory.rejected, (state, action) => {
        state.fetchInventoryRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region ADD CATEGORY
      .addCase(addInventoryItem.pending, (state) => {
        state.addInventoryItemRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        addInventoryItem.fulfilled,
        (state, action: PayloadAction<InventoryItem>) => {
          state.items.push(action.payload)
          state.addInventoryItemRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.addInventoryItemRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region UPDATE CATEGORY
      .addCase(updateInventoryItem.pending, (state) => {
        state.updateInventoryItemRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        updateInventoryItem.fulfilled,
        (state, action: PayloadAction<InventoryItem>) => {
          const index = state.items.findIndex(
            (item) => item.id === action.payload.id
          )
          if (index !== -1) {
            state.items[index] = action.payload
          }
          state.updateInventoryItemRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.updateInventoryItemRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region DELETE CATEGORY
      .addCase(deleteInventoryItem.pending, (state) => {
        state.deleteInventoryItemRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        deleteInventoryItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteInventoryItemRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
          state.items = state.items.filter((item) => item.id !== action.payload)
        }
      )
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.deleteInventoryItemRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
  },
})

export const { resetAddInventoryItemRequest, resetUpdateInventoryItemRequest } =
  inventorySlice.actions

export default inventorySlice.reducer
