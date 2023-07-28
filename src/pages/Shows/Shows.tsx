import { useEffect, useState } from "react";

import { Data } from "../../services/postService";

const Shows = () => {

  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
      async function fetchData() {
        const response = await fetch('https://kika-api.vercel.app/api/exposicao');
        const jsonData = await response.json();
        setData(jsonData);
      }
  
      fetchData();
  }, []);

  console.log(data);

  return (
    <div className="shows">
      <div className="shows__header">
        <h1>Exposições</h1>
      </div>
    </div>
  );
};

export default Shows