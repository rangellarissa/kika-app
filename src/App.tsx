import { useState } from 'react'
import { 
  BrowserRouter as Router, Route, Routes 
} from 'react-router-dom'

import Navbar from './components/navbar/Navbar'
import Home from './pages/Home/Home'
import Shows from './pages/Shows/Shows'
import Works from './pages/Works/Works'
import About from './pages/About/About'
import News from './pages/News/News'

import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/works" element={<Works />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
        </Routes>

      </Router>
      
    </div>
  )
}

export default App
