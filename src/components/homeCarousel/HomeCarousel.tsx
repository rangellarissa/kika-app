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

    useEffect(() => {
        const handleResize = () => {
            const navbarHeight = document.getElementById('navbar')!.offsetHeight;
            const carousel = document.getElementById('carousel')!;
            carousel.style.paddingTop = `${navbarHeight}px`;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return (
        <div id="carousel" className="homeCarousel">
            <button className="homeCarousel__prev-button" onClick={handlePrevClick}>
                &lt;
            </button>
            <button className="homeCarousel__next-button" onClick={handleNextClick}>
                &gt;
            </button>
            {images.map((image, index) => (
                <img
                key={index}
                src={image.url}
                alt=""
                style={{ display: index === currentImage ? 'block' : 'none' }}
                />
            ))}
        </div>
    );
}

export default HomeCarousel;