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
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="md:w-1/2">
        <label className="block text-sm font-medium text-gray-700">
          Seleccione Fechas
        </label>
        <DatePicker
          selected={null}
          onChange={handleDateChange}
          highlightDates={selectedDates}
          inline
          className="w-full rounded-md border"
          placeholderText="Seleccione múltiples fechas"
        />
      </div>

      <div className="space-y-4 md:w-1/2">
        <label className="block text-sm font-medium text-gray-700">
          Precio Especial
        </label>

        <div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
          <button
            className="peer-placeholder-shown:bg-blue-gray-500 !absolute right-1 top-1 z-10 select-none rounded bg-indigo-500 px-4 py-2 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
            type="button"
            onClick={handleAdd}
            data-ripple-light="true"
          >
            Agregar
          </button>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border"
            placeholder=" "
          />
        </div>
      </div>
    </div>
  )
}

export default SpecialPriceInput
