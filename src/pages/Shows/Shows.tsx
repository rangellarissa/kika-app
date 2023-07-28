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

  if(!data){
    return null;
  };

  return (
    <div className="shows">
      <div className="shows__header">
        <h1>Exposições</h1>
        {data.map((item, index) => (
                <div className="shows__content" key={index}>
                    <div className="shows__content--header">
                        <h1>{item.titulo}</h1>
                    </div>
                    <div className="shows__content--text">
                        <p>{item.texto}</p>
                    </div>
                </div>
            ))}

      </div>
    </div>
  );
};

export default Shows