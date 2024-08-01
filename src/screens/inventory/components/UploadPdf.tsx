import React from 'react'
import { DocumentIcon } from '@heroicons/react/24/outline'

type PDFUploadProps = {
  pdfUrls: string[]
  onPdfChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPdfRemove: (url: string) => void
}

const UploadPdf: React.FC<PDFUploadProps> = ({
  pdfUrls,
  onPdfChange,
  onPdfRemove,
}) => {
  return (
    <div className="mt-4 space-y-6">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        Documentos PDF
      </label>
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={onPdfChange}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
      />
      <div className="grid grid-cols-5 gap-2">
        {pdfUrls.map((url, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block text-blue-500 underline"
            >
              <DocumentIcon aria-hidden="true" className="h-12 w-12" />
            </a>
            <span
              className="cursor-pointer text-red-600"
              onClick={() => onPdfRemove(url)}
            >
              Eliminar
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadPdf
