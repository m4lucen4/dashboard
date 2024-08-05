import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../../redux/store'
import {
  resetCreateUserRequest,
  resetEditUserRequest,
} from '../../../redux/slices/usersSlice'

import { User } from '../../../types'

interface UserFormProps {
  onSubmit: (user: User) => void
  editingUser?: User | null
  onClose: () => void
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  editingUser,
  onClose,
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { createUserRequest, editUserRequest } = useSelector(
    (state: RootState) => state.users
  )

  const [email, setEmail] = useState(editingUser?.email || '')
  const [password, setPassword] = useState(editingUser?.password || '')
  const [firstName, setFirstName] = useState(editingUser?.firstName || '')
  const [lastName, setLastName] = useState(editingUser?.lastName || '')
  const [document, setDocument] = useState(editingUser?.document || '')
  const [phone, setPhone] = useState(editingUser?.phone || '')
  const [phone2, setPhone2] = useState(editingUser?.phone2 || '')
  const [address, setAddress] = useState(editingUser?.address || '')
  const [cp, setCp] = useState(editingUser?.cp || '')
  const [province, setProvince] = useState(editingUser?.province || '')
  const [city, setCity] = useState(editingUser?.city || '')
  const [role, setRole] = useState(editingUser?.role || '')
  const [active, setActive] = useState(editingUser?.active || false)
  const [language, setLanguage] = useState(
    editingUser?.language || navigator.language || 'es'
  )

  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = {
      email,
      password,
      firstName,
      lastName,
      phone: Number(phone),
      phone2: Number(phone2),
      address,
      cp: Number(cp),
      province,
      city,
      role,
      document,
      active,
      language,
    }
    if (editingUser) {
      onSubmit({ ...user, id: editingUser.id })
    } else {
      onSubmit(user)
    }
  }

  useEffect(() => {
    if (createUserRequest.ok || editUserRequest.ok) {
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setDocument('')
      setPhone('')
      setPhone2('')
      setAddress('')
      setCp('')
      setProvince('')
      setCity('')
      setRole('')
      setActive(false)
      setLanguage(navigator.language || 'es')
      onClose()
      dispatch(resetCreateUserRequest())
      dispatch(resetEditUserRequest())
    }
  }, [createUserRequest.ok, editUserRequest.ok, dispatch, onClose])

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.firstName')}
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.lastName')}
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="document"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.document')}
              </label>
              <div className="mt-2">
                <input
                  id="document"
                  name="document"
                  type="text"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  autoComplete="document"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.phone')}
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="phone2"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.phone2')}
              </label>
              <div className="mt-2">
                <input
                  id="phone2"
                  name="phone2"
                  type="number"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.address')}
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="province"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.province')}
              </label>
              <div className="mt-2">
                <input
                  id="province"
                  name="province"
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.city')}
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.cp')}
              </label>
              <div className="mt-2">
                <input
                  id="cp"
                  name="cp"
                  type="number"
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.email')}
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {!editingUser && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('users.password')}
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            {editingUser && <div className="sm:col-span-2"></div>}

            <div className="sm:col-span-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.role')}
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">{t('users.selectRole')}</option>
                  <option value="administrador">{t('users.admin')}</option>
                  <option value="gestor">{t('users.manager')}</option>
                  <option value="tecnico">{t('users.technician')}</option>
                  <option value="cliente">{t('users.client')}</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="active"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('users.active')}
              </label>
              <div className="mt-2">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {t('save')}
        </button>
      </div>
    </form>
  )
}

export default UserForm
