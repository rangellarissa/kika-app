import './shows.scss';

import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';

import { Show } from '../../types/types';
import BackButton from '../../components/backButton/BackButton';
import FormattedText from '../../components/formattedText/FormattedText';

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

      <div className="shows__grid">
        {sortedShows.map((show) => (
          <>
          {show.imagem &&
            <Link
              key={show.id}
              to={`/shows/${show.slug}`}
              className="shows__card"
            >
              <img
                src={show.imagem.imageURL}
                alt={show.titulo}
                loading="lazy"
              />
              
              <h2>{show.titulo}</h2>
            </Link>
          }
          </>
        ))}
      </div>
    </div>
  );
};

export default Shows;