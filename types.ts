export enum UserRole {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export enum IssueStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum IssueCategory {
  FACILITY = 'Facilities (อาคารสถานที่)',
  ELECTRICITY = 'Electricity (ไฟฟ้า/แสงสว่าง)',
  INTERNET = 'Internet/Wi-Fi',
  EQUIPMENT = 'Classroom Equipment (อุปกรณ์การเรียน)',
  TRAFFIC = 'Traffic/Parking (จราจร/ที่จอดรถ)',
  OTHER = 'Other (อื่นๆ)'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export interface IssueLog {
  status: IssueStatus;
  timestamp: string;
  note?: string;
}

export interface Issue {
  id: string;
  trackingCode: string; // New: PSU-2024-XXXXXX
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  status: IssueStatus;
  reporterId: string;
  reporterName: string;
  createdAt: string; // ISO String
  imageUrl?: string;
  logs: IssueLog[]; // New: Timeline history
}

export interface StatsData {
  name: string;
  value: number;
  color: string;
}