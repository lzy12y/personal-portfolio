import { Routes, Route } from 'react-router-dom'
import EditToggle from './components/EditToggle'
import Hero from './pages/Hero'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Photography from './pages/Photography'
import Video from './pages/Video'
import Ideas from './pages/Ideas'
import Contact from './pages/Contact'
import TsinghuaProject from './pages/TsinghuaProject'

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Hero />} />
        <Route path="tunnel" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/tsinghua" element={<TsinghuaProject />} />
        <Route path="photography" element={<Photography />} />
        <Route path="video" element={<Video />} />
        <Route path="ideas" element={<Ideas />} />
        <Route path="contact" element={<Contact />} />
      </Routes>
      <EditToggle />
    </>
  )
}
