import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { weekdaysNames } from '@/constants/index'

type SpecialPriceInputProps = {
  onAdd: (dates: string[], price: number) => void
}

const SpecialPriceInput: React.FC<SpecialPriceInputProps> = ({ onAdd }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [price, setPrice] = useState<number>(0)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [weekdays, setWeekdays] = useState<boolean[]>(Array(7).fill(false))

  const toMiddayUTC = (date: Date) => {
    const adjustedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12)
    )
    return adjustedDate
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const adjustedDate = toMiddayUTC(date)
      if (
        selectedDates.some(
          (selectedDate) => selectedDate.getTime() === adjustedDate.getTime()
        )
      ) {
        setSelectedDates(
          selectedDates.filter(
            (selectedDate) => selectedDate.getTime() !== adjustedDate.getTime()
          )
        )
      } else {
        setSelectedDates([...selectedDates, adjustedDate])
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
    setWeekdays(Array(7).fill(false))
  }

  const handleClearDates = () => {
    setSelectedDates([])
    setYear(new Date().getFullYear())
    setWeekdays(Array(7).fill(false))
  }

  const handleWeekdayChange = (index: number, checked: boolean) => {
    const newWeekdays = [...weekdays]
    newWeekdays[index] = checked
    setWeekdays(newWeekdays)

    const allWeekdaysDates = getWeekdaysOfYear(year, newWeekdays)
    const uniqueDates = Array.from(new Set(allWeekdaysDates))
    setSelectedDates(uniqueDates)
  }

  const getWeekdaysOfYear = (year: number, weekdays: boolean[]): Date[] => {
    const dates: Date[] = []
    const date = new Date(year, 0, 1)
    const today = new Date()

    while (date.getFullYear() === year) {
      if (weekdays[date.getDay()]) {
        if (
          year > today.getFullYear() ||
          (year === today.getFullYear() && date >= today)
        ) {
          const adjustedDate = toMiddayUTC(date)
          if (!dates.some((d) => d.getTime() === adjustedDate.getTime())) {
            dates.push(adjustedDate)
          }
        }
      }
      date.setDate(date.getDate() + 1)
    }
    return dates
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10)
    if (newYear >= new Date().getFullYear()) {
      setYear(newYear)
      const allWeekdaysDates = getWeekdaysOfYear(newYear, weekdays)
      setSelectedDates([...selectedDates, ...allWeekdaysDates])
    }
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
        <button
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          onClick={handleClearDates}
          data-ripple-light="true"
        >
          Limpiar Fechas
        </button>
      </div>

      <div className="space-y-4 md:w-1/2">
        <label className="block text-sm font-medium text-gray-700">
          Precio Especial
        </label>

        <div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
          <button
            className="peer-placeholder-shown:bg-blue-gray-500 !absolute right-1 top-1 z-10 select-none rounded bg-indigo-500 px-4 py-2 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
            type="button"
            disabled={selectedDates.length === 0}
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

        <label className="block text-sm font-medium text-gray-700">
          Añadir días del año
        </label>
        <input
          type="number"
          value={year}
          onChange={handleYearChange}
          min={new Date().getFullYear()}
          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Año"
        />
        <div className="grid grid-cols-2 gap-4">
          {weekdaysNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={weekdays[index]}
                onChange={(e) => handleWeekdayChange(index, e.target.checked)}
                className="mr-2"
              />
              <label>{name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpecialPriceInput
