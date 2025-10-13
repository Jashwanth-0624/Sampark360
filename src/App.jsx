import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/Layout.jsx'
import Dashboard from '@/Pages/Dashboard.jsx'
import SamparkDashboard from '@/Pages/SamparkDashboard.jsx'
import AgencyRegistry from '@/Pages/AgencyRegistry.jsx'
import Approvals from '@/Pages/Approvals.jsx'
import Communications from '@/Pages/Communications.jsx'
import EvidenceGallery from '@/Pages/EvidenceGallery.jsx'
import FundFlow from '@/Pages/FundFlow.jsx'
import Help from '@/Pages/Help.jsx'
import ProjectsList from '@/Pages/ProjectsList.jsx'
import ProjectsMap from '@/Pages/ProjectsMap.jsx'
import Reports from '@/Pages/Reports.jsx'
import TaskBoard from '@/Pages/TaskBoard.jsx'
import AdminConsole from '@/Pages/AdminConsole.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sampark" element={<SamparkDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agency-registry" element={<AgencyRegistry />} />
        <Route path="/projects-map" element={<ProjectsMap />} />
        <Route path="/projects-list" element={<ProjectsList />} />
        <Route path="/fund-flow" element={<FundFlow />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/task-board" element={<TaskBoard />} />
        <Route path="/evidence-gallery" element={<EvidenceGallery />} />
        <Route path="/communications" element={<Communications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/help" element={<Help />} />
        <Route path="/admin-console" element={<AdminConsole />} />
      </Routes>
    </Layout>
  )
}
