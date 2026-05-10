import './show-details.scss';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BackButton from '../../../components/backButton/BackButton';
import FormattedText from '../../../components/formattedText/FormattedText';
import ImageCarousel from '../../../components/carousel/imageCarousel/ImageCarousel';

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

  if (!show) {
    return null;
  }

  return (
    <div className="show-details">

      <BackButton fallback="/shows" />

      <div className="show-details__header">
        <h1>{show.titulo}</h1>
      </div>

      <div
        className="show-details__content"
        key={show.id}
      >
        {!!show.images?.length && (
          <ImageCarousel
            images={show.images}
          />
        )}
        <div className="show-details__content--text">
          <p>{show.ano}</p>
          <p>{show.local}</p>
          <FormattedText text={show.texto} />
        </div>

      </div>

    </div>
  );
};

export default ShowDetails;