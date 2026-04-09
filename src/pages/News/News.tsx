import './news.scss';

import { useEffect, useState } from "react";

import { Novidade } from '../../types/types';
import BackButton from '../../components/backButton/BackButton';

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
      <BackButton/>
      <div className="news__header">
          <h1>Em Construção...</h1>
      </div>
    </div>
  );
};

export default News