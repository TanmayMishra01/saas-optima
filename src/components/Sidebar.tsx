import React from 'react';
import { LayoutDashboard, CreditCard, ShieldAlert, Database, Laptop, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  organizationName: string;
  userEmail: string;
  theme?: 'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist' | 'cyberneon';
}

export default function Sidebar({ activeTab, setActiveTab, organizationName, userEmail, theme = 'slate' }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
    { id: 'auditor', name: 'AI SaaS Auditor', icon: ShieldAlert, highlight: true },
    { id: 'database', name: 'PostgreSQL & RLS', icon: Database },
  ];

  // Map theme styles for the Sidebar container and nested items
  const sidebarStyles = {
    slate: {
      container: 'w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800',
      headerBorder: 'border-b border-slate-800',
      tenantPanel: 'px-6 py-4 bg-slate-950/50 border-b border-slate-900',
      logoBox: 'bg-emerald-500 text-slate-900 rounded-lg p-2 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/10',
      activeItem: 'bg-slate-800 text-white shadow-md border-l-4 border-emerald-500 pl-2',
      inactiveItem: 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200',
      iconActive: 'text-emerald-400',
      iconInactive: 'text-slate-400',
      footer: 'p-4 border-t border-slate-800 bg-slate-950/20',
      footerAvatar: 'bg-slate-800 border-slate-700 text-emerald-400',
      tag: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    },
    midnight: {
      container: 'w-64 bg-[#0a0e1a] text-slate-200 flex flex-col border-r border-slate-900',
      headerBorder: 'border-b border-slate-900',
      tenantPanel: 'px-6 py-4 bg-[#05070e]/60 border-b border-slate-900/80',
      logoBox: 'bg-teal-400 text-slate-950 rounded-lg p-2 font-bold flex items-center justify-center shadow-lg shadow-teal-400/20',
      activeItem: 'bg-[#141d34] text-teal-300 border-l-4 border-teal-400 pl-2 shadow-inner',
      inactiveItem: 'text-slate-500 hover:bg-[#111827]/40 hover:text-slate-300',
      iconActive: 'text-teal-400',
      iconInactive: 'text-slate-600',
      footer: 'p-4 border-t border-slate-900 bg-[#05070e]/40',
      footerAvatar: 'bg-[#141d34] border-slate-800 text-teal-400',
      tag: 'bg-teal-400/10 text-teal-400 border border-teal-400/20'
    },
    nordic: {
      container: 'w-64 bg-[#0f172a] text-slate-100 flex flex-col border-r border-slate-800',
      headerBorder: 'border-b border-slate-800',
      tenantPanel: 'px-6 py-4 bg-[#0b0f19] border-b border-slate-900',
      logoBox: 'bg-indigo-600 text-white rounded-lg p-2 font-bold flex items-center justify-center shadow-lg shadow-indigo-600/15',
      activeItem: 'bg-slate-800 text-white border-l-4 border-indigo-500 pl-2',
      inactiveItem: 'text-slate-400 hover:bg-slate-800/50 hover:text-white',
      iconActive: 'text-indigo-400',
      iconInactive: 'text-slate-500',
      footer: 'p-4 border-t border-slate-800 bg-[#0b0f19]',
      footerAvatar: 'bg-slate-800 border-slate-700 text-indigo-400',
      tag: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
    },
    warm: {
      container: 'w-64 bg-[#2e2620] text-[#f7f5f0] flex flex-col border-r border-[#3d332a]',
      headerBorder: 'border-b border-[#3d332a]',
      tenantPanel: 'px-6 py-4 bg-[#241e19] border-b border-[#312922]',
      logoBox: 'bg-[#c2410c] text-white rounded-lg p-2 font-bold flex items-center justify-center shadow-lg shadow-[#c2410c]/15',
      activeItem: 'bg-[#3d3329] text-[#f7f5f0] border-l-4 border-[#c2410c] pl-2',
      inactiveItem: 'text-[#9c8e82] hover:bg-[#352c24] hover:text-[#f7f5f0]',
      iconActive: 'text-[#f97316]',
      iconInactive: 'text-[#87786b]',
      footer: 'p-4 border-t border-[#3d332a] bg-[#241e19]',
      footerAvatar: 'bg-[#3d3329] border-[#4b3e34] text-[#f97316]',
      tag: 'bg-[#c2410c]/20 text-[#f97316] border border-[#c2410c]/30'
    },
    brutalist: {
      container: 'w-64 bg-white text-black flex flex-col border-r-3 border-black rounded-none font-mono',
      headerBorder: 'border-b-3 border-black',
      tenantPanel: 'px-6 py-4 bg-zinc-100 border-b-2.5 border-black',
      logoBox: 'bg-[#facc15] text-black border-2 border-black rounded-none p-2 font-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      activeItem: 'bg-black text-white rounded-none border-2 border-black font-black pl-2.5',
      inactiveItem: 'text-black hover:bg-zinc-200 border border-transparent font-bold',
      iconActive: 'text-white',
      iconInactive: 'text-black',
      footer: 'p-4 border-t-2.5 border-black bg-zinc-100',
      footerAvatar: 'bg-[#facc15] border-2 border-black text-black rounded-none font-black',
      tag: 'bg-black text-white border border-black rounded-none px-1 py-0.5 text-[8px]'
    },
    cyberneon: {
      container: 'w-64 bg-[#06030a] text-slate-200 flex flex-col border-r border-fuchsia-500/20',
      headerBorder: 'border-b border-fuchsia-500/20',
      tenantPanel: 'px-6 py-4 bg-[#0a0514]/80 border-b border-fuchsia-500/15',
      logoBox: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black rounded-lg p-2 font-bold flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.4)]',
      activeItem: 'bg-[#140a24]/80 text-cyan-300 border-l-4 border-cyan-400 pl-2 shadow-[inset_0_0_8px_rgba(34,211,238,0.1)]',
      inactiveItem: 'text-slate-500 hover:bg-[#140a24]/40 hover:text-fuchsia-300',
      iconActive: 'text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]',
      iconInactive: 'text-slate-600',
      footer: 'p-4 border-t border-fuchsia-500/20 bg-[#0a0514]/40',
      footerAvatar: 'bg-[#140a24] border-fuchsia-500/30 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]',
      tag: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
    }
  }[theme];

  return (
    <div id="saas-optima-sidebar" className={sidebarStyles.container}>
      {/* Brand Header */}
      <div className={`p-6 ${sidebarStyles.headerBorder}`}>
        <div className="flex items-center gap-3">
          <div className={sidebarStyles.logoBox}>
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <h1 className={`font-sans font-bold tracking-tight text-lg ${theme === 'brutalist' ? 'font-black uppercase text-black' : theme === 'cyberneon' ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-extrabold' : 'text-white'}`}>SaaS-Optima</h1>
            <p className={`font-mono text-[10px] tracking-wider font-semibold uppercase ${theme === 'midnight' ? 'text-teal-400' : theme === 'cyberneon' ? 'text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]' : theme === 'warm' ? 'text-[#f97316]' : theme === 'brutalist' ? 'text-black font-black' : 'text-emerald-400'}`}>Enterprise Hub</p>
          </div>
        </div>
      </div>

      {/* Tenant Context Panel */}
      <div className={sidebarStyles.tenantPanel}>
        <p className={`text-[10px] font-mono tracking-wider uppercase ${theme === 'brutalist' ? 'text-black font-black' : theme === 'cyberneon' ? 'text-cyan-400/70' : 'text-slate-400'}`}>Active Org</p>
        <p className={`font-medium text-sm truncate mt-0.5 ${theme === 'brutalist' ? 'text-black font-black' : 'text-slate-200'}`}>{organizationName}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${theme === 'brutalist' ? 'bg-black border border-black' : theme === 'cyberneon' ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'bg-emerald-400'}`}></span>
          <span className={`text-[10px] font-mono ${theme === 'brutalist' ? 'text-black font-bold' : 'text-slate-400'}`}>Multi-Tenant Isolated</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                theme === 'brutalist' ? 'rounded-none' : ''
              } ${
                isActive ? sidebarStyles.activeItem : sidebarStyles.inactiveItem
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 ${isActive ? sidebarStyles.iconActive : sidebarStyles.iconInactive}`} />
                <span className={theme === 'brutalist' ? 'font-black uppercase text-xs' : ''}>{item.name}</span>
              </div>
              {item.highlight && (
                <span className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-semibold rounded-full ${sidebarStyles.tag}`}>
                  <Sparkles className="h-2.5 w-2.5" />
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className={sidebarStyles.footer}>
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center border font-semibold text-xs font-mono uppercase ${sidebarStyles.footerAvatar}`}>
            {userEmail.substring(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium truncate ${theme === 'brutalist' ? 'text-black font-black' : 'text-slate-200'}`}>{userEmail}</p>
            <p className={`text-[10px] font-mono mt-0.5 font-medium ${theme === 'midnight' ? 'text-teal-400' : theme === 'cyberneon' ? 'text-fuchsia-400 font-bold' : theme === 'warm' ? 'text-[#f97316]' : theme === 'brutalist' ? 'text-black font-black underline' : 'text-emerald-400'}`}>Finance Architect</p>
          </div>
        </div>
      </div>
    </div>
  );
}
