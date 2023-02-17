import { Link } from 'react-router-dom';

import './navbar.css';

  
const Navbar = () => {

    return (
        <div id='navbar'>
            <nav className='navbar'>
                <ul>
                    <li><Link to="/">Início</Link></li>
                    <li><Link to="/shows">Exposições </Link></li>
                    <li><Link to="/works">Trabalhos </Link></li>
                    <li><Link to="/about">Sobre </Link></li>
                    <li><Link to="/news">Novidades </Link></li>
                </ul>
            </nav>
        </div>
    );
};
  
export default Navbar;
  
  
  
  