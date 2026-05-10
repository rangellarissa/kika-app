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
  interval = 1000,
}: Props) => {

  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    setCurrentImage(0);
  }, [images]);

  useEffect(() => {

    if (!autoPlay) return;

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

  if (!images.length) {
    return null;
  }

  return (
    <div className="imageCarousel">

      {images.map((image, index) => (

        <img
          key={image}
          src={image}
          alt=""
          className={
            index === currentImage
              ? 'active'
              : ''
          }
        />

      ))}

      {images.length > 1 && (
        <div className="imageCarousel__buttons">

          <DotNavigation
            numDots={images.length}
            activeIndex={currentImage}
            onDotClick={handleDotClick}
          />

        </div>
      )}

    </div>
  );
};

export default ImageCarousel;