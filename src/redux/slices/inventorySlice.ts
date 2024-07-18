import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '../../firebase'
import { InventoryItem, IRequest } from '../../types'

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

// Helper function to upload image to Firebase Storage
const uploadImage = async (file: File): Promise<string> => {
  try {
    const storage = getStorage()
    const storageRef = ref(storage, `images/${file.name}_${Date.now()}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// #region Async thunks for CRUD operations
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'inventory'))
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as InventoryItem[]
  }
)

export const addInventoryItem = createAsyncThunk(
  'inventory/addInventoryItem',
  async (newItem: Omit<InventoryItem, 'id'> & { newImages?: File[] }) => {
    try {
      const imageUrls = await Promise.all(
        newItem.newImages?.map(uploadImage) || []
      )

      const itemWithoutFiles = { ...newItem, images: imageUrls }
      delete itemWithoutFiles.newImages

      const docRef = await addDoc(collection(db, 'inventory'), itemWithoutFiles)

      return { ...itemWithoutFiles, id: docRef.id }
    } catch (error) {
      console.error('Error adding inventory item:', error)
      throw error
    }
  }
)

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateInventoryItem',
  async (updatedItem: InventoryItem & { newImages: File[] }) => {
    const { id, newImages, ...itemData } = updatedItem
    const existingImages = itemData.images || []
    const newImageUrls = await Promise.all(newImages.map(uploadImage))
    const updatedImages = [...existingImages, ...newImageUrls]

    const itemDoc = doc(db, 'inventory', id)
    await updateDoc(itemDoc, { ...itemData, images: updatedImages })
    return { ...updatedItem, images: updatedImages }
  }
)

export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteInventoryItem',
  async (id: string) => {
    const itemDoc = doc(db, 'inventory', id)
    await deleteDoc(itemDoc)
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
      // #region ADD INVENTORY ITEM
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
      // #region UPDATE INVENTORY ITEM
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
      // #region DELETE INVENTORY ITEM
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
