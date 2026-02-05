import React from 'react';
import { IssueStatus } from '../types';

export const StatusBadge: React.FC<{ status: IssueStatus }> = ({ status }) => {
  switch (status) {
    case IssueStatus.PENDING:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          Pending
        </span>
      );
    case IssueStatus.IN_PROGRESS:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          In Progress
        </span>
      );
    case IssueStatus.DONE:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          Done
        </span>
      );
    default:
      return null;
  }
};