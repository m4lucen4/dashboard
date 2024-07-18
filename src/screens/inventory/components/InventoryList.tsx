import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../../types';
import { PencilIcon } from '@heroicons/react/24/outline';
import Pagination from '../../../components/Pagination/Pagination';

type UsersListProps = {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
};

const InventoryList: React.FC<UsersListProps> = ({ items, onEdit }) => {
     const [currentPage, setCurrentPage] = useState(1);
     const [currentItems, setCurrentItems] = useState<InventoryItem[]>([]);
     const itemsPerPage = 10;

  useEffect(() => {
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    setCurrentItems(items.slice(indexOfFirstUser, indexOfLastUser));
  }, [currentPage, items]);

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(items.length / itemsPerPage)));
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (!items) {
    return null;
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-1">
                  Artículo
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-1">
                  Unidades
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">
                  Precio
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-1">
                    {item.title}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {item.units}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {item.price}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 gap-x-2 text-sm font-medium text-gray-900 sm:pl-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <PencilIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <span className="text-sm font-medium text-gray-700">Total registros: {items.length}</span>
          </div>
          {totalPages > 1 ?
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
            /> : null
          }
        </div>
      </div>
    </div>
  );
};

export default InventoryList;