import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { IssueStatus } from '../types';
import { 
  AlertTriangle, 
  CheckSquare, 
  Clock, 
  MapPin, 
  Repeat, 
  ArrowRight,
  MoreHorizontal,
  Check,
  ClipboardList,
  Trophy,
  TrendingUp,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { issues, updateIssueStatus, user } = useData();
  const navigate = useNavigate();

  // State for Custom Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; id: string | null; title: string}>({
    isOpen: false,
    id: null,
    title: ''
  });

  // Helper: Calculate Duration
  const getDuration = (dateStr: string) => {
    const start = new Date(dateStr).getTime();
    const now = Date.now();
    const diffHours = Math.floor((now - start) / (1000 * 60 * 60));
    
    if (diffHours > 48) return `${Math.floor(diffHours / 24)} วัน`;
    return `${diffHours} ชม.`;
  };

  const isOverdue = (dateStr: string) => {
     const start = new Date(dateStr).getTime();
     const now = Date.now();
     // Assume SLA is 48 hours
     return (now - start) > (1000 * 60 * 60 * 48);
  };

  // Stats Logic
  const totalActive = issues.filter(i => i.status !== IssueStatus.DONE).length;
  const totalDone = issues.filter(i => i.status === IssueStatus.DONE).length;

  // 1. Critical Tasks (Pending > 24h OR specific keywords)
  const criticalTasks = issues.filter(i => 
    i.status !== IssueStatus.DONE && 
    (isOverdue(i.createdAt) || i.title.toLowerCase().includes('fire') || i.title.toLowerCase().includes('power') || i.title.toLowerCase().includes('leak'))
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // 2. My Assigned Tasks (Simulated: In Progress tasks)
  const myTasks = issues.filter(i => i.status === IssueStatus.IN_PROGRESS).slice(0, 5);

  // 3. Over SLA List
  const overSlaTasks = issues.filter(i => i.status !== IssueStatus.DONE && isOverdue(i.createdAt));

  // 4. Tasks by Building (Aggregation)
  const buildingStats = issues.reduce((acc: Record<string, number>, curr) => {
    if (curr.status === IssueStatus.DONE) return acc;
    // Simple logic: extract first part of location string
    const building = curr.location.split(',')[0].split(' ')[0] + ' ' + (curr.location.split(',')[0].split(' ')[1] || '');
    acc[building] = (acc[building] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort buildings by issue count
  const sortedBuildings = Object.entries(buildingStats).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5);

  // 5. Recurring Issues (Mock Logic: Group by Category + Short Location)
  const recurringIssues = [
    { issue: 'Wi-Fi สัญญาณหลุด', loc: 'อาคารเรียนรวม (L)', count: 5 },
    { issue: 'น้ำประปาไม่ไหล', loc: 'หอพัก 3', count: 3 },
    { issue: 'แอร์ไม่เย็น', loc: 'อาคาร 5', count: 3 },
  ];

  // Trigger Modal
  const handleCompleteClick = (id: string, title: string) => {
    setConfirmModal({ isOpen: true, id, title });
  };

  // Confirm Action
  const handleConfirmAction = () => {
    if (confirmModal.id) {
       updateIssueStatus(confirmModal.id, IssueStatus.DONE);
    }
    setConfirmModal({ isOpen: false, id: null, title: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-2">
         <div>
            <h1 className="text-2xl font-bold text-[#00306B]">Maintenance Operation Center</h1>
            <p className="text-gray-500 text-sm">Hello, {user?.fullName || 'Officer'}. Here is your mission today.</p>
         </div>
         <div className="text-right hidden sm:block">
            <div className="text-3xl font-bold text-[#00306B]">{new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="text-xs text-gray-500">{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long'})}</div>
         </div>
      </div>

      {/* NEW: Daily Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#00306B] to-[#00509d] rounded-xl p-5 text-white shadow-md flex items-center justify-between relative overflow-hidden group transition-all hover:shadow-lg">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                    <p className="text-blue-100 text-sm font-medium mb-1">งานที่ต้องทำวันนี้ (Tasks To Do)</p>
                    <h2 className="text-4xl font-bold tracking-tight">{totalActive}</h2>
                    <p className="text-xs text-blue-200 mt-2 flex items-center gap-1 bg-white/10 w-fit px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span> รอการดำเนินการ
                    </p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <ClipboardList className="h-7 w-7 text-white" />
                </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl p-5 text-white shadow-md flex items-center justify-between relative overflow-hidden group transition-all hover:shadow-lg">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                    <p className="text-green-100 text-sm font-medium mb-1">งานเสร็จสิ้นวันนี้ (Completed)</p>
                    <h2 className="text-4xl font-bold tracking-tight">{totalDone}</h2>
                    <p className="text-xs text-green-100 mt-2 flex items-center gap-1 bg-white/10 w-fit px-2 py-1 rounded">
                         <TrendingUp size={12} /> ยอดเยี่ยม! เป้าหมายวันนี้
                    </p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <Trophy className="h-7 w-7 text-white" />
                </div>
            </div>
      </div>

      {/* 1. CRITICAL TASKS (Red Section) */}
      <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-100/50">
            <h3 className="font-bold text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 animate-pulse" /> 
                งานเร่งด่วน (Critical Tasks)
            </h3>
            <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                {criticalTasks.length} งานค้าง
            </span>
        </div>
        <div className="divide-y divide-red-100">
            {criticalTasks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    ไม่มีงานเร่งด่วนในขณะนี้ (Great Job!)
                </div>
            ) : (
                criticalTasks.map(issue => (
                    <div 
                        key={issue.id} 
                        onClick={() => navigate('/issues')}
                        className="px-6 py-4 hover:bg-red-100/50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <MapPin size={14} /> {issue.location}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pl-5 md:pl-0">
                             <div className="text-right">
                                <div className="text-xs text-gray-500">ค้างมาแล้ว</div>
                                <div className="font-bold text-red-600">{getDuration(issue.createdAt)}</div>
                             </div>
                             <button className="bg-white border border-red-200 text-red-700 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                                จัดการ
                             </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. MY ASSIGNED TASKS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-[#00306B] flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" /> 
                    งานของฉันวันนี้ (My Tasks)
                </h3>
                <button className="text-sm text-[#00306B] hover:underline">ดูทั้งหมด</button>
            </div>
            <div className="flex-1 p-2">
                {myTasks.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <CheckSquare size={48} className="mb-2 opacity-20" />
                        <p>ยังไม่มีงานที่มอบหมาย</p>
                     </div>
                ) : (
                    <div className="space-y-1">
                        {myTasks.map(issue => (
                            <div key={issue.id} className="group flex items-center p-3 hover:bg-[#EBF5F8] rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                <button 
                                    onClick={() => handleCompleteClick(issue.id, issue.title)}
                                    className="h-6 w-6 rounded border-2 border-gray-300 flex items-center justify-center mr-4 hover:border-green-500 hover:bg-green-50 transition-colors bg-white group-hover:shadow-sm"
                                    title="คลิกเพื่อยืนยันงานเสร็จสิ้น"
                                >
                                    <Check size={14} className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100" />
                                </button>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-800">{issue.title}</h4>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{issue.location}</span>
                                        <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">In Progress</span>
                                    </div>
                                </div>
                                <button className="text-gray-300 hover:text-[#00306B]">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Quick Add Mock */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                 <input 
                    type="text" 
                    placeholder="+ เพิ่มงานส่วนตัวอย่างย่อ..." 
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00306B]"
                 />
            </div>
        </div>

        {/* 3. OVER SLA (Late Jobs) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-yellow-50">
                <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                    <Clock className="h-5 w-5" /> 
                    งานค้างนานผิดปกติ
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-2">งาน</th>
                            <th className="px-4 py-2">ค้าง</th>
                            <th className="px-4 py-2">อาคาร</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {overSlaTasks.length === 0 ? (
                            <tr><td colSpan={3} className="p-4 text-center text-gray-400">ไม่มีงานค้างเกินกำหนด</td></tr>
                        ) : overSlaTasks.map(issue => (
                            <tr key={issue.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-[120px]" title={issue.title}>
                                    {issue.title}
                                    <div className="mt-1">
                                         <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                                            ⚠ Over SLA
                                         </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-red-600 font-semibold">{getDuration(issue.createdAt)}</td>
                                <td className="px-4 py-3 text-gray-500">{issue.location.split(' ')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 4. TASKS BY BUILDING (Location Plan) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#00306B] flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" /> 
                แผนลงพื้นที่วันนี้ (งานตามอาคาร)
            </h3>
            <div className="space-y-4">
                {sortedBuildings.length === 0 ? (
                    <p className="text-gray-500 text-sm">ไม่มีข้อมูลงานในแต่ละอาคาร</p>
                ) : sortedBuildings.map(([bldg, count], index) => (
                    <div key={bldg} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-gray-700 truncate">{bldg}</div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full bg-[#00306B]" 
                                style={{ width: `${(count / Math.max(...(Object.values(buildingStats) as number[]))) * 100}%` }}
                            ></div>
                        </div>
                        <div className="w-12 text-right font-bold text-[#00306B] text-sm">{count} งาน</div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-[#00306B] border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                ดูแผนที่ทั้งหมด <ArrowRight size={14} />
            </button>
        </div>

        {/* 5. RECURRING ISSUES */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#00306B] flex items-center gap-2 mb-4">
                <Repeat className="h-5 w-5" /> 
                ปัญหาที่เกิดซ้ำ (Recurring Issues)
            </h3>
            <div className="space-y-3">
                {recurringIssues.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#EBF5F8] rounded-lg border border-blue-100/50">
                        <div>
                            <div className="text-sm font-bold text-gray-800">{item.issue}</div>
                            <div className="text-xs text-gray-500">{item.loc}</div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-red-500">{item.count}</span>
                            <span className="text-[10px] text-gray-400">ครั้ง/เดือน</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-800">
                💡 <b>ข้อเสนอแนะ:</b> Wi-Fi ที่อาคาร L มีปัญหาบ่อย ควรตรวจสอบ Router หรือ Access Point ใหม่ทั้งระบบ
            </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200 transform">
                <button 
                    onClick={() => setConfirmModal({...confirmModal, isOpen: false})}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Check size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">ยืนยันงานเสร็จสิ้น?</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        คุณต้องการเปลี่ยนสถานะงาน <br/>
                        <span className="font-semibold text-[#00306B] text-base">"{confirmModal.title}"</span> <br/>
                        เป็น "เสร็จสิ้น" (Done) ใช่หรือไม่?
                    </p>
                    
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setConfirmModal({...confirmModal, isOpen: false})}
                            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button 
                            onClick={handleConfirmAction}
                            className="flex-1 py-2.5 bg-[#00306B] text-white rounded-lg text-sm font-bold hover:bg-[#00224d] shadow-md transition-all transform active:scale-95"
                        >
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};