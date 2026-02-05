import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UserRole, Issue, IssueStatus } from '../types';
import { Lock, User as UserIcon, LogIn, Search, Globe, X, AlertTriangle, Wrench, CheckCircle2, Package, MapPin, Clock, Calendar } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, issues } = useData();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  
  // Tracking State
  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState<Issue | null>(null);
  const [trackError, setTrackError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [language, setLanguage] = useState<'th' | 'en'>('th');

  const roleLabels: Record<UserRole, string> = {
    [UserRole.STUDENT]: language === 'th' ? 'นักศึกษา' : 'Student',
    [UserRole.STAFF]: language === 'th' ? 'บุคลากร' : 'Staff',
    [UserRole.ADMIN]: language === 'th' ? 'ผู้ดูแลระบบ' : 'Admin',
  };

  const text = {
    th: {
      systemName: 'ระบบแจ้งปัญหาออนไลน์',
      subSystem: 'CAMPUS ISSUE TRACKING',
      university: 'มหาวิทยาลัยสงขลานครินทร์',
      online24: 'ระบบออนไลน์ 24 ชั่วโมง',
      categoryHeader: 'แจ้งเหตุ - แจ้งซ่อม - ร้องเรียน',
      mainTitle: 'ระบบแจ้งปัญหาออนไลน์',
      subTitle: 'เพื่อมหาวิทยาลัยที่น่าอยู่ของเรา',
      loginBtn: 'เข้าสู่ระบบด้วย PSU Passport',
      trackBtn: 'ติดตามสถานะงานแจ้ง',
      loginHeader: 'เข้าสู่ระบบ',
      loginSub: 'กรุณากรอกข้อมูล PSU Passport ของคุณ',
      username: 'ชื่อผู้ใช้งาน',
      password: 'รหัสผ่าน',
      submitLogin: 'เข้าสู่ระบบ',
      
      
      // Tracking
      trackHeader: 'ติดตามสถานะงานแจ้ง',
      trackSub: 'กรอกรหัสติดตาม (Tracking Code) เพื่อตรวจสอบสถานะ',
      trackPlaceholder: 'เช่น PSU-2024-001234',
      trackNotFound: 'ไม่พบข้อมูลเลขที่แจ้ง กรุณาตรวจสอบความถูกต้อง',
      status: 'สถานะปัจจุบัน',
      timeline: 'ไทม์ไลน์การดำเนินการ'
    },
    en: {
      systemName: 'Smart Report',
      subSystem: 'CAMPUS ISSUE TRACKING',
      university: 'Prince of Songkla University',
      online24: 'Online System 24/7',
      categoryHeader: 'Report Issue - Repair - Complaint',
      mainTitle: 'Issue Reporting System',
      subTitle: 'For our better campus life',
      loginBtn: 'Login with PSU Passport',
      trackBtn: 'Track Issue Status',
      loginHeader: 'Login',
      loginSub: 'Please enter your PSU Passport',
      username: 'Username',
      password: 'Password',
      submitLogin: 'Sign In',
      demo: 'Demo Accounts:',

      // Tracking
      trackHeader: 'Track Issue Status',
      trackSub: 'Enter Tracking Code to check status',
      trackPlaceholder: 'e.g. PSU-2024-001234',
      trackNotFound: 'Tracking code not found. Please check again.',
      status: 'Current Status',
      timeline: 'Timeline'
    }
  };

  const t = text[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username, role);
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);

    const code = trackCode.trim();
    if(!code) return;

    const found = issues.find(i => i.trackingCode && i.trackingCode.toLowerCase() === code.toLowerCase());
    
    if (found) {
        setTrackResult(found);
    } else {
        setTrackError(t.trackNotFound);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  // Helper for Status UI in Timeline
  const getStatusColor = (status: IssueStatus) => {
      switch(status) {
          case IssueStatus.DONE: return 'bg-green-500 border-green-500';
          case IssueStatus.IN_PROGRESS: return 'bg-blue-500 border-blue-500';
          default: return 'bg-yellow-400 border-yellow-400';
      }
  };

  const getStatusLabel = (status: IssueStatus) => {
    if (status === IssueStatus.DONE) return <span className="text-green-600 font-bold">Resolved (เสร็จสิ้น)</span>;
    if (status === IssueStatus.IN_PROGRESS) return <span className="text-blue-600 font-bold">In Progress (กำลังดำเนินการ)</span>;
    return <span className="text-yellow-600 font-bold">Pending (รอดำเนินการ)</span>;
  };

  return (
    <div className="min-h-screen bg-[#9EDEEA] flex flex-col relative font-[Prompt] text-[#00306B] overflow-hidden">
        {/* Header - Increased height and logo size */}
        <header className="bg-white/90 backdrop-blur-sm py-4 px-6 md:px-12 flex justify-between items-center shadow-sm fixed w-full top-0 z-40 h-24 md:h-28 transition-all">
           {/* Logo area */}
           <div className="flex items-center">
              <img 
  src="/logo.png"
  alt="PSU IRS Logo"
  className="h-25 md:h-37 w-48 md:w-56 object-contain"
/>

           </div>
           
           <button 
             onClick={toggleLanguage}
             className="flex items-center gap-2 text-[#00306B] hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200"
           >
             <Globe className="w-5 h-5" />
             <span className="text-sm font-semibold">{language.toUpperCase()}</span>
           </button>
        </header>

        {/* Main Content - Adjusted padding top for larger header */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 pt-28 md:pt-32 pb-40">
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-white/50 shadow-sm animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-[#00306B]">{t.online24}</span>
            </div>
            
            <h2 className="text-lg md:text-xl text-gray-600 mb-2 font-medium tracking-wide">{t.categoryHeader}</h2>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-center text-[#00306B] drop-shadow-sm">{t.mainTitle}</h1>
            <p className="text-xl md:text-2xl mb-12 text-[#00306B]/80 text-center font-light">{t.subTitle}</p>

            <div className="w-full max-w-[400px] space-y-5">
                <button 
                   onClick={() => setShowLoginForm(true)}
                   className="group w-full bg-[#00306B] text-white h-16 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#00224d] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4 text-lg"
                >
                    <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold tracking-widest border border-white/30 group-hover:bg-white/30 transition-colors">
                        PSU
                    </div>
                    <span className="font-semibold">{t.loginBtn}</span>
                </button>

                <button 
                    onClick={() => {
                        setShowTrackModal(true);
                        setTrackResult(null);
                        setTrackCode('');
                    }}
                    className="w-full bg-[#D0F4F9] text-[#00306B] h-14 rounded-lg shadow-md hover:bg-[#b8ecf3] transition-all flex items-center justify-center gap-3 text-lg font-medium border border-[#bcecf3]"
                >
                    <Search className="w-5 h-5 opacity-70" />
                    <span>{t.trackBtn}</span>
                </button>
            </div>
        </main>

        {/* Bottom Image Section */}
        <div className="absolute bottom-0 left-0 w-full h-[35vh] md:h-[50vh] pointer-events-none flex justify-center items-end z-0">
             <div className="absolute inset-0 bg-gradient-to-t from-[#9EDEEA] via-transparent to-transparent z-10"></div>
             <img 
                src="/background.jpg" 
                className="h-full w-full object-cover object-center opacity-80 mask-image-gradient"
                style={{ maskImage: 'linear-gradient(to top, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)' }}
                alt="Campus" 
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop";
                }}
             />
             
             {/* Decor Elements (Cards) - Same as before */}
             <div className="absolute bottom-[20%] left-[10%] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl hidden lg:block animate-bounce" style={{ animationDuration: '3.5s' }}>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0"><AlertTriangle size={20} /></div>
                    <div>
                        <div className="text-xs font-bold text-gray-800 mb-1">New Issue Reported</div>
                        <div className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mb-1">Building 5 • Wi-Fi</div>
                    </div>
                </div>
             </div>
             
             <div className="absolute bottom-[40%] right-[12%] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl hidden lg:block animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><Wrench size={20} /></div>
                    <div>
                        <div className="text-xs font-bold text-gray-800">Maintenance</div>
                        <div className="text-[10px] text-gray-500">Air Conditioner - Room 301</div>
                    </div>
                </div>
             </div>
        </div>

        {/* Login Modal */}
        {showLoginForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00306B]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
                    <button 
                        onClick={() => setShowLoginForm(false)} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00306B] rounded-full mb-4 shadow-lg">
                            <span className="text-white text-2xl font-bold">PSU</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#00306B]">{t.loginHeader}</h2>
                        <p className="text-gray-500 text-sm mt-1">{t.loginSub}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div className="bg-gray-100 p-1 rounded-lg flex">
                            {(Object.keys(UserRole) as Array<keyof typeof UserRole>)
                                .filter(r => UserRole[r] !== UserRole.STAFF)
                                .map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(UserRole[r])}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        role === UserRole[r] 
                                        ? 'bg-white text-[#00306B] shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {roleLabels[UserRole[r]]}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.username}</label>
                            <input
                                type="text"
                                required
                                className="block w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00306B]/20 focus:border-[#00306B] transition-all bg-gray-50 focus:bg-white"
                                placeholder={language === 'th' ? "เช่น 6310110xxx" : "Ex. 6310110xxx"}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.password}</label>
                            <input
                                type="password"
                                required
                                className="block w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00306B]/20 focus:border-[#00306B] transition-all bg-gray-50 focus:bg-white"
                                placeholder={t.password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#00306B] hover:bg-[#00224d] transition-all"
                        >
                            <LogIn className="h-5 w-5 mr-2" />
                            {t.submitLogin}
                        </button>
                    </form>
                    
                     
                </div>
            </div>
        )}

        {/* Tracking Modal */}
        {showTrackModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00306B]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                     {/* Modal Header */}
                     <div className="p-6 pb-2">
                        <button 
                            onClick={() => setShowTrackModal(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-[#00306B] flex items-center gap-2">
                            <Package className="h-6 w-6" /> {t.trackHeader}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{t.trackSub}</p>
                     </div>

                     {/* Search Input Section */}
                     <div className="p-6 pt-2 border-b border-gray-100">
                        <form onSubmit={handleTrackSearch} className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-0 focus:border-[#00306B] transition-all bg-gray-50 focus:bg-white text-lg font-mono placeholder:font-sans uppercase"
                                placeholder={t.trackPlaceholder}
                                value={trackCode}
                                onChange={(e) => setTrackCode(e.target.value.toUpperCase())}
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#00306B] text-white rounded-lg font-bold hover:bg-[#00224d] shadow-md transition-all flex items-center gap-2"
                            >
                                <Search size={20} />
                                <span className="hidden sm:inline">Check</span>
                            </button>
                        </form>
                        {trackError && (
                            <div className="mt-3 text-red-500 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg animate-pulse">
                                <AlertTriangle size={16} /> {trackError}
                            </div>
                        )}
                     </div>

                     {/* Result Section - Scrollable */}
                     <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
                        {trackResult ? (
                            <div className="animate-in slide-in-from-bottom-2 duration-300">
                                {/* Basic Info Card */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide">Tracking Code</div>
                                            <div className="text-xl font-bold text-[#00306B] font-mono">{trackResult.trackingCode}</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                            trackResult.status === IssueStatus.DONE ? 'bg-green-50 text-green-700 border-green-200' :
                                            trackResult.status === IssueStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                            {trackResult.status}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{trackResult.title}</div>
                                            <div className="text-xs text-gray-500">{trackResult.category}</div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin size={16} /> {trackResult.location}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="relative">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Clock size={18} /> {t.timeline}
                                    </h3>
                                    
                                    <div className="space-y-0 relative pl-2">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-200"></div>

                                        {(trackResult.logs || []).slice().reverse().map((log, index) => (
                                            <div key={index} className="relative flex gap-4 pb-6 last:pb-0 group">
                                                {/* Dot */}
                                                <div className={`relative z-10 w-4 h-4 rounded-full mt-1.5 border-2 bg-white flex-shrink-0 ${getStatusColor(log.status)} shadow-sm group-first:scale-125 transition-transform`}></div>
                                                
                                                <div className="flex-1 bg-white p-3 rounded-lg border border-gray-100 shadow-sm group-first:shadow-md group-first:border-blue-100 transition-shadow">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                                                        <div className="text-sm">
                                                            {getStatusLabel(log.status)}
                                                        </div>
                                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            {new Date(log.timestamp).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
                                                        </div>
                                                    </div>
                                                    {log.note && (
                                                        <p className="text-xs text-gray-600 mt-1">{log.note}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !trackError && (
                                <div className="text-center py-10 opacity-40">
                                    <Package size={48} className="mx-auto mb-2" />
                                    <p className="text-sm">กรอกรหัสเพื่อเริ่มค้นหา</p>
                                </div>
                            )
                        )}
                     </div>
                </div>
             </div>
        )}
    </div>
  );
};