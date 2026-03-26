import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
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
      <div className="site-shell">
        <header className="site-header">
          <Link to="/" className="brand">ViralSafari</Link>
          <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/safari">Safari</NavLink>
            <NavLink to="/submit">Submit</NavLink>
            <NavLink to="/login">Login</NavLink>
          </nav>
        </header>

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
    </BrowserRouter>
  )
}

export default App
