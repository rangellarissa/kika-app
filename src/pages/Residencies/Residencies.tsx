import './residencies.scss';

import { useEffect, useState } from "react";

import { Show } from '../../types/types';

const Residencies = () => {

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
    <div className="residencies">
      <div className="residencies__header">
        <h1>Residências</h1>
      </div>
      {data.map((data, index) => (
        <div className="residencies__content" key={index}>
          <div className="residencies__content--header">
            <h1>{data.titulo}</h1>
          </div>
          <div className="residencies__content--text">
            <p>{data.ano}</p>
            <p>{data.local}</p>
            <p>{data.texto}</p>
          </div>
          <div className="residencies__content--image">
            <img src={data.imagem?.imageURL}/>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Residencies