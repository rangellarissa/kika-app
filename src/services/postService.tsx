import React, { useState, useEffect } from 'react';

export type Data = {
  name: string;
  description: string;
  date: string;
};

function postService() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:4000/example.json');
      const jsonData = await response.json();
      setData(jsonData);
    }

    fetchData();
  }, []);

  return data;
}

export default postService;
