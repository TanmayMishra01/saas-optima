import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean; // e.g. whether it's good (savings up is positive, expenses down is positive)
    label: string;
  };
  color?: 'emerald' | 'cobalt' | 'amber' | 'slate' | 'violet';
  theme?: 'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist' | 'cyberneon';
}

export default function StatCard({ id, title, value, description, icon: Icon, trend, color = 'emerald', theme = 'slate' }: StatCardProps) {
  const colorThemes = {
    emerald: {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-900',
      iconBg: 'bg-emerald-500 text-white shadow-emerald-500/20',
      accent: 'text-emerald-600',
      border: 'hover:border-emerald-200'
    },
    cobalt: {
      bg: 'bg-blue-50 border-blue-100',
      text: 'text-blue-900',
      iconBg: 'bg-blue-600 text-white shadow-blue-600/20',
      accent: 'text-blue-600',
      border: 'hover:border-blue-200'
    },
    amber: {
      bg: 'bg-amber-50 border-amber-100',
      text: 'text-amber-900',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
      accent: 'text-amber-600',
      border: 'hover:border-amber-200'
    },
    slate: {
      bg: 'bg-slate-50 border-slate-100',
      text: 'text-slate-900',
      iconBg: 'bg-slate-700 text-white shadow-slate-700/20',
      accent: 'text-slate-600',
      border: 'hover:border-slate-200'
    },
    violet: {
      bg: 'bg-violet-50 border-violet-100',
      text: 'text-violet-900',
      iconBg: 'bg-violet-600 text-white shadow-violet-600/20',
      accent: 'text-violet-600',
      border: 'hover:border-violet-200'
    }
  };

  const layoutStyles = {
    slate: {
      card: 'bg-white border-slate-200 shadow-sm hover:border-slate-300 rounded-xl',
      title: 'text-slate-500',
      value: 'text-slate-900',
      sub: 'text-slate-500',
      divider: 'border-slate-100',
    },
    midnight: {
      card: 'bg-[#0c1222] border-slate-800/80 shadow-md shadow-black/40 hover:border-slate-700 rounded-xl',
      title: 'text-slate-400',
      value: 'text-white',
      sub: 'text-slate-400',
      divider: 'border-slate-800/50',
    },
    nordic: {
      card: 'bg-white border-blue-100 shadow-sm hover:border-blue-200 rounded-xl',
      title: 'text-slate-500',
      value: 'text-[#1e293b]',
      sub: 'text-slate-500',
      divider: 'border-slate-100',
    },
    warm: {
      card: 'bg-[#fbf9f5] border-[#ebdcd0] shadow-xs hover:border-[#dbcebf] rounded-xl',
      title: 'text-[#7a6d61]',
      value: 'text-[#2e2620]',
      sub: 'text-[#7a6d61]',
      divider: 'border-[#ebdcd0]/40',
    },
    brutalist: {
      card: 'bg-white border-2.5 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all',
      title: 'text-black font-mono font-bold uppercase tracking-wider text-[11px]',
      value: 'text-black font-mono font-black text-2xl',
      sub: 'text-zinc-700 font-mono text-xs',
      divider: 'border-t-2 border-black',
    },
    cyberneon: {
      card: 'bg-[#090514] border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.05)] hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] rounded-xl transition-all duration-300',
      title: 'text-cyan-400/70 font-mono tracking-widest text-[10px] uppercase font-bold',
      value: 'text-white font-mono font-extrabold text-3xl drop-shadow-[0_0_6px_rgba(245,40,145,0.4)]',
      sub: 'text-slate-400 font-mono text-[10px]',
      divider: 'border-fuchsia-500/10',
    }
  }[theme];

  const colorTheme = colorThemes[color];

  return (
    <div
      id={`stat-card-${id}`}
      className={`border p-6 transition-all duration-200 ${layoutStyles.card}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider font-sans ${layoutStyles.title}`}>{title}</p>
          <h3 className={`text-3xl font-bold font-sans mt-2 tracking-tight ${layoutStyles.value}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-lg shadow-md ${
          theme === 'cyberneon'
            ? 'bg-gradient-to-br from-fuchsia-600 to-purple-800 border border-fuchsia-400 text-white shadow-[0_0_10px_rgba(217,70,239,0.4)]'
            : colorTheme.iconBg
        } ${theme === 'brutalist' ? 'rounded-none border-2 border-black shadow-none' : ''}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {description && (
        <p className={`text-xs mt-2 font-sans truncate ${layoutStyles.sub}`}>{description}</p>
      )}

      {trend && (
        <div className={`flex items-center gap-1.5 mt-3 pt-3 border-t ${layoutStyles.divider}`}>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              theme === 'brutalist' 
                ? 'bg-yellow-300 text-black border border-black rounded-none font-mono font-bold'
                : theme === 'cyberneon'
                ? trend.isPositive
                  ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] shadow-[0_0_6px_rgba(34,211,238,0.2)]'
                  : 'bg-rose-950/80 border border-rose-500/40 text-rose-400 font-mono text-[10px] shadow-[0_0_6px_rgba(244,63,94,0.2)]'
                : trend.isPositive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {trend.value}
          </span>
          <span className={`text-xs font-sans ${layoutStyles.sub}`}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
