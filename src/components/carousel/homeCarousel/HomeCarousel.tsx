import './homeCarousel.scss';

import { useEffect, useState } from "react";

import DotNavigation from "../dotsNavigation/DotNavigation";
import { Image } from '../../../types/types';

const HomeCarousel = () => {

    const [currentImage, setCurrentImage] = useState(0);
    const [data, setData] = useState<Image[]>([]);

    useEffect(() => {
        async function fetchData() {
          const response = await fetch('https://kika-api.vercel.app/api/imagem');
          const jsonData = await response.json();
          setData(jsonData);
        }
    
        fetchData();
    }, []);
      
    
    const handleDotClick = (index: number) => {
        setCurrentImage(index);
    };
    
    setTimeout(() => {
        if(currentImage < data.length - 1 ){
            setCurrentImage(currentImage + 1);
        } else {
            setCurrentImage(0);
        }
    }, 3000)

    if(!data){
      return null;
    };

    return (
        <div id="carousel" className="homeCarousel">
            {data.map((data, index) => (
                <img
                key={index}
                src={data.imageURL}
                alt=""
                style={{ display: index === currentImage ? 'block' : 'none' }}
                />
            ))}
            <div className="homeCarousel__buttons">
                <DotNavigation numDots={data.length} activeIndex={currentImage} onDotClick={handleDotClick} />
            </div>
        </div>
    );
}

export default HomeCarousel;