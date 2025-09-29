import './App.scss'

import {
    Route,
    BrowserRouter as Router,
    Routes
} from 'react-router-dom'

import About from './pages/About/About'
import Home from './pages/Home/Home'
import Message from './pages/Message/Message'
import Navbar from './components/navbar/Navbar'
import News from './pages/News/News'
import Shows from './pages/Shows/Shows'
import Works from './pages/Works/Works'
import { useState } from 'react'

function App() {

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shows" element={<Shows />} />
                    <Route path="/works" element={<Works />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/message" element={<Message />} />
                </Routes>

            </Router>

        </div>
    )
}

export default App
