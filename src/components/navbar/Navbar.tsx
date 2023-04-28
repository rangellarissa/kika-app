import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

import './navbar.scss';
import { useState } from 'react';

  
const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const navigateTo = useNavigate()

    return (
        <div id='navbar'>
            <nav className='navbar'>
                <span onClick={() => navigateTo("/")}>KIKA CARVALHO</span>
                <ul className='navbar__desktop'>
                    <li><Link to="/">Início</Link></li>
                    <li><Link to="/shows">Exposições </Link></li>
                    <li><Link to="/works">Trabalhos </Link></li>
                    <li><Link to="/about">Sobre </Link></li>
                    <li><Link to="/news">Novidades </Link></li>
                </ul>
                <ul className='navbar__mobile'>
                    <li><button className="navbar__mobile--menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                            <FaBars />
                        </button>
                    </li>
                </ul>
                {menuOpen && (
                    <div className="navbar__mobile--menu-list">
                        <ul>
                            <li><Link to="/shows">Exposições </Link></li>
                            <li><Link to="/works">Trabalhos </Link></li>
                            <li><Link to="/about">Sobre </Link></li>
                            <li><Link to="/news">Novidades </Link></li>

                        </ul>
                    </div>
                )}
            </nav>
        </div>
    );
};
  
export default Navbar;
  
  
  
  