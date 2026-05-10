import './image-carousel.scss';

import { useEffect, useState } from 'react';

import DotNavigation from '../dotsNavigation/DotNavigation';

type Props = {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
};

const ImageCarousel = ({
  images,
  autoPlay = false,
  interval = 4000,
}: Props) => {

  const [currentImage, setCurrentImage] = useState(0);

  // reset ao trocar galeria
  useEffect(() => {
    setCurrentImage(0);
  }, [images.length]);

  // autoplay
  useEffect(() => {

    if (!autoPlay || images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {

      setCurrentImage((prev) =>
        prev < images.length - 1
          ? prev + 1
          : 0
      );

    }, interval);

    return () => clearInterval(timer);

  }, [images.length, autoPlay, interval]);

  function handleDotClick(index: number) {
    setCurrentImage(index);
  }

  function handlePrevious() {

    setCurrentImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  }

  function handleNext() {

    setCurrentImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  }

  if (!images.length) {
    return null;
  }

  return (
    <div className="imageCarousel">

      <div className="imageCarousel__images">

        {images.map((image, index) => (

          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            className={
              index === currentImage
                ? 'active'
                : ''
            }
          />

        ))}

      </div>

      {images.length > 1 && (
        <>
          <button
            className="imageCarousel__arrow imageCarousel__arrow--left"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            className="imageCarousel__arrow imageCarousel__arrow--right"
            onClick={handleNext}
            aria-label="Next image"
          >
            →
          </button>

          <div className="imageCarousel__buttons">

            <DotNavigation
              numDots={images.length}
              activeIndex={currentImage}
              onDotClick={handleDotClick}
            />

          </div>
        </>
      )}

    </div>
  );
};

export default ImageCarousel;