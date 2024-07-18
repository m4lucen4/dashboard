import React, { useState } from 'react'

interface CarouselProps {
  images: string[]
  alt: string
}

const Carousel: React.FC<CarouselProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative">
      <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
        <img
          alt={alt}
          src={images[currentIndex]}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      {images.length > 1 ? (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-4 w-4 rounded-full ${
                index === currentIndex ? 'bg-gray-800' : 'bg-white'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Carousel
