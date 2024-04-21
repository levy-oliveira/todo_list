import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

//Barra de navegação, controla o menu hamburguer e usa o "Link" padrão do router-dom para criar os links
const Nav = () => {
    //Criar o state que controla se a barra está colapsada ou não
    //Apenas quando a largura da tela for pequena
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    //Função do log out
    const handleLogout = async () =>{
        const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

        try{
            await axios.post(`${apiURL}/api/logout`);
            toast.success('Deslogado com sucesso!')
        }
        catch(error){
            console.error('Erro ao deslogar: ', error);
        }
    }

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded={!isNavCollapsed} aria-label="Toggle navigation" onClick={handleNavCollapse}>
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className='nav-item'>
                            <Link className='nav-link' to="/login" onClick={handleLogout}>Logout</Link>
                        </li>
                        <li className="nav-item">
                            {/* Link para a tela de login */}
                            <Link className='nav-link' to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            {/* Link para a tela de registro */}
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  );
};
export default Nav;