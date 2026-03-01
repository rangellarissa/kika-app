import "./works.scss";

import { Button, ImageList, ImageListItem, Modal, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";

import ImageModal from "../../components/modal/ImageModal";
import { Obra } from "../../types/types";
import BackButton from "../../components/backButton/BackButton";

const Works: React.FC = () => {

    const [obra, setObra] = useState<Obra[]>([]);
    const [currentObra, setCurrentObra] = useState<Obra>();
    const [open, setOpen] = useState(false);
    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://kika-api.vercel.app/api/obra');
            const jsonData = await response.json();
            setObra(jsonData);
        }
        fetchData();
    }, []);

    const sortedObras = useMemo(() => {
        return [...obra].sort((a, b) => a.ordem - b.ordem);
    }, [obra]);

    function handleClick(id: number) {
        async function fetchData() {
            const response = await fetch(`https://kika-api.vercel.app/api/obra/${id}`);
            const jsonData = await response.json();
            setCurrentObra(jsonData);
        }

        fetchData();
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setCurrentObra(undefined);
    }

    if (!obra) {
        return null;
    };


    return (
        <div className="works">
            <BackButton/>
            <div className="works__header">
                <h1>Trabalhos</h1>
            </div>
            <div className="works__content">
                <ImageList variant="masonry" cols={isMobile ? 2 : 3} gap={20}>
                    {sortedObras.map((obra) => (
                        <ImageListItem key={obra.id} onClick={() => handleClick(obra.id)}>
                            <img
                                src={`${obra.imagem.imageURL}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${obra.imagem.imageURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                loading="lazy"
                                alt={obra.titulo}
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

export default Works