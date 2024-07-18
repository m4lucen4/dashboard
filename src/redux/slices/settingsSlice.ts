import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { db } from '../../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { IRequest } from '../../types'

interface SettingsState {
  logoUrl: string
  title: string
  fetchSettingsRequest: IRequest
  updateSettingsRequest: IRequest
  uploadLogoRequest: IRequest
}

const initialState: SettingsState = {
  logoUrl: '',
  title: '',
  fetchSettingsRequest: { inProgress: false, messages: '', ok: false },
  updateSettingsRequest: { inProgress: false, messages: '', ok: false },
  uploadLogoRequest: { inProgress: false, messages: '', ok: false },
}

const settingsDocRef = doc(db, 'settings', 'uniqueDocId')
const storage = getStorage()
const logoStorageRef = ref(storage, 'settings/logo.png')

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async () => {
    const docSnap = await getDoc(settingsDocRef)
    if (docSnap.exists()) {
      return docSnap.data() as SettingsState
    } else {
      throw new Error('Settings document does not exist')
    }
  }
)

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Partial<SettingsState>) => {
    await setDoc(settingsDocRef, settings, { merge: true })
    return settings
  }
)

export const uploadLogo = createAsyncThunk(
  'settings/uploadLogo',
  async (file: File) => {
    await uploadBytes(logoStorageRef, file)
    const logoUrl = await getDownloadURL(logoStorageRef)
    await setDoc(settingsDocRef, { logoUrl }, { merge: true })
    return logoUrl
  }
)

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // #region FETCH SETTINGS
      .addCase(fetchSettings.pending, (state) => {
        state.fetchSettingsRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.logoUrl = action.payload.logoUrl
        state.title = action.payload.title
        state.fetchSettingsRequest = {
          inProgress: false,
          messages: '',
          ok: true,
        }
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.fetchSettingsRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
      // #region UPDATE SETTINGS
      .addCase(updateSettings.pending, (state) => {
        state.updateSettingsRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(
        updateSettings.fulfilled,
        (state, action: PayloadAction<Partial<SettingsState>>) => {
          if (action.payload.logoUrl !== undefined) {
            state.logoUrl = action.payload.logoUrl
          }
          if (action.payload.title !== undefined) {
            state.title = action.payload.title
          }
          state.updateSettingsRequest = {
            inProgress: false,
            messages: '',
            ok: true,
          }
        }
      )
      .addCase(updateSettings.rejected, (state, action) => {
        state.updateSettingsRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
      // #region UPLOAD LOGO
      .addCase(uploadLogo.pending, (state) => {
        state.uploadLogoRequest = {
          inProgress: true,
          messages: '',
          ok: false,
        }
      })
      .addCase(uploadLogo.fulfilled, (state, action: PayloadAction<string>) => {
        state.logoUrl = action.payload
        state.uploadLogoRequest = {
          inProgress: false,
          messages: '',
          ok: true,
        }
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.uploadLogoRequest = {
          inProgress: false,
          messages: action.payload as string,
          ok: false,
        }
      })
  },
})

export const {} = settingsSlice.actions

export default settingsSlice.reducer
