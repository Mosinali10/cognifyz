import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Converter from './pages/Converter'
import PatternGenerator from './pages/PatternGenerator'
import TaskManager from './pages/TaskManager'
import CrudDashboard from './pages/CrudDashboard'
import Game from './pages/Game'
import DataFetcher from './pages/DataFetcher'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"           element={<Home />} />
        <Route path="/converter"  element={<Converter />} />
        <Route path="/patterns"   element={<PatternGenerator />} />
        <Route path="/tasks"      element={<TaskManager />} />
        <Route path="/crud"       element={<CrudDashboard />} />
        <Route path="/game"       element={<Game />} />
        <Route path="/data-fetch" element={<DataFetcher />} />
      </Route>
    </Routes>
  )
}
