import './news.scss';

import { useEffect, useState } from "react";

import { Novidade } from '../../types/types';
import BackButton from '../../components/backButton/BackButton';
import FormattedText from '../../components/formattedText/FormattedText';

const News = () => {

  const [data, setData] = useState<Novidade[]>([]);

  useEffect(() => {
    document.title = 'Novidades | Kika Carvalho';
    async function fetchData() {
      const response = await fetch('https://kika-api.vercel.app/api/novidade');

      const jsonData: Novidade[] = await response.json();

      const sortedData = [...jsonData].sort((a, b) => {
        const [dayA, monthA, yearA] = a.data.split('/');
        const [dayB, monthB, yearB] = b.data.split('/');

        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        return dateB.getTime() - dateA.getTime();
      });

      setData(sortedData);
    }

    fetchData();
  }, []);

  if (data.length === 0) {
    return (
      <div className="news">
        <BackButton />
        <div className="news__header">
          <h1>Novidades</h1>
        </div>

        <p>Em breve...</p>
      </div>
    );
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
            <p>{novidade.data}</p>
            <h2>{novidade.titulo}</h2>
            <div className="news__share">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${novidade.titulo} - ${window.location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no WhatsApp"
              >
                <img
                  src="/assets/icons/whatsapp.webp"
                  alt="WhatsApp"
                />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  novidade.titulo
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no X"
              >
                <img
                  src="/assets/icons/x.png"
                  alt="X"
                />
              </a>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                aria-label="Copiar link"
              >
                <img
                  src="/assets/icons/link.png"
                  alt="Copiar link"
                />
              </button>
            </div>
          </div>
          <div className="news__content--image">
            <img
              src={novidade.imagem.imageURL}
              alt={novidade.titulo}
              loading="lazy"
            />
            <p>{novidade.image_label}</p>
          </div>
          <div className="news__content--text">
            <FormattedText text={novidade.texto} />
          </div>
        </div>
      ))}

    </div>
  );
};

export default News