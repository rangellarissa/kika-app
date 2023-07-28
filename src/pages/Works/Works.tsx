import "./works.scss";

import { useEffect, useState } from "react";

export type Show = {
  ano: string,
  id: number,
  imageURL?: string,
  individual: boolean,
  local: string,
  texto: string,
  titulo: string,
}

const Works: React.FC = () => {

  const [data, setData] = useState<Show[]>([]);

  useEffect(() => {
      async function fetchData() {
        const response = await fetch('https://kika-api.vercel.app/api/exposicao');
        const jsonData = await response.json();
        setData(jsonData);
      }
  
      fetchData();
  }, []);

  if(!data){
    return null;
  };

    return (
      <div className="works">
        <div className="works__header">
          <h1>Obras</h1>
        </div>
        {data.map((item, index) => (
                <div className="works__content" key={index}>
                    <div className="works__content--header">
                        <h1>{item.titulo}</h1>
                    </div>
                    <div className="works__content--text">
                        <p>{item.texto}</p>
                    </div>
                </div>
        ))}      
      </div>
    );
};

export default Works