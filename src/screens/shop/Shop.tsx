import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'

import Loading from '@/components/Loading/Loading'
import { fetchInventory } from '@/redux/slices/inventorySlice'
import Carousel from './components/Carousel'

const Shop: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { items, fetchInventoryRequest } = useSelector(
    (state: RootState) => state.inventory
  )

  useEffect(() => {
    dispatch(fetchInventory())
  }, [dispatch])

  if (fetchInventoryRequest.inProgress) {
    return <Loading />
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Tienda
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <Carousel images={item.images} alt={item.id} />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Uds: {item.units}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {item.price} €
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Shop
