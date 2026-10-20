import './admin.scss'

import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { FaBars, FaUser } from 'react-icons/fa'
import { useAuth } from './AuthContext'
import { useEffect, useState } from 'react'

export const adminTabs = [
    { path: 'inicio', label: 'início' },
    { path: 'exposicoes', label: 'exposições' },
    { path: 'trabalhos', label: 'trabalhos' },
    { path: 'sobre', label: 'sobre' },
    { path: 'novidades', label: 'novidades' },
    { path: 'residencias', label: 'residências' },
    { path: 'pesquisa', label: 'pesquisa' },
    { path: 'projetos', label: 'projetos especiais' },
]

const AdminLayout = () => {
    const { signOut } = useAuth()
    const navigateTo = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        document.title = 'Gestão de Conteúdo | Kika Carvalho'
    }, [])

    const handleSignOut = async () => {
        await signOut()
        navigateTo('/login')
    }

    return (
        <div className="admin">
            <header className="admin__header">
                <h1>Gestão de Conteúdo</h1>
                <div className="admin__header-actions">
                    <button className="admin__logout" aria-label="Sair" onClick={handleSignOut}>
                        <span className="admin__logout-label">Sair</span>
                        <FaUser aria-hidden />
                    </button>
                    <button
                        className="admin__menu-toggle"
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                        aria-controls="admin-tabs"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <FaBars aria-hidden />
                    </button>
                </div>
            </header>

            <nav id="admin-tabs" className={`admin__tabs${menuOpen ? ' admin__tabs--open' : ''}`}>
                {adminTabs.map((tab) => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => (isActive ? 'admin__tab admin__tab--active' : 'admin__tab')}
                    >
                        {tab.label}
                    </NavLink>
                ))}
            </nav>

            <main className="admin__content">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
