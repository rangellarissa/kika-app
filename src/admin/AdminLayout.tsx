import './admin.scss'

import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { FaUser } from 'react-icons/fa'
import { useAuth } from './AuthContext'
import { useEffect } from 'react'

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
                <button className="admin__logout" onClick={handleSignOut}>
                    <span>Sair</span>
                    <FaUser aria-hidden />
                </button>
            </header>

            <nav className="admin__tabs">
                {adminTabs.map((tab) => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
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
