import React from 'react'
import { useTranslation } from 'react-i18next'
import { User } from '../../../types'
import InputField from '@/components/InputField'
import SelectField from '@/components/SelectField'

interface ProfileFormProps {
  formData: User
  isEditing: boolean
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  isEditing,
  handleChange,
}) => {
  const { t } = useTranslation()

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mt-6">
      <div className="grid grid-cols-6 gap-6">
        <InputField
          label={t('profile.firstName')}
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <InputField
          label={t('profile.lastName')}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <InputField
          label={t('profile.document')}
          name="document"
          value={formData.document}
          onChange={handleChange}
          disabled={!isEditing}
          width="33%"
        />
        <InputField
          label={t('profile.phone')}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          disabled={!isEditing}
          width="33%"
        />
        <InputField
          label={t('profile.phone2')}
          name="phone2"
          type="tel"
          value={formData.phone2}
          onChange={handleChange}
          disabled={!isEditing}
          width="33%"
        />
        <InputField
          label={t('profile.address')}
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={!isEditing}
          width="100%"
        />
        <InputField
          label={t('profile.province')}
          name="province"
          value={formData.province}
          onChange={handleChange}
          disabled={!isEditing}
          width="33%"
        />
        <InputField
          label={t('profile.city')}
          name="city"
          value={formData.city}
          onChange={handleChange}
          disabled={!isEditing}
          width="33%"
        />
        <InputField
          label={t('profile.postalCode')}
          name="cp"
          value={formData.cp}
          onChange={handleChange}
          disabled={!isEditing}
          width="33%"
        />
        <InputField
          label={t('profile.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <SelectField
          label={t('profile.language')}
          name="language"
          value={formData.language}
          onChange={handleChange}
          disabled={!isEditing}
          options={[
            { value: 'es-ES', label: 'Español' },
            { value: 'en-EN', label: 'English' },
          ]}
        />
      </div>
    </form>
  )
}

export default ProfileForm
