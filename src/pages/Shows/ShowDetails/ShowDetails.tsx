import './show-details.scss';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BackButton from '../../components/backButton/BackButton';
import { Show } from '../../../types/types';

const ShowDetails = () => {
  const { slug } = useParams();

  const [show, setShow] = useState<Show | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://kika-api.vercel.app/api/exposicao/by-slug/${slug}`
      );

      const jsonData = await response.json();
      setShow(jsonData);
    }

    fetchData();
  }, [slug]);

  if (!show) return null;

  return (
    <div className="show-details">
      <BackButton />
      <div className="show-details__header">
        <h1>Exposições</h1>
      </div>
        <div className="show-details__content" key={show.id}>
          <div className="show-details__content--header">
            <h2>{show.titulo}</h2>
          </div>

          <div className="show-details__content--text">
            <p>{show.ano}</p>
            <p>{show.local}</p>
            <FormattedText text={show.texto} />
          </div>
          {show.imagem && (
            <div className="show-details__content--image">
              <img src={show.imagem.imageURL} alt={show.titulo} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShowDetails;