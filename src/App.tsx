import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import { Compass, Home, Search, Upload } from 'lucide-react'
import { HomePage } from './pages/HomePage'
import { SafariPage } from './pages/SafariPage'
import { PlayerPage } from './pages/PlayerPage'
import { SubmitPage } from './pages/SubmitPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="side-rail">
          <Link to="/" className="brand" aria-label="ViralSafari home">VS</Link>

          <button type="button" className="rail-icon-btn" aria-label="Search trends">
            <Search size={20} strokeWidth={2.2} />
          </button>

          <nav className="rail-nav" aria-label="Main navigation">
            <NavLink to="/" className={({ isActive }) => `rail-link ${isActive ? 'active' : ''}`} aria-label="Home">
              <Home size={20} strokeWidth={2.2} />
            </NavLink>
            <NavLink to="/safari" className={({ isActive }) => `rail-link ${isActive ? 'active' : ''}`} aria-label="Safari">
              <Compass size={20} strokeWidth={2.2} />
            </NavLink>
            <NavLink to="/submit" className={({ isActive }) => `rail-link ${isActive ? 'active' : ''}`} aria-label="Submit">
              <Upload size={20} strokeWidth={2.2} />
            </NavLink>
          </nav>
        </aside>

        <div className="site-shell">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/safari" element={<SafariPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/submit" element={<SubmitPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/play/:slug" element={<PlayerPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
