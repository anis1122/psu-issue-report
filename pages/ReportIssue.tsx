import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { IssueCategory, Issue } from '../types';
import { useNavigate } from 'react-router-dom';
import { MapPin, UploadCloud, CheckCircle, Copy, ArrowRight, FileText } from 'lucide-react';

export const ReportIssue: React.FC = () => {
  const { addIssue } = useData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successIssue, setSuccessIssue] = useState<Issue | null>(null); // State to store created issue

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: IssueCategory.FACILITY,
    location: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, imageUrl: url });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
        const createdIssue = addIssue({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            location: formData.location,
            reporterId: 'current-user-id',
            imageUrl: formData.imageUrl || 'https://picsum.photos/400/300?random=99',
        });
        
        setLoading(false);
        setSuccessIssue(createdIssue); // Show success modal instead of navigating
    }, 1000);
  };

  const copyToClipboard = () => {
    if (successIssue) {
      navigator.clipboard.writeText(successIssue.trackingCode);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#00306B]">Report an Issue</h1>
        <p className="text-gray-500">Found something broken? Let us know.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#EBF5F8] px-6 py-4 border-b border-gray-200">
             <h3 className="font-semibold text-[#00306B] flex items-center gap-2">
                <AlertCircleIcon /> Issue Details
             </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Subject</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Air conditioner not working"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00306B] focus:ring-[#00306B] p-3 border bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00306B] focus:ring-[#00306B] p-3 border bg-white text-gray-900"
              >
                {Object.values(IssueCategory).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Building, Floor, Room No."
                    className="w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#00306B] focus:ring-[#00306B] p-3 border bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00306B] focus:ring-[#00306B] p-3 border bg-white text-gray-900"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo Evidence</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#00306B] transition-colors bg-gray-50">
                    <div className="space-y-1 text-center">
                        {formData.imageUrl ? (
                             <div className="relative">
                                <img src={formData.imageUrl} alt="Preview" className="max-h-64 rounded-md mx-auto" />
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, imageUrl: ''})}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                >
                                    Remove
                                </button>
                             </div>
                        ) : (
                            <>
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#00306B] hover:text-blue-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button
                type="button"
                onClick={() => navigate('/issues')}
                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
             >
                Cancel
             </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#00306B] hover:bg-[#00224d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00306B] transition-all
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successIssue && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00306B]/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#00306B] mb-2">Report Submitted!</h2>
                <p className="text-gray-500 mb-6">Thank you for helping us maintain the campus.</p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Your Tracking Code</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-mono font-bold text-[#00306B] tracking-wide">
                            {successIssue.trackingCode}
                        </span>
                        <button 
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-[#00306B]"
                            title="Copy Code"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-red-500 mt-3 flex items-center justify-center gap-1">
                        <FileText size={12} /> Please save this code to check status later!
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => navigate('/issues')}
                        className="w-full py-3 bg-[#00306B] text-white rounded-lg font-bold hover:bg-[#00224d] transition-all flex items-center justify-center gap-2"
                    >
                        View My Issues <ArrowRight size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            setSuccessIssue(null);
                            navigate('/issues');
                        }}
                        className="w-full py-3 text-gray-500 hover:text-gray-800 transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
             </div>
         </div>
      )}
    </div>
  );
};

const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
)