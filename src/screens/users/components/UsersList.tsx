import React, { useState, useEffect } from 'react'
import { User } from '../../../types'
import { PencilIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Pagination from '../../../components/Pagination/Pagination'
import { formatDate } from '../../../helpers/formatDate'

type UsersListProps = {
  users: User[]
  onEdit: (user: User) => void
}

const UsersList: React.FC<UsersListProps> = ({ users, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentUsers, setCurrentUsers] = useState<User[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('TODOS')
  const usersPerPage = 10

  const filterUsersByRole = (users: User[], role: string) => {
    return role === 'TODOS' ? users : users.filter((user) => user.role === role)
  }

  useEffect(() => {
    const sortedUsers = [...users].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
    const filteredUsers = filterUsersByRole(sortedUsers, selectedRole)
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    setCurrentUsers(filteredUsers.slice(indexOfFirstUser, indexOfLastUser))
  }, [currentPage, users, selectedRole])

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(filterUsersByRole(users, selectedRole).length / usersPerPage)
      )
    )
  }

  const totalPages = Math.ceil(
    filterUsersByRole(users, selectedRole).length / usersPerPage
  )

  if (!users) {
    return null
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-start">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="TODOS">Todos</option>
              <option value="cliente">Cliente</option>
              <option value="tecnico">Técnico</option>
              <option value="gestor">Gestor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-1"
                >
                  Alta
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-1"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0"
                >
                  Apellidos
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0"
                >
                  Documento
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0"
                >
                  Teléfono
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0"
                >
                  Rol
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-1">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-1">
                    <div>
                      {user.email}
                      {!user.active && (
                        <div className="text-red-500">(INACTIVO)</div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {user.firstName}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {user.lastName}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {user.document}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {user.phone}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {user.role?.toUpperCase()}
                  </td>
                  <td className="gap-x-2 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    <button
                      onClick={() => onEdit(user)}
                      className="mr-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <PencilIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => console.log('Envío un email')}
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                      <EnvelopeIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <span className="text-sm font-medium text-gray-700">
              Total registros: {filterUsersByRole(users, selectedRole).length}
            </span>
          </div>
          {totalPages > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default UsersList
