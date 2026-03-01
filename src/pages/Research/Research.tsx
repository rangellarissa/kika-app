import BackButton from '../../components/backButton/BackButton';
import { Image, ResearchProps } from '../../types/types';
import './research.scss';

import { useEffect, useState } from "react";

const Research = () => {

  const [data, setData] = useState<ResearchProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://kika-api.vercel.app/api/research');
      const jsonData = await response.json();
      setData(jsonData);
    }

    fetchData();
}, []);

  if(!data){
    return null;
  };

  return (
    <div className="research">
      <BackButton />
      <div className="research__header">
        <h1>Textos, Pesquisas</h1>
      </div>
      {data.map((data, index) => (
        <div className="research__content" key={index}>
          <div className="research__content--header">
            <h1>{data.titulo}</h1>
            <p>{data.autora}</p>
          </div>
          <div className="research__content--text">
            <p>{data.data}</p>
            <p>{data.texto.split("\n\n")}</p>
          </div>
          <div className="research__content--image">
            <img src={data.imagem?.imageURL}/>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Research