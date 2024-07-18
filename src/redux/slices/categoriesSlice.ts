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
import { Category, Subcategory, IRequest } from '../../types'

interface CategoryState {
  categories: Category[]
  subcategories: Subcategory[]
  fetchCategoriesRequest: IRequest
  addCategoryRequest: IRequest
  updateCategoryRequest: IRequest
  deleteCategoryRequest: IRequest
  fetchSubcategoriesRequest: IRequest
  addSubcategoryRequest: IRequest
  updateSubcategoryRequest: IRequest
  deleteSubcategoryRequest: IRequest
}

const initialState: CategoryState = {
  categories: [],
  subcategories: [],
  fetchCategoriesRequest: { inProgress: false, messages: '', ok: false },
  addCategoryRequest: { inProgress: false, messages: '', ok: false },
  updateCategoryRequest: { inProgress: false, messages: '', ok: false },
  deleteCategoryRequest: { inProgress: false, messages: '', ok: false },
  fetchSubcategoriesRequest: { inProgress: false, messages: '', ok: false },
  addSubcategoryRequest: { inProgress: false, messages: '', ok: false },
  updateSubcategoryRequest: { inProgress: false, messages: '', ok: false },
  deleteSubcategoryRequest: { inProgress: false, messages: '', ok: false },
}

// #region Async thunks for CRUD operations on Categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Category[]
  }
)

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (newCategory: Omit<Category, 'id'>) => {
    const docRef = await addDoc(collection(db, 'categories'), newCategory)
    return { ...newCategory, id: docRef.id }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (updatedCategory: Category) => {
    const { id, ...categoryData } = updatedCategory
    const categoryDoc = doc(db, 'categories', id)
    await updateDoc(categoryDoc, categoryData)
    return updatedCategory
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string) => {
    const categoryDoc = doc(db, 'categories', id)
    await deleteDoc(categoryDoc)
    return id
  }
)

// #region Async thunks for CRUD operations on Subcategories
export const fetchSubcategories = createAsyncThunk(
  'categories/fetchSubcategories',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'subcategories'))
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Subcategory[]
  }
)

export const addSubcategory = createAsyncThunk(
  'categories/addSubcategory',
  async (newSubcategory: Omit<Subcategory, 'id'>) => {
    const docRef = await addDoc(collection(db, 'subcategories'), newSubcategory)
    return { ...newSubcategory, id: docRef.id }
  }
)

export const updateSubcategory = createAsyncThunk(
  'categories/updateSubcategory',
  async (updatedSubcategory: Subcategory) => {
    const { id, ...subcategoryData } = updatedSubcategory
    const subcategoryDoc = doc(db, 'subcategories', id)
    await updateDoc(subcategoryDoc, subcategoryData)
    return updatedSubcategory
  }
)

export const deleteSubcategory = createAsyncThunk(
  'categories/deleteSubcategory',
  async (id: string) => {
    const subcategoryDoc = doc(db, 'subcategories', id)
    await deleteDoc(subcategoryDoc)
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
    resetAddSubcategoryRequest: (state) => {
      state.addSubcategoryRequest = {
        inProgress: false,
        messages: '',
        ok: false,
      }
    },
    resetUpdateSubcategoryRequest: (state) => {
      state.updateSubcategoryRequest = {
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
        (state, action: PayloadAction<Category[]>) => {
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
        (state, action: PayloadAction<Category>) => {
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
        (state, action: PayloadAction<Category>) => {
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
      // #region FETCH SUBCATEGORIES
      .addCase(fetchSubcategories.pending, (state) => {
        state.fetchSubcategoriesRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        fetchSubcategories.fulfilled,
        (state, action: PayloadAction<Subcategory[]>) => {
          state.subcategories = action.payload
          state.fetchSubcategoriesRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.fetchSubcategoriesRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region ADD SUBCATEGORY
      .addCase(addSubcategory.pending, (state) => {
        state.addSubcategoryRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        addSubcategory.fulfilled,
        (state, action: PayloadAction<Subcategory>) => {
          state.subcategories.push(action.payload)
          state.addSubcategoryRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(addSubcategory.rejected, (state, action) => {
        state.addSubcategoryRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region UPDATE SUBCATEGORY
      .addCase(updateSubcategory.pending, (state) => {
        state.updateSubcategoryRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        updateSubcategory.fulfilled,
        (state, action: PayloadAction<Subcategory>) => {
          const index = state.subcategories.findIndex(
            (subcategory) => subcategory.id === action.payload.id
          )
          if (index !== -1) {
            state.subcategories[index] = action.payload
          }
          state.updateSubcategoryRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.updateSubcategoryRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
      // #region DELETE SUBCATEGORY
      .addCase(deleteSubcategory.pending, (state) => {
        state.deleteSubcategoryRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(deleteSubcategory.fulfilled, (state, action: PayloadAction) => {
        state.deleteSubcategoryRequest = {
          inProgress: false,
          messages: '',
          ok: true,
        }
        state.subcategories = state.subcategories.filter(
          (subcategory) => subcategory.id !== action.payload
        )
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.deleteSubcategoryRequest = {
          inProgress: false,
          messages: action.error.message || '',
          ok: false,
        }
      })
  },
})

export const {
  resetAddCategoryRequest,
  resetUpdateCategoryRequest,
  resetAddSubcategoryRequest,
  resetUpdateSubcategoryRequest,
} = categoriesSlice.actions

export default categoriesSlice.reducer
