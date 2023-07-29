import "./works.scss";

import { useEffect, useState } from "react";

import { Obra } from "../../types/types";

const Works: React.FC = () => {

  const [data, setData] = useState<Obra[]>([]);

  useEffect(() => {
      async function fetchData() {
        const response = await fetch('https://kika-api.vercel.app/api/obra');
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
        <div className="works__content">
          {data.map((item, index) => (
            <img src={item.imageURL} alt={item.titulo} key={index}/>
          ))}      
        </div>
      </div>
    );
};

export default Works