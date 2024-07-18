import React from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type DrawerProps = {
  open: boolean
  title: string
  onClose: () => void
  fullScreen?: boolean
  children: React.ReactNode
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  title,
  onClose,
  fullScreen = false,
  children,
}) => {
  return (
    <Dialog open={open} className="relative z-10" onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`pointer-events-none fixed ${fullScreen ? 'inset-0 flex items-center justify-center' : 'inset-y-0 right-0 flex max-w-full pl-10'}`}
          >
            <DialogPanel
              transition
              className={`pointer-events-auto relative transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700 ${fullScreen ? 'h-full w-full' : 'w-screen max-w-md'}`}
            >
              <TransitionChild>
                <div
                  className={`absolute ${fullScreen ? 'right-0' : 'left-0'} top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:${fullScreen ? '-mr-10' : '-ml-10'} sm:pr-4`}
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="relative rounded-md text-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                    {title}
                  </DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {children}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default Drawer
