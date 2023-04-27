import { useEffect, useState } from "react";
import {Data} from "../../services/postService";

import './about.scss'

const About = () => {

    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        async function fetchData() {
          const response = await fetch('https://kika-api.vercel.app/example.json');
          const jsonData = await response.json();
          setData(jsonData.data);
        }
    
        fetchData();
      }, []);
    
      console.log(data); 

    return (
        <div className="aboutPage">
            {data.map((item, index) => (
                <div className="aboutPage__content" key={index}>
                    <div className="aboutPage__content--header">
                        <h1>{item.name}</h1>
                        <p>Vitória, ES, Brasil, 1992</p>
                        <p>Vive e trabalha no Rio de Janeiro, RJ, Brasil</p>                        
                    </div>
                    <div className="aboutPage__content--text">
                        <p>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default About