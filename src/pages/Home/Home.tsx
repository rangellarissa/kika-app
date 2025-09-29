import './home.scss'

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import { Image } from '../../types/types';

const Home = () => {
    const [data, setData] = useState<Image | null>(null);

    const navigateTo = useNavigate()
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://kika-api.vercel.app/api/imagem');
            const jsonData = await response.json();
            setData(jsonData.find((item: Image) => item.destaque === true));
        }

        fetchData();
    }, []);

    return (
        <div className="home">
            <div className="home__menu">
                <span onClick={() => navigateTo("/")}>KIKA CARVALHO</span>
                <ul>
                    <li><Link to="/works">1. Trabalho / Work </Link></li>
                    <li><Link to="/shows">2. Exposições / Shows </Link></li>
                    <li><Link to="/shows">3. Textos, pesquisas / texts, research </Link></li>
                    <li><Link to="/shows">4. Residências / Residencies </Link></li>
                    <li><Link to="/about">5. Sobre / About </Link></li>
                    <li><Link to="/news">6. Novidades / News </Link></li>
                </ul>
            </div>
            <div className="home__image">
                {data && <img src={data.imageURL} alt="" />}
            </div>
        </div>
    );
};

export default Home