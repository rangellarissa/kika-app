import { useEffect, useState } from "react";
import './homeCarousel.css';

interface ImageProps {
    url: string;
}

const images: ImageProps[] = [
    { url: 'https://www.portasvilaseca.com.br/wp/wp-content/uploads/2021/04/KC_111_web.jpg' },
    { url: 'https://projetoafro.com/wp-content/uploads/2020/07/projeto_afro_mapeamento_artista_kika_carvalho_8.jpeg' },
    { url: 'https://static.aosfatos.org/media/images/arts/Aos-Fatos-_-Leilao-_-4.jpg' },
    { url: 'https://www.portasvilaseca.com.br/wp/wp-content/uploads/2021/04/Emi_fe_e_2._Oleo_e_acrilica_sobre_tela._150_x_100_cm.jpg' }
]

const HomeCarousel = () => {

    const [currentImage, setCurrentImage] = useState(0);

    const handlePrevClick = () => {
        setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
    }

    const handleNextClick = () => {
        setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1);
    };

    return (
        <div id="carousel" className="homeCarousel">
            {images.map((image, index) => (
                <img
                key={index}
                src={image.url}
                alt=""
                style={{ display: index === currentImage ? 'block' : 'none' }}
                />
            ))}
            <div className="homeCarousel__buttons">
                <button className="homeCarousel__buttons--prev-button" onClick={handlePrevClick}>
                    &lt;
                </button>
                <button className="homeCarousel__buttons--next-button" onClick={handleNextClick}>
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default HomeCarousel;