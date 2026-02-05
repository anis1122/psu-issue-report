import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Issue, IssueStatus, User, UserRole, IssueLog } from '../types';
import { INITIAL_ISSUES, MOCK_USERS } from '../constants';

interface DataContextType {
  user: User | null;
  issues: Issue[];
  login: (username: string, role: UserRole) => boolean;
  logout: () => void;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'reporterName' | 'status' | 'trackingCode' | 'logs'>) => Issue;
  updateIssueStatus: (id: string, status: IssueStatus) => void;
  deleteIssue: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load user from localStorage if available to keep login session
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('psu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load issues from localStorage, fallback to INITIAL_ISSUES
  const [issues, setIssues] = useState<Issue[]>(() => {
    const savedIssues = localStorage.getItem('psu_issues');
    return savedIssues ? JSON.parse(savedIssues) : INITIAL_ISSUES;
  });

  // Save issues to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('psu_issues', JSON.stringify(issues));
  }, [issues]);

  // Save user to localStorage whenever they change (Login/Logout)
  useEffect(() => {
    if (user) {
        localStorage.setItem('psu_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('psu_user');
    }
  }, [user]);

  const login = (username: string, role: UserRole) => {
    const foundUser = MOCK_USERS.find(u => u.username === username);
    if (foundUser) {
        setUser(foundUser);
        return true;
    }
    const newUser: User = {
        id: `u-${Date.now()}`,
        username,
        fullName: username === 'admin' ? 'System Admin' : 'New User',
        role
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addIssue = (newIssueData: Omit<Issue, 'id' | 'createdAt' | 'reporterName' | 'status' | 'trackingCode' | 'logs'>): Issue => {
    // Generate Tracking Code: PSU-YYYY-XXXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `PSU-${year}-${randomNum}`;
    
    const initialLog: IssueLog = {
        status: IssueStatus.PENDING,
        timestamp: new Date().toISOString(),
        note: 'แจ้งเหตุสำเร็จ / Reported'
    };

    const newIssue: Issue = {
      ...newIssueData,
      id: Date.now().toString(),
      trackingCode: trackingCode,
      createdAt: new Date().toISOString(),
      reporterName: user?.fullName || 'Anonymous',
      status: IssueStatus.PENDING,
      logs: [initialLog]
    };
    
    setIssues(prev => [newIssue, ...prev]);
    return newIssue; // Return the created issue
  };

  const updateIssueStatus = (id: string, status: IssueStatus) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
          const newLog: IssueLog = {
              status: status,
              timestamp: new Date().toISOString(),
              note: status === IssueStatus.IN_PROGRESS ? 'เจ้าหน้าที่รับเรื่อง / In Progress' : 'ดำเนินการเสร็จสิ้น / Resolved'
          };
          
          return { 
              ...issue, 
              status,
              logs: [...(issue.logs || []), newLog] 
          };
      }
      return issue;
    }));
  };

  const deleteIssue = (id: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
  };

  return (
    <DataContext.Provider value={{ user, issues, login, logout, addIssue, updateIssueStatus, deleteIssue }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};