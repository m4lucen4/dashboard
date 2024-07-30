import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from '../firebase'

// Helper function to upload images to Firebase Storage
export const uploadImages = async (
  images: File[],
  itemId: string
): Promise<string[]> => {
  const uploadPromises = images.map(async (image) => {
    const storageRef = ref(storage, `inventory/images/${itemId}/${image.name}`)
    await uploadBytes(storageRef, image)
    return getDownloadURL(storageRef)
  })
  return Promise.all(uploadPromises)
}

// Helper function to delete images from Firebase Storage
export const deleteImages = async (imageUrls: string[]) => {
  const deletePromises = imageUrls.map(async (url) => {
    const imageRef = ref(storage, url)
    await deleteObject(imageRef)
  })
  return Promise.all(deletePromises)
}

// Helper function to upload pdfs to Firebase Storage
export const uploadPDF = async (
  pdfs: File[],
  itemId: string
): Promise<string[]> => {
  const uploadPromises = pdfs.map(async (pdf) => {
    const storageRef = ref(
      storage,
      `inventory/documentation/${itemId}/${pdf.name}`
    )
    await uploadBytes(storageRef, pdf)
    return getDownloadURL(storageRef)
  })
  return Promise.all(uploadPromises)
}

// Helper function to delete pdfs from Firebase Storage
export const deletePDF = async (pdfUrls: string[]) => {
  const deletePromises = pdfUrls.map(async (url) => {
    const pdfRef = ref(storage, url)
    await deleteObject(pdfRef)
  })
  return Promise.all(deletePromises)
}
