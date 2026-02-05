import { Issue, IssueCategory, IssueStatus, User, UserRole } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'student',
    fullName: 'Somchai Student',
    role: UserRole.STUDENT
  },
  {
    id: 'u2',
    username: 'staff',
    fullName: 'Ajarn Somsri',
    role: UserRole.STAFF
  },
  {
    id: 'u3',
    username: 'admin',
    fullName: 'Admin System',
    role: UserRole.ADMIN
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: '1',
    trackingCode: 'PSU-2024-001001',
    title: 'Air conditioner broken in Room 301',
    description: 'The air conditioner is making a loud noise and not cooling.',
    category: IssueCategory.FACILITY,
    location: 'Building 1, Room 301',
    status: IssueStatus.PENDING,
    reporterId: 'u1',
    reporterName: 'Somchai Student',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1574966739987-65e38a0b024e?q=80&w=800&auto=format&fit=crop',
    logs: [
      { status: IssueStatus.PENDING, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Issue reported' }
    ]
  },
  {
    id: '2',
    trackingCode: 'PSU-2024-001002',
    title: 'Wi-Fi keeps dropping at Library',
    description: 'Cannot connect to PSU-WiFi-5G on the 2nd floor.',
    category: IssueCategory.INTERNET,
    location: 'Main Library, 2nd Floor',
    status: IssueStatus.IN_PROGRESS,
    reporterId: 'u1',
    reporterName: 'Somchai Student',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bbc7c?q=80&w=800&auto=format&fit=crop',
    logs: [
      { status: IssueStatus.PENDING, timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Issue reported' },
      { status: IssueStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 43200000).toISOString(), note: 'Technician assigned' }
    ]
  },
  {
    id: '3',
    trackingCode: 'PSU-2024-000555',
    title: 'Projector bulb burnout',
    description: 'The projector in the large lecture hall is very dim.',
    category: IssueCategory.EQUIPMENT,
    location: 'Engineering Bldg, Hall A',
    status: IssueStatus.DONE,
    reporterId: 'u2',
    reporterName: 'Ajarn Somsri',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    logs: [
      { status: IssueStatus.PENDING, timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), note: 'Issue reported' },
      { status: IssueStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Ordered new bulb' },
      { status: IssueStatus.DONE, timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Replaced bulb' }
    ]
  },
  {
    id: '4',
    trackingCode: 'PSU-2024-001234',
    title: 'Motorbikes blocking Canteen entrance',
    description: 'Many motorbikes are parked in the no-parking zone blocking the entrance to the canteen. Please arrange more parking space.',
    category: IssueCategory.TRAFFIC,
    location: 'Student Canteen (Rong Chang)',
    status: IssueStatus.PENDING,
    reporterId: 'u1',
    reporterName: 'Somchai Student',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1591026046467-a2f029311394?q=80&w=800&auto=format&fit=crop',
    logs: [
       { status: IssueStatus.PENDING, timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'Issue reported' }
    ]
  }
];