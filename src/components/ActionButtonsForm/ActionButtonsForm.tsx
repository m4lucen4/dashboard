import React from 'react'

type ActionButtonsFormProps = {
  onClose: () => void
}

const ActionButtonsForm: React.FC<ActionButtonsFormProps> = ({ onClose }) => {
  return (
    <div className="mt-6 flex items-center justify-end gap-x-6">
      <button
        type="button"
        onClick={onClose}
        className="text-sm font-semibold leading-6 text-gray-900"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Guardar
      </button>
    </div>
  )
}

export default ActionButtonsForm
