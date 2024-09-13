import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth, db } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { IRequest, CurrentUser } from '@/types'

interface AuthState {
  authenticated: boolean
  currentUser: CurrentUser | null
  token: string | null
  loginUserRequest: IRequest
  updateUserRequest: IRequest
}

const initialState: AuthState = {
  authenticated: false,
  currentUser: null,
  token: null,
  loginUserRequest: { inProgress: false, messages: '', ok: false },
  updateUserRequest: { inProgress: false, messages: '', ok: false },
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      )
      const user = userCredential.user

      const token = await user.getIdToken()
      const userDoc = await getDoc(doc(db, 'users', user.uid))

      if (!userDoc.exists()) {
        throw new Error('User data not found in Firestore')
      }

      const userData = userDoc.data()

      if (!userData.active) {
        throw new Error('User account is not active')
      }

      // Convert Timestamp to string
      const currentUser = {
        ...userData,
        uid: user.uid,
        createdAt: userData.createdAt?.toDate
          ? userData.createdAt.toDate().toISOString()
          : userData.createdAt,
        updatedAt: userData.updatedAt?.toDate
          ? userData.updatedAt.toDate().toISOString()
          : userData.updatedAt,
      }

      return { currentUser, token }
    } catch (error) {
      const err = error as Error
      return rejectWithValue(err.message)
    }
  }
)

export const updateCurrentUser = createAsyncThunk(
  'auth/updateCurrentUser',
  async (userData: Partial<CurrentUser>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const { currentUser } = state.auth

      if (!currentUser) {
        throw new Error('No hay usuario autenticado')
      }

      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, userData)

      return { ...currentUser, ...userData }
    } catch (error) {
      const err = error as Error
      return rejectWithValue(err.message)
    }
  }
)

export const checkCurrentUser = createAsyncThunk(
  'auth/checkCurrentUser',
  async (_, { rejectWithValue }) => {
    const user = auth.currentUser
    if (!user) {
      return rejectWithValue('No user is currently authenticated')
    }

    try {
      const token = await user.getIdToken()
      const userDoc = await getDoc(doc(db, 'users', user.uid))

      if (!userDoc.exists()) {
        throw new Error('User data not found in Firestore')
      }

      const userData = userDoc.data()

      // Convert Timestamp to string
      const currentUser = {
        ...userData,
        uid: user.uid,
        createdAt: userData.createdAt?.toDate
          ? userData.createdAt.toDate().toISOString()
          : userData.createdAt,
        updatedAt: userData.updatedAt?.toDate
          ? userData.updatedAt.toDate().toISOString()
          : userData.updatedAt,
        token,
      }

      return currentUser
    } catch (error) {
      const err = error as Error
      return rejectWithValue(err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.authenticated = false
      state.currentUser = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = { inProgress: true, messages: '', ok: false }
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authenticated = true
        state.currentUser = action.payload.currentUser
        state.token = action.payload.token
        state.loginUserRequest = { inProgress: false, messages: '', ok: true }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authenticated = false
        state.currentUser = null
        state.token = null
        state.loginUserRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.updateUserRequest = { inProgress: true, messages: '', ok: false }
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload
        state.updateUserRequest = { inProgress: false, messages: '', ok: true }
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.updateUserRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.authenticated = true
        state.currentUser = action.payload
      })
      .addCase(checkCurrentUser.rejected, (state) => {
        state.authenticated = false
        state.currentUser = null
        state.token = null
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
