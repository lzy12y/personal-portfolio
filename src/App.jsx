import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import TsinghuaProject from './pages/TsinghuaProject'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/tsinghua" element={<TsinghuaProject />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}
