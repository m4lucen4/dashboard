export const errorMessages: { [key: string]: string } = {
  'auth/email-already-in-use': 'El correo electrónico ya está en uso.',
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/user-not-found': 'No se encontró al usuario.',
  'auth/invalid-credential': 'El usuario y/o la contraseña no son válidos',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/weak-password': 'La contraseña es demasiado débil.',
  'User account is not active': 'Este usuario no está activo',
}

export const getFriendlyErrorMessage = (error: string): string => {
  if (errorMessages[error]) {
    return errorMessages[error]
  }

  const regex = /Firebase: Error \(([^)]+)\)/
  const match = error.match(regex)
  if (match && match[1]) {
    return errorMessages[match[1]] || 'Ocurrió un error desconocido.'
  }

  return 'Ocurrió un error desconocido.'
}
