import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { db, auth } from '../../firebase'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  getDoc,
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { IRequest, User } from '../../types'

interface UsersState {
  users: User[]
  createUserRequest: IRequest
  editUserRequest: IRequest
  fetchUserRequest: IRequest
}

const initialState: UsersState = {
  users: [],
  createUserRequest: { inProgress: false, messages: '', ok: false },
  editUserRequest: { inProgress: false, messages: '', ok: false },
  fetchUserRequest: { inProgress: false, messages: '', ok: false },
}

// Asynchronous thunk to create a new user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (
    {
      email,
      password,
      firstName,
      lastName,
      document,
      phone,
      phone2,
      address,
      cp,
      province,
      city,
      role,
      active,
    }: {
      email: string
      password: string
      firstName: string
      lastName: string
      document: string
      phone: number
      phone2: number
      address: string
      cp: number
      province: string
      city: string
      role: string
      active: boolean
    },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      const timestamp = Timestamp.now()

      const newUser = {
        uid: user.uid,
        email: user.email!,
        firstName,
        lastName,
        document,
        phone,
        phone2,
        address,
        cp,
        province,
        city,
        role,
        active,
        createdAt: timestamp.toDate().toISOString(),
        updatedAt: timestamp.toDate().toISOString(),
      }

      await setDoc(doc(db, 'users', user.uid), newUser)

      return { id: user.uid, ...newUser }
    } catch (error) {
      const err = error as Error
      return rejectWithValue(err.message)
    }
  }
)

// Asynchronous thunk to edit a user
export const editUser = createAsyncThunk(
  'users/editUser',
  async (
    {
      id,
      email,
      firstName,
      lastName,
      document,
      phone,
      phone2,
      address,
      cp,
      province,
      city,
      role,
      active,
    }: {
      id: string
      email: string
      firstName: string
      lastName: string
      document: string
      phone: number
      phone2: number
      address: string
      cp: number
      province: string
      city: string
      role: string
      active: boolean
    },
    { rejectWithValue }
  ) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', id))
      const existingUserData = userDoc.data()

      const updatedUser = {
        ...existingUserData,
        email,
        firstName,
        lastName,
        document,
        phone,
        phone2,
        address,
        cp,
        province,
        city,
        role,
        active,
        updatedAt: Timestamp.now().toDate().toISOString(),
      }

      await updateDoc(doc(db, 'users', id), updatedUser)

      return {
        id,
        ...updatedUser,
        createdAt: existingUserData?.createdAt?.toDate
          ? existingUserData.createdAt.toDate().toISOString()
          : existingUserData?.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    } catch (error) {
      const err = error as Error
      return rejectWithValue(err.message)
    }
  }
)

// Asynchronous thunk to fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users: User[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        users.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
        } as User)
      })

      return users
    } catch (error) {
      const err = error as Error
      return rejectWithValue(err.message)
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetCreateUserRequest: (state) => {
      state.createUserRequest = { inProgress: false, messages: '', ok: false }
    },
    resetEditUserRequest: (state) => {
      state.editUserRequest = { inProgress: false, messages: '', ok: false }
    },
  },
  extraReducers: (builder) => {
    builder
      // #region CREATE USER
      .addCase(createUser.pending, (state) => {
        state.createUserRequest = { inProgress: true, messages: '', ok: false }
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
        state.createUserRequest = { inProgress: false, messages: '', ok: true }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createUserRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
      // #region FETCH USERS
      .addCase(fetchUsers.pending, (state) => {
        state.fetchUserRequest = { inProgress: true, messages: '', ok: false }
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.fetchUserRequest = { inProgress: false, messages: '', ok: true }
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.fetchUserRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
      // #region EDIT USER
      .addCase(editUser.pending, (state) => {
        state.editUserRequest = { inProgress: true, messages: '', ok: false }
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        )
        if (index !== -1) {
          state.users[index] = action.payload
        }
        state.editUserRequest = { inProgress: false, messages: '', ok: true }
      })
      .addCase(editUser.rejected, (state, action) => {
        state.editUserRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
  },
})

export const { resetCreateUserRequest, resetEditUserRequest } =
  usersSlice.actions

export default usersSlice.reducer
