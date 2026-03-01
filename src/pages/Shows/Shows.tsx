import './shows.scss';

import { useEffect, useState, useMemo } from "react";

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

  const sortedShows = useMemo(() => {
    return [...data].sort((a, b) => Number(b.ano) - Number(a.ano));
  }, [data]);

  if (data.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="shows">
      <BackButton />
      <div className="shows__header">
        <h1>Exposições</h1>
      </div>

      {sortedShows.map((show) => (
        <div className="shows__content" key={show.id}>
          <div className="shows__content--header">
            <h2>{show.titulo}</h2>
          </div>

          <div className="shows__content--text">
            <p>{show.ano}</p>
            <p>{show.local}</p>
            <p>{show.texto}</p>
          </div>
          {show.imagem && (
            <div className="shows__content--image">
              <img src={show.imagem.imageURL} alt={show.titulo} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Shows