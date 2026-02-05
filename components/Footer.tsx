import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto">
        {/* Changed background to PSU Deep Blue (#00306B) */}
        <div className="bg-[#00306B] text-white py-8 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold tracking-tight">PSU</div>
                    <div className="h-8 w-px bg-white/30"></div>
                    <div className="text-sm opacity-90">
                        <p className="font-semibold">Prince of Songkla University</p>
                        <p className="text-xs">Hat Yai, Songkhla, Thailand</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <button className="px-4 py-2 bg-white/10 rounded-full text-xs hover:bg-white/20 transition">Contact Us</button>
                     <button className="px-4 py-2 bg-white/10 rounded-full text-xs hover:bg-white/20 transition">Privacy Policy</button>
                </div>
            </div>
        </div>
        {/* Darker shade for copyright section */}
        <div className="bg-[#00224d] text-center py-2 text-[10px] text-white/70">
            © 2024 PSU Issue Reporting System. All Rights Reserved.
        </div>
    </footer>
  );
};