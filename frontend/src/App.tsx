
import './App.css'
import NavBar from './components/NavBar/NavBar'
import Jams from './components/JamsContainer/JamsContainer'
import Plans from './components/PlansContainer/PlansContainer'

function App() {

  return (
    <>
    <NavBar />
    <div className="main-body">
      <Jams />
      <Plans />
    </div>
    </>
  )
}

export default App
