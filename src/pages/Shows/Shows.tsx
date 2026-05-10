import './shows.scss';

import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';

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

  const validShows = sortedShows.filter(
    (show) => show.images?.length
  );

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
        {validShows.map((show) => (
            <Link
              key={show.id}
              to={`/shows/${show.slug}`}
              className="shows__card"
            >
              {show.images && 
                <img
                  src={show.images[0]}
                  alt={show.titulo}
                  loading="lazy"
                />
              }
              <h2>{show.titulo}</h2>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default Shows;