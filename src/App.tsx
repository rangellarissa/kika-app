import { useState } from 'react'
import { 
  BrowserRouter as Router, Route, Routes 
} from 'react-router-dom'

import Navbar from './components/navbar/navbar'

import Home from './pages/Home'
import Shows from './pages/Shows'
import Works from './pages/Works'
import About from './pages/About'
import News from './pages/News'

import './App.css'

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
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
