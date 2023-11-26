import { Fornecedor } from './components/Fornecedor'
import Login from './components/Login'
import { Local } from './components/Local'
import { Item } from './components/Item'
import './styles/global.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

//COMPONENTE FUNCIONAL
function App() {
  return (
    <Router>
      <div className="flex">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Item" element={<Item />} />
          <Route path="/local" element={<Local />}/>
          <Route path="/fornecedor" element={<Fornecedor />}/>
        </Routes>
      </div>
    </Router>
  )
}
export default App
