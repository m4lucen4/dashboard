import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../../../redux/store'
import { logout } from '../../../redux/slices/authSlice'
import Modal from '../../Modal/Modal'
import { User } from '../../../types'

const getRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const getInitials = (firstName: string, lastName: string) => {
  return firstName[0] + (lastName ? lastName[0] : '')
}

const ProfileDropdown: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentUser = useSelector(
    (state: RootState) => state.auth.currentUser as User
  )

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const handleLogout = () => {
    setIsModalOpen(true)
  }

  const confirmLogout = () => {
    dispatch(logout())
    navigate('/login')
    setIsModalOpen(false)
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <div>
      <Menu as="div" className="relative ml-3">
        <div>
          <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${getRandomColor()}`}
            >
              {currentUser ? (
                <span className="text-lg font-semibold text-white">
                  {getInitials(currentUser.firstName, currentUser.lastName)}
                </span>
              ) : (
                <span className="text-lg font-semibold text-white">?</span>
              )}
            </div>
          </MenuButton>
        </div>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <MenuItem>
            {({ focus }) => (
              <a
                href="#"
                className={classNames(
                  focus ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
                onClick={handleProfile}
              >
                Perfil
              </a>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <a
                href="#"
                className={classNames(
                  focus ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
              >
                Ajustes
              </a>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <a
                href="#"
                className={classNames(
                  focus ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
                onClick={handleLogout}
              >
                Salir
              </a>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
      <Modal
        confirmButton="Confirmar"
        description="¿Estás seguro de que deseas salir de la aplicación?"
        title="Confirmar salida"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  )
}

export default ProfileDropdown
