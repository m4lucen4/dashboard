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
      <div className="grid grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`image-${index}`}
              className="h-50 w-50 rounded-md"
            />
            <button
              type="button"
              className="absolute right-0 top-0 rounded-full bg-red-600 p-1 text-white"
              onClick={() => onImageRemove(url)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadImages
