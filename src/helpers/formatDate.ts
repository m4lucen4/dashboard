export const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'No disponible'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
