import React from 'react'

type ImageUploadProps = {
  imageUrls: string[]
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageRemove: (url: string) => void
}

const UploadImages: React.FC<ImageUploadProps> = ({
  imageUrls,
  onImageChange,
  onImageRemove,
}) => {
  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        Imágenes
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onImageChange}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
      />
      <div className="grid grid-cols-5 gap-2">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <img
              src={url}
              alt={`image-${index}`}
              className="mb-2 h-12 w-12 rounded-md"
            />
            <span
              className="cursor-pointer text-red-600"
              onClick={() => onImageRemove(url)}
            >
              Eliminar
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadImages
