import "./works.scss";

import { Button, ImageList, ImageListItem, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import ImageModal from "../../components/modal/ImageModal";
import { Obra } from "../../types/types";

const Works: React.FC = () => {

  const [obra, setObra] = useState<Obra[]>([]);
  const [currentObra, setCurrentObra] = useState<Obra>();
  const [filteredData, setFilteredData] = useState<Obra[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
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

  function handleClick(index: number) {
    const clickedObra = (isFilterApplied ? filteredData : obra)[index];
    
    async function fetchData() {
      const response = await fetch(`https://kika-api.vercel.app/api/obra/${clickedObra.id}`);
      const jsonData = await response.json();
      setCurrentObra(jsonData)
    }
    
    fetchData();
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setCurrentObra(undefined);
  }

  function showAvailable() {
    const filteredObra = obra.filter((obra) => obra.disponivel === true);
    setFilteredData(filteredObra);
    setIsFilterApplied(true);
  }

  function showAll() {
    setIsFilterApplied(false);
  }

  if(!obra){
    return null;
  };


  return (
    <div className="works">
      <div className="works__header">
        <h1>Obras</h1>
      </div>
      <div className="works__content">
        {isFilterApplied ? (
          <Button size="small" variant="text" onClick={showAll}>mostrar todas</Button>
        ) : (
          <Button size="small" variant="text" onClick={showAvailable}>disponíveis</Button>
        )}
        <ImageList variant="masonry" cols={ isMobile ? 2 : 3} gap={20}>
          {(isFilterApplied ? filteredData : obra).map((obra, index) => (
            <ImageListItem key={index} onClick={() => handleClick(index)}>
              <img 
                src={`${obra.imagem.imageURL}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${obra.imagem.imageURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                loading="lazy"
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