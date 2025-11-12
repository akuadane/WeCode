
import './App.css'
import NavBar from './components/NavBar/NavBar'
import HomePage from './pages/HomePage'
import JamPage from './pages/JamPage'
import DashboardPage from './pages/Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <NavBar />
    <div className="main-body">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jam/:id" element={<JamPage />} />
          <Route path="/dashboard" element={<DashboardPage/>}/>
        </Routes>
      </Router>
    </div>  
    </>
  )
}

export default App
