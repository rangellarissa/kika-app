import './news.scss';

import { useEffect, useState } from "react";

import { Novidade } from '../../types/types';
import BackButton from '../../components/backButton/BackButton';
import FormattedText from '../../components/formattedText/FormattedText';

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

  if (data.length === 0) {
    return <p>Em breve...</p>;
  }

  return (
    <div className="news">
      <BackButton />
      <div className="news__header">
        <h1>Novidades</h1>
      </div>

      {data.map((novidade) => (
        <div className="news__content" key={novidade.id}>
          <div className="news__content--header">
            <h2>{novidade.titulo}</h2>
          </div>
          <div className="news__content--image">
            <img
              src={novidade.imagem.imageURL}
              alt={novidade.titulo}
            />
          </div>
          <div className="news__content--text">
            <p>{novidade.data}</p>
            <FormattedText text={novidade.texto} />
          </div>
        </div>
      ))}

    </div>
  );
};

export default News