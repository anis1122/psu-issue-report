import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ReportIssue } from './pages/ReportIssue';
import { IssueList } from './pages/IssueList';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} closeMobile={() => setSidebarOpen(false)} />
      
      <main className={`flex-1 transition-all duration-300 pt-20 pb-8 px-4 sm:px-6 lg:px-8 
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
      </main>
      
      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  );
};

const AppRoutes = () => {
    const { user } = useData();
    
    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/issues'} />} />
            
            <Route path="/dashboard" element={
                <ProtectedLayout>
                    {user?.role === 'ADMIN' ? <Dashboard /> : <Navigate to="/issues" />}
                </ProtectedLayout>
            } />
            
            <Route path="/report" element={
                <ProtectedLayout>
                    <ReportIssue />
                </ProtectedLayout>
            } />
            
            <Route path="/issues" element={
                <ProtectedLayout>
                    <IssueList />
                </ProtectedLayout>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <AppRoutes />
      </Router>
    </DataProvider>
  );
};

export default App;