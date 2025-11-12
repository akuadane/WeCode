
import './App.css'
import NavBar from './components/NavBar/NavBar'
import HomePage from './pages/HomePage'
import JamPage from './pages/JamPage'
import DashboardPage from './pages/Dashboard'
import PlanPage from './pages/PlanPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
  
       <Router>
    <NavBar />
    <div className="main-body">
   
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jam/:id" element={<JamPage />} />
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/plan/:id" element={<PlanPage />} />
        </Routes>
      
    </div>  
    </Router>
 
  )
}

export default App
