import './login.scss'

import { FormEvent, useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../admin/AuthContext'

const Login = () => {
    const { status, signIn, signOut } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        document.title = 'Login | Kika Carvalho'
    }, [])

    if (status === 'admin') return <Navigate to="/admin" replace />

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setError(null)
        setSubmitting(true)
        const message = await signIn(email, password)
        if (message) setError('Email ou senha inválidos.')
        setSubmitting(false)
    }

    if (status === 'forbidden') {
        return (
            <div className="login">
                <h1>Login</h1>
                <p>Esta conta não tem acesso à área de gestão.</p>
                <button className="login__submit" onClick={signOut}>Sair</button>
            </div>
        )
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form className="login__form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="login__error" role="alert">{error}</p>}

                <button className="login__submit" type="submit" disabled={submitting}>
                    {submitting ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}

export default Login
