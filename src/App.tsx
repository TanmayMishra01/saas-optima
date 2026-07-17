import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ChartView from './components/ChartView';
import SaaSAuditor from './components/SaaSAuditor';
import SubscriptionModal from './components/SubscriptionModal';
import DbViewer from './components/DbViewer';
import { dbLocal, supabase } from './lib/supabaseClient';
import { Subscription } from './types';
import Auth from './components/Auth';
import {
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  RefreshCw,
  Users,
  CheckCircle,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  LogOut,
  ChevronDown,
  Loader2
} from 'lucide-react';

// Highly-polished design presets for the user to choose from
export const themeConfigs = {
  slate: {
    bgMain: 'bg-slate-50',
    card: 'bg-white border-slate-200 shadow-sm hover:border-slate-300',
    heading: 'text-slate-900',
    subtext: 'text-slate-500',
    accentText: 'text-emerald-600',
    buttonAccent: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/10',
    tableHeader: 'bg-slate-50 text-slate-500 border-b border-slate-200',
    tableRowBorder: 'border-slate-100',
    tableRowHover: 'hover:bg-slate-50/50',
    badgeActive: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    badgeAlert: 'bg-amber-100 text-amber-800 border border-amber-200',
    badgeRedundant: 'bg-rose-100 text-rose-800 border border-rose-200',
    border: 'border-slate-200',
    cardTitle: 'text-slate-500',
    cardValue: 'text-slate-900',
  },
  midnight: {
    bgMain: 'bg-[#060a13]',
    card: 'bg-[#0c1222] border-slate-800/80 shadow-md shadow-black/40 hover:border-slate-700',
    heading: 'text-white',
    subtext: 'text-slate-400',
    accentText: 'text-teal-400',
    buttonAccent: 'bg-teal-400 hover:bg-teal-300 text-[#060a13] hover:shadow-teal-400/15',
    tableHeader: 'bg-[#080d19] text-slate-400 border-b border-slate-800',
    tableRowBorder: 'border-slate-800/50',
    tableRowHover: 'hover:bg-slate-800/30 text-slate-300',
    badgeActive: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50',
    badgeAlert: 'bg-amber-950/60 text-amber-400 border border-amber-800/50',
    badgeRedundant: 'bg-rose-950/60 text-rose-400 border border-rose-800/50',
    border: 'border-slate-800',
    cardTitle: 'text-slate-400',
    cardValue: 'text-white',
  },
  nordic: {
    bgMain: 'bg-[#f0f4f8]',
    card: 'bg-white border-blue-100 shadow-sm hover:border-blue-200',
    heading: 'text-[#1e293b]',
    subtext: 'text-slate-500',
    accentText: 'text-indigo-600',
    buttonAccent: 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/10',
    tableHeader: 'bg-[#f8fafc] text-slate-500 border-b border-slate-100',
    tableRowBorder: 'border-slate-100',
    tableRowHover: 'hover:bg-blue-50/20',
    badgeActive: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    badgeAlert: 'bg-amber-50 text-amber-700 border border-amber-100',
    badgeRedundant: 'bg-rose-50 text-rose-700 border border-rose-100',
    border: 'border-slate-200',
    cardTitle: 'text-slate-500',
    cardValue: 'text-slate-800',
  },
  warm: {
    bgMain: 'bg-[#fdfcf9]',
    card: 'bg-[#fbf9f5] border-[#ebdcd0] shadow-xs hover:border-[#dbcebf]',
    heading: 'text-[#2e2620]',
    subtext: 'text-[#7a6d61]',
    accentText: 'text-[#c2410c]',
    buttonAccent: 'bg-[#c2410c] hover:bg-[#b43e0b] text-white hover:shadow-[#c2410c]/10',
    tableHeader: 'bg-[#f4ebe1] text-[#7a6d61] border-b border-[#ebdcd0]',
    tableRowBorder: 'border-[#f2e7db]',
    tableRowHover: 'hover:bg-[#f9f4ec]/60',
    badgeActive: 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]',
    badgeAlert: 'bg-[#fffbeb] text-[#b45309] border border-[#fde68a]',
    badgeRedundant: 'bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]',
    border: 'border-[#ebdcd0]',
    cardTitle: 'text-[#7a6d61]',
    cardValue: 'text-[#2e2620]',
  },
  brutalist: {
    bgMain: 'bg-zinc-100',
    card: 'bg-white border-2.5 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all',
    heading: 'text-black font-mono font-black uppercase tracking-tight',
    subtext: 'text-zinc-700 font-mono text-xs',
    accentText: 'text-black underline decoration-2',
    buttonAccent: 'bg-[#facc15] text-black border-2.5 border-black font-black hover:bg-[#eab308] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
    tableHeader: 'bg-zinc-200 text-black border-b-2.5 border-black font-mono font-bold uppercase',
    tableRowBorder: 'border-b-2 border-black',
    tableRowHover: 'hover:bg-zinc-100',
    badgeActive: 'bg-emerald-300 text-black border border-black font-bold font-mono rounded-none px-2 py-0.5 text-[10px]',
    badgeAlert: 'bg-amber-300 text-black border border-black font-bold font-mono rounded-none px-2 py-0.5 text-[10px]',
    badgeRedundant: 'bg-rose-300 text-black border border-black font-bold font-mono rounded-none px-2 py-0.5 text-[10px]',
    border: 'border-black border-2',
    cardTitle: 'text-black font-mono font-bold uppercase tracking-wider text-[11px]',
    cardValue: 'text-black font-mono font-black text-2xl',
  },
  cyberneon: {
    bgMain: 'bg-[#03000a]',
    card: 'bg-[#090514] border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.05)] hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] rounded-xl transition-all duration-300',
    heading: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 font-extrabold tracking-tight',
    subtext: 'text-cyan-400/70 font-mono text-[11px]',
    accentText: 'text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]',
    buttonAccent: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-cyan-300 hover:to-fuchsia-400 text-black font-extrabold shadow-[0_0_12px_rgba(34,211,238,0.4)]',
    tableHeader: 'bg-[#0f0a21] text-cyan-400 border-b border-fuchsia-500/30 font-mono text-[10px] uppercase tracking-widest',
    tableRowBorder: 'border-fuchsia-500/10',
    tableRowHover: 'hover:bg-fuchsia-500/5 text-slate-300',
    badgeActive: 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.2)] font-mono font-bold text-[10px]',
    badgeAlert: 'bg-amber-950/80 text-amber-400 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)] font-mono font-bold text-[10px]',
    badgeRedundant: 'bg-rose-950/80 text-rose-400 border border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.2)] font-mono font-bold text-[10px]',
    border: 'border-fuchsia-500/20',
    cardTitle: 'text-cyan-400/70 font-mono text-[11px] uppercase tracking-widest',
    cardValue: 'text-white font-mono font-extrabold text-3xl drop-shadow-[0_0_6px_rgba(245,40,145,0.4)]',
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Supabase Auth States
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Dynamic Theme Selection State (restored from storage)
  const [theme, setTheme] = useState<'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist' | 'cyberneon'>(() => {
    const saved = localStorage.getItem('optima_theme');
    return (saved as any) || 'slate';
  });

  useEffect(() => {
    localStorage.setItem('optima_theme', theme);
  }, [theme]);

  // Handle checking/listening to Supabase session
  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Supabase session:", err);
        setAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    
    if (subscription) {
      unsubscribeFn = () => subscription.unsubscribe();
    }

    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Error signing out from Supabase:", e);
    }
    setUser(null);
    setIsProfileDropdownOpen(false);
  };

  // Active Tenant Configuration (Demo Context dynamically linked to logged-in user)
  const activeOrg = {
    id: 'org_enterprise_optima',
    name: 'Optima Enterprises Inc.',
  };
  const activeUser = {
    email: user?.email || 'mishratanmay225@gmail.com',
  };

  // Synchronize state from Local Storage local client database
  const reloadData = () => {
    const list = dbLocal.getSubscriptions(activeOrg.id);
    setSubscriptions(list);
  };

  useEffect(() => {
    reloadData();
  }, []);

  // CRUD handlers
  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    dbLocal.addSubscription(newSub);
    reloadData();
  };

  const handleDeleteSubscription = (id: string) => {
    if (confirm('Are you sure you want to terminate this subscription record?')) {
      dbLocal.deleteSubscription(id);
      reloadData();
    }
  };

  // Triggered from AI Auditor: apply optimization updates directly in DB
  const handleApplyOptimization = (toolName: string, actionItem: string, potentialSavings: number) => {
    // Find matching subscription and apply changes
    const matched = subscriptions.find(
      s => s.service_name.toLowerCase().includes(toolName.toLowerCase().trim()) ||
           toolName.toLowerCase().trim().includes(s.service_name.toLowerCase())
    );

    if (matched) {
      if (actionItem.toLowerCase().includes('deprovision') || actionItem.toLowerCase().includes('inactive')) {
        // Adjust active seat size to matches seat allocations
        dbLocal.updateSubscription(matched.id, {
          total_seats: matched.active_seats,
          status: 'Active',
          cost: Math.round(matched.cost * (matched.active_seats / matched.total_seats)),
        });
      } else if (actionItem.toLowerCase().includes('terminate') || actionItem.toLowerCase().includes('consolidate')) {
        dbLocal.updateSubscription(matched.id, {
          status: 'Cancelled',
        });
      } else {
        dbLocal.updateSubscription(matched.id, {
          status: 'Active',
          cost: Math.max(50, matched.cost - potentialSavings),
        });
      }
      reloadData();
    }
  };

  const handleResetData = () => {
    if (confirm('Reset your SaaS inventory back to initial high-leakage demonstration records?')) {
      dbLocal.resetToDefault();
      reloadData();
    }
  };

  // Metric calculation helpers
  const totalMonthlySpend = subscriptions
    .filter(s => s.status !== 'Cancelled')
    .reduce((sum, s) => {
      return sum + (s.billing_cycle === 'annual' ? Math.round(s.cost / 12) : s.cost);
    }, 0);

  const projectedAnnualSpend = totalMonthlySpend * 12;

  // AI potential savings count (computed from overlaps & leakage records)
  const calculateAISavingsTarget = () => {
    let savings = 0;
    subscriptions.forEach(s => {
      if (s.status === 'Cancelled') return;
      
      // Overlap zoom and team duplicates
      if (s.service_name.toLowerCase().includes('zoom') && s.status === 'Redundant') {
        savings += s.cost;
      }
      // Seat leakage Salesforce or figma
      if (s.total_seats > s.active_seats && s.status === 'Underused') {
        const unused = s.total_seats - s.active_seats;
        const perSeat = s.cost / s.total_seats;
        savings += Math.round(unused * perSeat * 0.9);
      }
    });
    return savings;
  };

  const aiSavingsTarget = calculateAISavingsTarget();

  const cfg = themeConfigs[theme];

  if (authLoading) {
    const loadingCfg = themeConfigs[theme];
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${loadingCfg.bgMain}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`h-12 w-12 animate-spin ${
            theme === 'cyberneon' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-emerald-500'
          }`} />
          <p className={`text-sm font-mono tracking-widest uppercase ${
            theme === 'midnight' ? 'text-teal-400' : theme === 'cyberneon' ? 'text-cyan-400 font-bold' : 'text-slate-500'
          }`}>
            Initializing Secure Auth Shield...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth theme={theme} onAuthSuccess={(usr) => setUser(usr)} />;
  }

  const dropdownStyles = {
    slate: 'bg-white border-slate-200 text-slate-800 shadow-xl',
    midnight: 'bg-[#0c1222] border-slate-800 text-slate-100 shadow-2xl',
    nordic: 'bg-white border-blue-100 text-slate-800 shadow-xl',
    warm: 'bg-[#fbf9f5] border-[#ebdcd0] text-[#2e2620] shadow-lg',
    brutalist: 'bg-white border-3 border-black text-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    cyberneon: 'bg-[#090514] border border-fuchsia-500/30 text-white shadow-[0_0_20px_rgba(217,70,239,0.25)]'
  }[theme];

  return (
    <div className={`flex h-screen ${cfg.bgMain} overflow-hidden font-sans transition-colors duration-200`}>
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        organizationName={activeOrg.name}
        userEmail={activeUser.email}
        theme={theme}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Dynamic Top Header & Interactive Theme Switcher */}
        <div className={`px-8 py-4.5 border-b flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 transition-all ${
          theme === 'midnight' 
            ? 'bg-[#0a0e1a] border-slate-800 text-slate-100' 
            : theme === 'warm' 
            ? 'bg-[#f7f4ed] border-[#e6ded4] text-[#2e2620]' 
            : theme === 'brutalist' 
            ? 'bg-white border-b-3 border-black text-black' 
            : theme === 'cyberneon'
            ? 'bg-[#06030a] border-fuchsia-500/20 text-slate-100 shadow-[0_2px_15px_rgba(217,70,239,0.05)]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          {/* Breadcrumb Context indicator */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono tracking-wider opacity-60 font-semibold ${theme === 'brutalist' ? 'text-black font-black' : ''}`}>
              TENANT CONTEXT:
            </span>
            <div className="flex items-center gap-2 font-sans font-bold text-sm">
              <span className="opacity-90">{activeOrg.name}</span>
              <span className="opacity-40">/</span>
              <span className={`capitalize ${theme === 'midnight' ? 'text-teal-400' : theme === 'warm' ? 'text-[#c2410c]' : theme === 'brutalist' ? 'text-black underline' : theme === 'cyberneon' ? 'text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]' : 'text-emerald-600'}`}>
                {activeTab === 'database' ? 'PostgreSQL Schema' : activeTab === 'auditor' ? 'AI Auditor' : activeTab}
              </span>
            </div>
          </div>

          {/* Premium UI Theme Presets Panel & Profile Dropdown */}
          <div className="flex flex-wrap items-center gap-4.5">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-mono opacity-70 flex items-center gap-1 font-bold ${theme === 'brutalist' ? 'text-black uppercase' : ''}`}>
                🎨 Change Design:
              </span>
              <div className={`flex flex-wrap items-center gap-1 p-1 rounded-lg ${
                theme === 'midnight' 
                  ? 'bg-slate-900/60 border border-slate-800' 
                  : theme === 'warm' 
                  ? 'bg-[#efeae0] border border-[#ebdcd0]' 
                  : theme === 'brutalist' 
                  ? 'bg-zinc-200 border-2 border-black' 
                  : theme === 'cyberneon'
                  ? 'bg-[#090514] border border-fuchsia-500/20'
                  : 'bg-slate-100 border border-slate-200/60'
              }`}>
                {Object.keys(themeConfigs).map((tId) => {
                  const isActive = theme === tId;
                  
                  const dotColor = {
                    slate: 'bg-slate-500 border-slate-400',
                    midnight: 'bg-teal-400 border-teal-300',
                    nordic: 'bg-indigo-600 border-indigo-400',
                    warm: 'bg-[#c2410c] border-[#f0c2a5]',
                    brutalist: 'bg-yellow-400 border-black',
                    cyberneon: 'bg-fuchsia-500 border-cyan-400 animate-pulse'
                  }[tId as keyof typeof themeConfigs];

                  const labels = {
                    slate: 'Classic Slate',
                    midnight: 'Midnight Cosmic',
                    nordic: 'Nordic Frost',
                    warm: 'Warm Sepia',
                    brutalist: 'Bold Brutalist',
                    cyberneon: 'Cyber Neon'
                  }[tId as keyof typeof themeConfigs];

                  return (
                    <button
                      key={tId}
                      onClick={() => setTheme(tId as any)}
                      title={`Switch to ${labels}`}
                      className={`px-2.5 py-1 text-[10.5px] font-medium font-sans rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? theme === 'brutalist'
                            ? 'bg-black text-white font-black rounded-none border border-black'
                            : theme === 'cyberneon'
                            ? 'bg-cyan-400 text-black font-extrabold shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                            : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                          : theme === 'midnight'
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          : theme === 'warm'
                          ? 'text-[#7a6d61] hover:text-[#2e2620] hover:bg-white/40'
                          : theme === 'brutalist'
                          ? 'text-zinc-800 hover:bg-zinc-300 font-bold rounded-none'
                          : theme === 'cyberneon'
                          ? 'text-cyan-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full border ${dotColor}`}></span>
                      <span className="text-[10px]">{labels}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`h-6 w-px ${
              theme === 'midnight' ? 'bg-slate-800' : theme === 'warm' ? 'bg-[#ebdcd0]' : theme === 'brutalist' ? 'bg-black w-0.5' : theme === 'cyberneon' ? 'bg-fuchsia-500/20' : 'bg-slate-200'
            }`} />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  theme === 'midnight'
                    ? 'bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-800'
                    : theme === 'warm'
                    ? 'bg-[#efeae0] border-[#ebdcd0] text-[#2e2620] hover:bg-[#ebdcd0]'
                    : theme === 'brutalist'
                    ? 'bg-white border-2 border-black rounded-none font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]'
                    : theme === 'cyberneon'
                    ? 'bg-[#090514] border-fuchsia-500/20 text-cyan-400 font-bold hover:border-fuchsia-500/50 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] uppercase ${
                  theme === 'brutalist' ? 'bg-[#facc15] text-black border border-black rounded-none' : 'bg-emerald-500 text-slate-950'
                }`}>
                  {activeUser.email.substring(0, 2)}
                </div>
                <span className="max-w-[120px] truncate">{activeUser.email}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl border p-4 z-50 text-left ${dropdownStyles}`}>
                    <div className="space-y-1 pb-3 border-b mb-3 border-slate-100 dark:border-slate-800/60">
                      <p className="text-[10px] font-mono uppercase opacity-50 font-bold tracking-wider">Logged in as</p>
                      <p className="font-bold text-xs truncate">{activeUser.email}</p>
                      <p className={`text-[10px] font-medium ${
                        theme === 'cyberneon' ? 'text-cyan-400 font-bold' : theme === 'midnight' ? 'text-teal-400' : 'text-emerald-600'
                      }`}>Finance Architect</p>
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out Session</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Module Content Scroll Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
          
          {/* Dashboard Module */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Header section with Reset option */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-tight font-sans ${cfg.heading}`}>SaaS Expense Hub</h1>
                  <p className={`text-xs mt-0.5 font-sans ${cfg.subtext}`}>Real-time SaaS billing telemetry, audit statuses, and multi-tenant isolation analytics.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetData}
                    className={`text-xs font-semibold px-3.5 py-2 border rounded-lg shadow-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      theme === 'midnight'
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        : theme === 'warm'
                        ? 'bg-[#fbf9f5] border-[#ebdcd0] text-[#7a6d61] hover:bg-[#ebdcd0]'
                        : theme === 'brutalist'
                        ? 'bg-white border-2 border-black text-black rounded-none font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <RefreshCw className="h-3.5 w-3.5 opacity-75" />
                    Reset Demo Stack
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`font-bold px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      theme === 'brutalist' ? 'rounded-none' : ''
                    } ${cfg.buttonAccent}`}
                  >
                    <Plus className="h-4 w-4" /> Add Subscription
                  </button>
                </div>
              </div>

              {/* KPI metrics row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  id="monthly-spend"
                  title="Total Monthly Spend"
                  value={`$${totalMonthlySpend.toLocaleString()}`}
                  description="Aggregate normalized software run-rate"
                  icon={CreditCard}
                  trend={{ value: '-4.2%', isPositive: true, label: 'vs last billing cycle' }}
                  color="cobalt"
                  theme={theme}
                />
                <StatCard
                  id="annual-projection"
                  title="Projected Annual Cost"
                  value={`$${projectedAnnualSpend.toLocaleString()}`}
                  description="Committed forecast (next 12 months)"
                  icon={Layers}
                  trend={{ value: 'Stable', isPositive: true, label: 'aligned with budget limits' }}
                  color="violet"
                  theme={theme}
                />
                <StatCard
                  id="ai-savings"
                  title="AI Audit Leakage Wastes"
                  value={`$${aiSavingsTarget.toLocaleString()}/mo`}
                  description="Wasted money from duplicated seats & overlaps"
                  icon={Sparkles}
                  trend={{
                    value: `${Math.round((aiSavingsTarget / (totalMonthlySpend || 1)) * 100)}% waste`,
                    isPositive: false,
                    label: 'detected in active inventory'
                  }}
                  color={aiSavingsTarget > 0 ? 'amber' : 'emerald'}
                  theme={theme}
                />
              </div>

              {/* Charts Segment */}
              <ChartView subscriptions={subscriptions} theme={theme} />

              {/* Active Leakage Alerts Panel */}
              {aiSavingsTarget > 0 && (
                <div className={`border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                  theme === 'midnight'
                    ? 'bg-gradient-to-r from-amber-950/20 to-orange-950/20 border-amber-800/40 text-slate-200'
                    : theme === 'warm'
                    ? 'bg-gradient-to-r from-[#faf5eb] to-[#f5ebd7] border-[#d97706]/30 text-[#2e2620]'
                    : theme === 'brutalist'
                    ? 'bg-amber-100 border-3 border-black text-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-slate-800'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl border ${
                      theme === 'midnight'
                        ? 'bg-amber-950/40 border-amber-800/40 text-amber-400'
                        : theme === 'warm'
                        ? 'bg-white border-[#ebdcd0] text-[#c2410c]'
                        : theme === 'brutalist'
                        ? 'bg-white border-2 border-black text-black rounded-none'
                        : 'bg-amber-100 border-amber-200 text-amber-800'
                    }`}>
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Action Required: Unmanaged SaaS Leakage</h4>
                      <p className={`text-xs mt-1 leading-relaxed max-w-xl ${
                        theme === 'midnight' ? 'text-slate-400' : theme === 'warm' ? 'text-[#7a6d61]' : 'text-slate-600'
                      }`}>
                        Our AI Auditor identified duplicate software subscriptions and unused license seats. Realize up to <strong>${aiSavingsTarget.toLocaleString()}</strong> in immediate monthly savings.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('auditor')}
                    className={`font-bold px-4 py-2.5 text-xs hover:bg-amber-500 hover:shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'brutalist'
                        ? 'bg-[#facc15] text-black border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]'
                        : 'bg-amber-600 text-white rounded-lg shadow-sm'
                    }`}
                  >
                    Open AI Auditor
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Subscriptions Grid / Table Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-tight font-sans ${cfg.heading}`}>SaaS Registry</h1>
                  <p className={`text-xs mt-0.5 font-sans ${cfg.subtext}`}>Multi-tenant catalog of active software products and billing commitments.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`font-bold px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    theme === 'brutalist' ? 'rounded-none' : ''
                  } ${cfg.buttonAccent}`}
                >
                  <Plus className="h-4 w-4" /> New Subscription
                </button>
              </div>

              {/* Inventory Table Card */}
              <div className={`overflow-hidden border ${cfg.card} ${theme === 'brutalist' ? '' : 'rounded-xl'}`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`text-[10.5px] font-bold uppercase tracking-wider font-sans ${cfg.tableHeader}`}>
                      <th className="px-6 py-4">Software Name</th>
                      <th className="px-6 py-4">Expense Category</th>
                      <th className="px-6 py-4">Billed Cost</th>
                      <th className="px-6 py-4">Contract Cycle</th>
                      <th className="px-6 py-4">Seat Allocation Ratio</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-xs font-sans ${theme === 'midnight' ? 'divide-slate-800/60' : theme === 'warm' ? 'divide-[#ebdcd0]/60' : theme === 'brutalist' ? 'divide-black' : 'divide-slate-100'}`}>
                    {subscriptions.length > 0 ? (
                      subscriptions.map((sub) => {
                        const seatUsagePercentage = sub.total_seats > 0 ? Math.round((sub.active_seats / sub.total_seats) * 100) : 0;
                        
                        return (
                          <tr key={sub.id} className={`transition ${cfg.tableRowHover}`}>
                            <td className="px-6 py-4.5">
                              <span className={`font-bold block ${theme === 'midnight' ? 'text-white' : theme === 'warm' ? 'text-[#2e2620]' : 'text-slate-900'}`}>{sub.service_name}</span>
                              <span className={`text-[10px] font-mono mt-0.5 block ${theme === 'midnight' ? 'text-slate-500' : 'text-slate-400'}`}>{sub.id}</span>
                            </td>
                            <td className="px-6 py-4.5">
                              <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                                theme === 'midnight'
                                  ? 'bg-slate-900 border border-slate-800 text-slate-300 rounded-full'
                                  : theme === 'warm'
                                  ? 'bg-[#f4ebe1] border border-[#ebdcd0] text-[#7a6d61] rounded-full'
                                  : theme === 'brutalist'
                                  ? 'bg-zinc-200 border border-black text-black font-mono'
                                  : 'bg-slate-100 border border-slate-200 text-slate-600 rounded-full'
                              }`}>
                                {sub.category}
                              </span>
                            </td>
                            <td className={`px-6 py-4.5 font-mono font-bold ${theme === 'midnight' ? 'text-teal-400' : theme === 'warm' ? 'text-[#c2410c]' : 'text-slate-800'}`}>
                              ${sub.cost.toLocaleString()}
                            </td>
                            <td className={`px-6 py-4.5 font-medium uppercase font-sans text-[10px] ${theme === 'midnight' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {sub.billing_cycle}
                            </td>
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-3">
                                <span className={`font-mono font-medium ${theme === 'midnight' ? 'text-slate-300' : 'text-slate-800'}`}>{sub.active_seats}/{sub.total_seats}</span>
                                <div className={`w-16 rounded-full h-1.5 overflow-hidden ${theme === 'midnight' ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                  <div
                                    className={`h-full rounded-full ${
                                      seatUsagePercentage < 50
                                        ? 'bg-rose-500'
                                        : seatUsagePercentage < 80
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${seatUsagePercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4.5">
                              <span
                                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                                  sub.status === 'Active'
                                    ? cfg.badgeActive
                                    : sub.status === 'Underused'
                                    ? cfg.badgeAlert
                                    : sub.status === 'Redundant'
                                    ? cfg.badgeRedundant
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="px-6 py-4.5 text-right">
                              <button
                                onClick={() => handleDeleteSubscription(sub.id)}
                                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 p-2 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 font-semibold dark:hover:bg-rose-950/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className={`px-6 py-12 text-center font-sans ${cfg.subtext}`}>
                          No SaaS subscriptions found in the tenant directory. Click 'New Subscription' to add.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI SaaS Auditor Tab */}
          {activeTab === 'auditor' && (
            <div className="animate-fade-in">
              <SaaSAuditor
                subscriptions={subscriptions}
                onApplyOptimization={handleApplyOptimization}
                onImportSubscription={handleAddSubscription}
                theme={theme}
              />
            </div>
          )}

          {/* Database Setup & SQL Exporter Tab */}
          {activeTab === 'database' && (
            <div className="animate-fade-in">
              <DbViewer theme={theme} />
            </div>
          )}

        </div>
      </main>

      {/* Subscription Modal Form Dialog */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSubscription}
        theme={theme}
      />
    </div>
  );
}
