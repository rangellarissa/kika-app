import './news.scss';

import { useEffect, useState } from "react";

import { Novidade } from '../../types/types';

const News = () => {

  const [data, setData] = useState<Novidade[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://kika-api.vercel.app/api/novidade');
      const jsonData = await response.json();
      setData(jsonData);
    }

    fetchData();
}, []);

  if(!data){
    return null;
  };

  return (
    <div className="news">
      <div className="news__header">
        <h1>Novidades</h1>
      </div>
      {data.map((data, index) => (
        <div className="news__content" key={index}>
            <div className="news__content--header">
                <h1>{data.titulo}</h1>
            </div>
            <div className="news__content--text">
                <p>{data.texto}</p>
                <img src={data.imagem?.imageURL}/>
            </div>
        </div>
      ))}
    </div>
  );
};

export default News