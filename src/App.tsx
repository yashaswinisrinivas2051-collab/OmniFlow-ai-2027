import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/routes/login';
import { DashboardPage } from '@/routes/_app/dashboard';
import { InboxPage } from '@/routes/_app/inbox';
import { LeadsPage } from '@/routes/_app/leads';
import { AnalyticsPage } from '@/routes/_app/analytics';
import { AutomationsPage } from '@/routes/_app/automations';
import { VoicePage } from '@/routes/_app/voice';
import { SettingsPage } from '@/routes/_app/settings';
import { NotFoundPage } from '@/routes/__root';

function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthed = typeof window !== 'undefined' && localStorage.getItem('omniflow_auth');
  return isAuthed ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="automations" element={<AutomationsPage />} />
          <Route path="voice" element={<VoicePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster theme="dark" position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}

export default App;
