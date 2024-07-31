import React from 'react'

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
      <div className="grid grid-cols-3 gap-4">
        {pdfUrls.map((url, index) => (
          <div key={index} className="relative">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-blue-500 underline"
            >
              PDF {index + 1}
            </a>
            <button
              type="button"
              className="absolute right-0 top-0 rounded-full bg-red-600 p-1 text-white"
              onClick={() => onPdfRemove(url)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadPdf
