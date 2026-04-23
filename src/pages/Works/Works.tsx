import "./works.scss";

import { ImageList, ImageListItem } from "@mui/material";
import { useEffect, useState, useMemo } from "react";

import ImageModal from "../../components/modal/ImageModal";
import { Obra } from "../../types/types";
import BackButton from "../../components/backButton/BackButton";

const Works: React.FC = () => {

    const [obra, setObra] = useState<Obra[]>([]);
    const [currentObra, setCurrentObra] = useState<Obra>();
    const [open, setOpen] = useState(false);
    const [loadedImages, setLoadedImages] = useState<number[]>([]);
    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => window.removeEventListener('resize', handleWindowSizeChange);
    }, []);

    const isMobile = width <= 768;

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://kika-api.vercel.app/api/obra');
            const jsonData = await response.json();
            setObra(jsonData);

            // 🔥 pré-carrega primeiras imagens
            jsonData.slice(0, 6).forEach((item: Obra) => {
                const img = new window.Image();
                img.src = item.imagem.imageURL;
            });
        }
        fetchData();
    }, []);

    const sortedObras = useMemo(() => {
        return [...obra].sort((a, b) => a.ordem - b.ordem);
    }, [obra]);

    function handleClick(item: Obra) {
        setCurrentObra(item); // evita fetch extra
        setOpen(true);

        // pré-carrega imagem grande
        const img = new window.Image();
        img.src = item.imagem.imageURL;
    }

    function handleClose() {
        setOpen(false);
        setCurrentObra(undefined);
    }

    return (
        <div className="works">
            <BackButton/>

            <div className="works__header">
                <h1>Trabalhos</h1>
            </div>

            <div className="works__content">
                <ImageList variant="masonry" cols={isMobile ? 2 : 3} gap={20}>
                    {sortedObras.map((item) => (
                        <ImageListItem key={item.id} onClick={() => handleClick(item)}>
                            <img
                                src={item.imagem.imageURL}
                                loading="lazy"
                                alt={item.titulo}
                                onLoad={() =>
                                    setLoadedImages(prev => [...prev, item.id])
                                }
                                className={loadedImages.includes(item.id) ? 'loaded' : ''}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>

            {currentObra &&
                <ImageModal
                    titulo={currentObra.titulo}
                    ano={currentObra.ano}
                    tecnica={currentObra.tecnica}
                    disponivel={currentObra.disponivel}
                    dimensoes={currentObra.dimensoes}
                    imageURL={currentObra.imagem.imageURL}
                    open={open}
                    onClose={handleClose}
                />
            }
        </div>
    );
};

export default Works;