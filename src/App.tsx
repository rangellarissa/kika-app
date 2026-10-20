import './App.scss'

import { ReactElement } from 'react'

import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes
} from 'react-router-dom'

import About from './pages/About/About'
import Home from './pages/Home/Home'
import Message from './pages/Message/Message'
import News from './pages/News/News'
import Shows from './pages/Shows/Shows'
import Works from './pages/Works/Works'
import Residencies from './pages/Residencies/Residencies'
import Research from './pages/Research/Research'
import Projects from './pages/Projects/projects'
import ShowDetails from './pages/Shows/ShowDetails/ShowDetails'
import Login from './pages/Login/Login'
import { AuthProvider } from './admin/AuthContext'
import ProtectedRoute from './admin/ProtectedRoute'
import AdminLayout, { adminTabs } from './admin/AdminLayout'
import AdminPlaceholder from './admin/AdminPlaceholder'
import Novidades from './admin/pages/Novidades/Novidades'
import Sobre from './admin/pages/Sobre/Sobre'

// Admin tabs that already have a real page; the others still show the placeholder.
const adminPages: Record<string, ReactElement> = {
    novidades: <Novidades />,
    sobre: <Sobre />,
}

function App() {

    return (
        <div className="App">
            <Router>
                <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shows" element={<Shows />} />
                    <Route path="/shows/:slug" element={<ShowDetails />} />
                    <Route path="/works" element={<Works />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/residencies" element={<Residencies />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/special-projects" element={<Projects />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/message" element={<Message />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<ProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route index element={<Navigate to="inicio" replace />} />
                            {adminTabs.map((tab) => (
                                <Route key={tab.path} path={tab.path} element={adminPages[tab.path] ?? <AdminPlaceholder title={tab.label} />} />
                            ))}
                        </Route>
                    </Route>
                </Routes>
                </AuthProvider>

            </Router>

        </div>
    )
}

export default App
