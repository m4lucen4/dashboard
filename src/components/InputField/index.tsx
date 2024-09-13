import React from 'react'

interface InputFieldProps {
  label: string
  name: string
  type?: string
  value: string | number | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="col-span-6 sm:col-span-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  )
}

export default InputField
