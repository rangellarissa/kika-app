import "./works.scss";

import { Button, Grid } from "@mui/material";
import { Image, Obra } from "../../types/types";
import { useEffect, useState } from "react";

const Works: React.FC = () => {

  const [obra, setObra] = useState<Obra[]>([]);
  const [filteredData, setFilteredData] = useState<Obra[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
      async function fetchData() {
        const response = await fetch('https://kika-api.vercel.app/api/obra');
        const jsonData = await response.json();
        setObra(jsonData);
      }
  
      fetchData();
  }, []);

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

  console.log(obra)

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
        <Grid container rowSpacing={1} columnSpacing={3}>
          {(isFilterApplied ? filteredData : obra).map((obra, index) => (
            <Grid item xs={6}>
              <img src={obra.imagem.imageURL} alt={obra.titulo} key={index} />
            </Grid>
          ))}
        </Grid>
      </div>      
    </div>
  );
};

export default Works