import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../redux/store'
import { User } from '../../types'
import { AppDispatch } from '@/redux/store'
import { updateCurrentUser } from '@/redux/slices/authSlice'
import Alert from '@/components/Alert/Alert'
import Modal from '@/components/Modal/Modal'
import ProfileForm from './components/ProfileForm'

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { t, i18n } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { currentUser, updateUserRequest } = useSelector(
    (state: RootState) => ({
      currentUser: state.auth.currentUser as User,
      updateUserRequest: state.auth.updateUserRequest,
    })
  )

  const [formData, setFormData] = useState<User>({ ...currentUser })
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: name.includes('phone') ? parseInt(value) : value,
    }))

    if (name === 'language') {
      i18n.changeLanguage(value)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setFormData({ ...currentUser })
    setIsEditing(false)
  }

  const handleConfirmEdit = () => {
    setShowModal(true)
  }

  const handleModalConfirm = () => {
    dispatch(updateCurrentUser(formData))
    setIsEditing(false)
    setShowModal(false)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <div className="mx-auto mb-8 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      {updateUserRequest.messages.length > 0 && (
        <Alert message={updateUserRequest.messages} />
      )}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-6 py-8">
          <h3 className="text-2xl font-medium text-gray-900">
            {t('profile.title')}
          </h3>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6">
            <ProfileForm
              formData={formData}
              isEditing={isEditing}
              handleChange={handleChange}
            />
            <div className="mt-8">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {t('edit')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleConfirmEdit}
                    className="mr-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {t('save')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    {t('cancel')}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
      <Modal
        confirmButton={t('save')}
        description={t('profile.confirmEditDescription')}
        title={t('profile.confirmEditTitle')}
        isOpen={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  )
}

export default Profile
