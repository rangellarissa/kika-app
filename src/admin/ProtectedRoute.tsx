import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './AuthContext'

const ProtectedRoute = () => {
    const { status } = useAuth()

    if (status === 'loading') return <p>Carregando...</p>
    if (status !== 'admin') return <Navigate to="/login" replace />

    return <Outlet />
}

export default ProtectedRoute
