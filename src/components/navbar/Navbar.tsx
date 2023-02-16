import React from 'react';
import { Link } from 'react-router-dom';

import './navbar.scss';

  
const Navbar = () => {

    return (
        <nav className='navbar'>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shows">Exposições </Link></li>
                <li><Link to="/works">Exposições </Link></li>
                <li><Link to="/about">Sobre </Link></li>
                <li><Link to="/news">Exposições </Link></li>
            </ul>
        </nav>
    );
};
  
  export default Navbar;
  
  
  
  