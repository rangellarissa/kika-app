import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { Session } from '@supabase/supabase-js'
import { apiFetch } from '../lib/api'
import { supabase } from '../lib/supabase'

// loading: still checking | signedOut: no session | admin: allowed | forbidden: signed in, not an admin
export type AuthStatus = 'loading' | 'signedOut' | 'admin' | 'forbidden'

type AuthContextType = {
    status: AuthStatus
    session: Session | null
    signIn: (email: string, password: string) => Promise<string | null>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [status, setStatus] = useState<AuthStatus>('loading')

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            if (!data.session) setStatus('signedOut')
        })

        const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession)
            if (!newSession) setStatus('signedOut')
        })

        return () => data.subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (!session) return

        let cancelled = false
        setStatus('loading')

        apiFetch('/api/auth/me')
            .then(() => !cancelled && setStatus('admin'))
            .catch(() => !cancelled && setStatus('forbidden'))

        return () => {
            cancelled = true
        }
    }, [session?.user.id])

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return error ? error.message : null
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ status, session, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}
