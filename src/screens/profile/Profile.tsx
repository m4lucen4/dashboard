import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../redux/store'
import { User } from '../../types'
import { AppDispatch } from '@/redux/store'
import { updateCurrentUser } from '@/redux/slices/authSlice'
import InputField from '@/components/InputField'
import SelectField from '@/components/SelectField'

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { t, i18n } = useTranslation()
  const currentUser = useSelector(
    (state: RootState) => state.auth.currentUser as User
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateCurrentUser(formData))
  }

  return (
    <div className="mx-auto mb-8 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-6 py-8">
          <h3 className="text-lg font-medium text-gray-900">
            {t('profile.title')}
          </h3>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-6 gap-6">
              <InputField
                label={t('profile.firstName')}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                label={t('profile.lastName')}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <InputField
                label={t('profile.document')}
                name="document"
                value={formData.document}
                onChange={handleChange}
              />
              <InputField
                label={t('profile.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
              <InputField
                label={t('profile.phone')}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <InputField
                label={t('profile.phone2')}
                name="phone2"
                type="tel"
                value={formData.phone2}
                onChange={handleChange}
              />
              <SelectField
                label={t('profile.language')}
                name="language"
                value={formData.language}
                onChange={handleChange}
                options={[
                  { value: 'es-ES', label: 'Español' },
                  { value: 'en-EN', label: 'English' },
                ]}
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-auto"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
