import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState, AppDispatch } from '../../redux/store'
import { createUser, fetchUsers, editUser } from '../../redux/slices/usersSlice'
import UsersList from './components/UsersList'
import UserForm from './components/UserForm'
import Drawer from '../../components/Drawer/Drawer'
import Alert from '../../components/Alert/Alert'
import { User } from '../../types'
import Loading from '../../components/Loading/Loading'
import ListHeader from '../../components/ListHeader/ListHeader'

const Users: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()
  const { users, createUserRequest, editUserRequest, fetchUserRequest } =
    useSelector((state: RootState) => state.users)

  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleCreateUser = (user: User) => {
    dispatch(createUser(user))
  }

  const handleEditUser = (user: User) => {
    dispatch(editUser(user))
  }

  const handleOpenEditForm = (user: User) => {
    setEditingUser(user)
    setOpen(true)
  }

  const handleCloseDrawer = () => {
    setOpen(false)
    setEditingUser(null)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.document?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toString().includes(searchTerm)
  )

  if (fetchUserRequest.inProgress) {
    return <Loading />
  }

  return (
    <div className="mx-auto mb-8 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      {createUserRequest.messages.length > 0 && (
        <Alert message={createUserRequest.messages} />
      )}
      {editUserRequest.messages.length > 0 && (
        <Alert message={editUserRequest.messages} />
      )}
      <ListHeader
        title={t('users.title')}
        buttonLabel={t('users.addUser')}
        onOpen={() => setOpen(true)}
        onSearch={setSearchTerm}
      />
      <UsersList users={filteredUsers} onEdit={handleOpenEditForm} />
      <Drawer
        open={open}
        title={editingUser ? t('users.editUser') : t('users.addUser')}
        onClose={handleCloseDrawer}
        fullScreen
      >
        <UserForm
          onSubmit={editingUser ? handleEditUser : handleCreateUser}
          editingUser={editingUser}
          onClose={handleCloseDrawer}
        />
      </Drawer>
    </div>
  )
}

export default Users
