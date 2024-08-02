import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type SpecialPriceInputProps = {
  onAdd: (dates: string[], price: number) => void
}

const SpecialPriceInput: React.FC<SpecialPriceInputProps> = ({ onAdd }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [price, setPrice] = useState<number>(0)

  const handleDateChange = (date: Date | null) => {
    if (date) {
      if (
        selectedDates.some(
          (selectedDate) => selectedDate.getTime() === date.getTime()
        )
      ) {
        setSelectedDates(
          selectedDates.filter(
            (selectedDate) => selectedDate.getTime() !== date.getTime()
          )
        )
      } else {
        setSelectedDates([...selectedDates, date])
      }
    }
  }

  const handleAdd = () => {
    const dateStrings = selectedDates.map(
      (date) => date.toISOString().split('T')[0]
    )
    onAdd(dateStrings, price)
    setSelectedDates([])
    setPrice(0)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Seleccione Fechas
        </label>
        <DatePicker
          selected={null}
          onChange={handleDateChange}
          highlightDates={selectedDates}
          inline
          className="rounded-md border"
          placeholderText="Seleccione múltiples fechas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Precio Especial
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Agregar Precio Especial
      </button>
    </div>
  )
}

export default SpecialPriceInput
