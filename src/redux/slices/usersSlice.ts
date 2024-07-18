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

export const createUser = createAsyncThunk(
  'users/createUser',
  async (
    newUser: Omit<User, 'id' | 'uid' | 'createdAt' | 'updatedAt'>,
    { rejectWithValue }
  ) => {
    try {
      const { email, password } = newUser
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      const timestamp = Timestamp.now()

      const completeUser: User = {
        ...newUser,
        uid: user.uid,
        createdAt: timestamp.toDate().toISOString(),
        updatedAt: timestamp.toDate().toISOString(),
      }

      await setDoc(doc(db, 'users', user.uid), completeUser)
      return { id: user.uid, ...completeUser }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const editUser = createAsyncThunk(
  'users/editUser',
  async (updatedUser: User, { rejectWithValue }) => {
    try {
      const { id } = updatedUser
      if (!id) throw new Error('User ID is required')
      const userDoc = await getDoc(doc(db, 'users', id))
      const existingUserData = userDoc.data()

      const mergedUser: User = {
        ...(existingUserData as User),
        ...updatedUser,
        updatedAt: Timestamp.now().toDate().toISOString(),
      }

      await updateDoc(doc(db, 'users', id), mergedUser as any)

      return { id, ...mergedUser }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

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
