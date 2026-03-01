import './shows.scss';

import { useEffect, useState } from "react";

import { Show } from '../../types/types';
import BackButton from '../../components/backButton/BackButton';

const Shows = () => {

  const [data, setData] = useState<Show[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://kika-api.vercel.app/api/exposicao');
      const jsonData = await response.json();
      setData(jsonData);
    }

    fetchData();
}, []);

  if(!data){
    return null;
  };

  return (
    <div className="shows">
      <BackButton/>
      <div className="shows__header">
        <h1>Exposições</h1>
      </div>
      {data.map((data, index) => (
        <div className="shows__content" key={index}>
          <div className="shows__content--header">
            <h1>{data.titulo}</h1>
          </div>
          <div className="shows__content--text">
            <p>{data.ano}</p>
            <p>{data.local}</p>
            <p>{data.texto}</p>
          </div>
          <div className="shows__content--image">
            <img src={data.imagem?.imageURL}/>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shows