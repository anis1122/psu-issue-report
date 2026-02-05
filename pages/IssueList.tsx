import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { IssueStatus, IssueCategory, UserRole } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Filter, Calendar, MapPin, User as UserIcon, ImageOff } from 'lucide-react';

export const IssueList: React.FC = () => {
  const { issues, user, updateIssueStatus, deleteIssue } = useData();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filterStatus === 'ALL' || issue.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || issue.category === filterCategory;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-[#00306B]">Issue List</h1>
            <p className="text-gray-500 text-sm">Track and manage university issues</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
                type="text" 
                placeholder="Search topic or location..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-[#00306B] focus:border-[#00306B] bg-white text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4 mr-2" /> Filters:
        </div>
        <select 
            className="text-sm border-gray-300 rounded-md focus:ring-[#00306B] focus:border-[#00306B] bg-white text-gray-900"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
        >
            <option value="ALL">All Status</option>
            {Object.values(IssueStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <select 
            className="text-sm border-gray-300 rounded-md focus:ring-[#00306B] focus:border-[#00306B] bg-white text-gray-900"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
        >
            <option value="ALL">All Categories</option>
            {Object.values(IssueCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No issues found matching your criteria.</p>
            </div>
        ) : (
            filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-gray-100 relative group">
                        {issue.imageUrl ? (
                            <img 
                              src={issue.imageUrl} 
                              alt={issue.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              onError={(e) => {
                                // Fallback image if source fails
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&q=80&w=800';
                                e.currentTarget.onerror = null; // Prevent infinite loop
                              }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                <ImageOff className="h-8 w-8 mb-1 opacity-50" />
                                <span className="text-xs">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-xs font-semibold text-[#00306B] bg-[#EBF5F8] px-2 py-1 rounded mb-2 inline-block">
                                    {issue.category}
                                </div>
                                <StatusBadge status={issue.status} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{issue.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <span className="flex items-center"><MapPin className="h-3 w-3 mr-1"/> {issue.location}</span>
                                <span className="flex items-center"><UserIcon className="h-3 w-3 mr-1"/> {issue.reporterName}</span>
                                <span className="flex items-center"><Calendar className="h-3 w-3 mr-1"/> {new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        {(user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 justify-end">
                                <span className="text-xs text-gray-400 self-center mr-auto">Update Status:</span>
                                {issue.status !== IssueStatus.PENDING && (
                                     <button 
                                        onClick={() => updateIssueStatus(issue.id, IssueStatus.PENDING)}
                                        className="px-3 py-1 text-xs border border-yellow-300 text-yellow-700 rounded hover:bg-yellow-50"
                                     >Pending</button>
                                )}
                                {issue.status !== IssueStatus.IN_PROGRESS && (
                                    <button 
                                        onClick={() => updateIssueStatus(issue.id, IssueStatus.IN_PROGRESS)}
                                        className="px-3 py-1 text-xs border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
                                     >In Progress</button>
                                )}
                                {issue.status !== IssueStatus.DONE && (
                                    <button 
                                        onClick={() => updateIssueStatus(issue.id, IssueStatus.DONE)}
                                        className="px-3 py-1 text-xs border border-green-300 text-green-700 rounded hover:bg-green-50"
                                     >Done</button>
                                )}
                                {user.role === UserRole.ADMIN && (
                                    <button 
                                        onClick={() => { if(confirm('Are you sure?')) deleteIssue(issue.id) }}
                                        className="px-3 py-1 text-xs border border-red-300 text-red-700 rounded hover:bg-red-50 ml-2"
                                    >Delete</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};