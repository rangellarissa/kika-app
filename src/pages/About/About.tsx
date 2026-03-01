import './about.scss'

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Artist } from '../../types/types';

const About = () => {

    const [data, setData] = useState<Artist>();
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://kika-api.vercel.app/api/artista/1');
            const jsonData = await response.json();
            setData(jsonData);
        }

        fetchData();
    }, []);

    if(!data){
    return null;
    };

    return (
        <div className="aboutPage">
                <div className="aboutPage__content" >
                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        <span>←</span>
                    </button>
                    <div className="aboutPage__content--header">
                        <h1>{data.name}</h1>
                        <p>Vitória - ES, Brasil, 1992</p>
                        <p>Vive e trabalha no Rio de Janeiro, RJ, Brasil</p>                        
                    </div>
                    <div className="aboutPage__content--text">
                        <p>{data.description}</p>
                        <p>{data.date}</p>
                    </div>
                </div>
        </div>
    );
};

export default About