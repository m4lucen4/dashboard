import React from 'react'

interface SelectFieldProps {
  label: string
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="col-span-6 sm:col-span-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectField
