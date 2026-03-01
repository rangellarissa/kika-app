import './residencies.scss';

import { useEffect, useState } from "react";

import { Residency } from '../../types/types';
import BackButton from '../../components/backButton/BackButton';

const Residencies = () => {

  const [data, setData] = useState<Residency[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://kika-api.vercel.app/api/residencia');
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
      <BackButton />
      <div className="residencies__header">
        <h1>Residências</h1>
      </div>

      {data.map((residency, index) => (
        <div className="residencies__content" key={index}>
          <div className="residencies__content--header">
            <h2>{residency.titulo}</h2>
          </div>

          <div className="residencies__content--text">
            <p>{residency.ano}</p>
            <p>{residency.local}</p>
            <p>{residency.texto}</p>
          </div>

          <div className="residencies__content--image">
            {residency.imagens?.map((imagem, imgIndex) => (
              <img
                key={imgIndex}
                src={imagem.imageURL}
                alt={residency.titulo}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Residencies