import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import CardListPage from './pages/CardListPage'
import RaidStatementPage from './pages/RaidStatementPage'
import ClanPage from './pages/ClanPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="cards" element={<CardListPage />} />
        <Route path="raids" element={<RaidStatementPage />} />
        <Route path="clan" element={<ClanPage />} />
      </Route>
    </Routes>
  )
}
