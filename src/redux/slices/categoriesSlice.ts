import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { CategoryItem, IRequest } from '@/types'

interface CategoryState {
  categories: CategoryItem[]
  fetchCategoriesRequest: IRequest
  addCategoryRequest: IRequest
  updateCategoryRequest: IRequest
  deleteCategoryRequest: IRequest
}

const initialState: CategoryState = {
  categories: [],
  fetchCategoriesRequest: { inProgress: false, messages: '', ok: false },
  addCategoryRequest: { inProgress: false, messages: '', ok: false },
  updateCategoryRequest: { inProgress: false, messages: '', ok: false },
  deleteCategoryRequest: { inProgress: false, messages: '', ok: false },
}

// #region Async thunks for CRUD operations on Categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CategoryItem[]
  }
)

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: Omit<CategoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString()
    const docRef = await addDoc(collection(db, 'categories'), {
      ...category,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    return {
      id: docRef.id,
      ...category,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category: CategoryItem) => {
    const { id, ...data } = category
    const timestamp = new Date().toISOString()
    await updateDoc(doc(db, 'categories', id), {
      ...data,
      updatedAt: timestamp,
    })
    return { ...category, updatedAt: timestamp }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string) => {
    await deleteDoc(doc(db, 'categories', id))
    return id
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetAddCategoryRequest: (state) => {
      state.addCategoryRequest = { inProgress: false, messages: '', ok: false }
    },
    resetUpdateCategoryRequest: (state) => {
      state.updateCategoryRequest = {
        inProgress: false,
        messages: '',
        ok: false,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // #region FETCH CATEGORIES
      .addCase(fetchCategories.pending, (state) => {
        state.fetchCategoriesRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<CategoryItem[]>) => {
          state.categories = action.payload
          state.fetchCategoriesRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.fetchCategoriesRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region ADD CATEGORY
      .addCase(addCategory.pending, (state) => {
        state.addCategoryRequest = { inProgress: true, messages: '', ok: false }
      })
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<CategoryItem>) => {
          state.categories.push(action.payload)
          state.addCategoryRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(addCategory.rejected, (state, action) => {
        state.addCategoryRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region UPDATE CATEGORY
      .addCase(updateCategory.pending, (state) => {
        state.updateCategoryRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<CategoryItem>) => {
          const index = state.categories.findIndex(
            (category) => category.id === action.payload.id
          )
          if (index !== -1) {
            state.categories[index] = action.payload
          }
          state.updateCategoryRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateCategoryRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region DELETE CATEGORY
      .addCase(deleteCategory.pending, (state) => {
        state.deleteCategoryRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteCategoryRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
          state.categories = state.categories.filter(
            (category) => category.id !== action.payload
          )
        }
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteCategoryRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
  },
})

export const { resetAddCategoryRequest, resetUpdateCategoryRequest } =
  categoriesSlice.actions

export default categoriesSlice.reducer
