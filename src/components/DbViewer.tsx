import React, { useState } from 'react';
import { POSTGRES_DDL_SCRIPT } from '../lib/supabaseClient';
import { Database, ShieldCheck, Key, Copy, Check, Server, Info, AlertTriangle } from 'lucide-react';

interface DbViewerProps {
  theme?: 'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist' | 'cyberneon';
}

export default function DbViewer({ theme = 'slate' }: DbViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(POSTGRES_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dbTables = [
    { name: 'profiles', desc: 'Stores individual user identities associated with active tenancy roles.', columns: ['id (UUID, PK)', 'email (VARCHAR)', 'name (VARCHAR)', 'role (Admin/Finance/Viewer)', 'organization_id (UUID, FK)', 'created_at'] },
    { name: 'organizations', desc: 'Defines the root B2B billing tenant account metadata.', columns: ['id (UUID, PK)', 'name (VARCHAR)', 'subdomain (VARCHAR)', 'owner_id (UUID)', 'created_at'] },
    { name: 'subscriptions', desc: 'Maintains granular tracking of individual software contracts.', columns: ['id (UUID, PK)', 'organization_id (UUID, FK)', 'service_name (VARCHAR)', 'cost (DECIMAL)', 'billing_cycle (monthly/annual)', 'renewal_date', 'category', 'active_seats', 'total_seats', 'status'] },
    { name: 'invoices_temp', desc: 'Caching cache for unstructured raw OCR extracts processed by Gemini.', columns: ['id (UUID, PK)', 'organization_id (UUID, FK)', 'file_name', 'raw_text', 'status (pending/processed/failed)', 'extracted_data (JSONB)', 'created_at'] }
  ];

  const layoutStyles = {
    slate: {
      card: 'bg-white border-slate-200 shadow-sm rounded-2xl',
      title: 'text-slate-900',
      sub: 'text-slate-500',
      subCard: 'bg-white border-slate-200 shadow-sm rounded-xl',
      subCardTitle: 'text-slate-900',
      tableBorder: 'border-l-3 border-slate-200',
      tableName: 'text-slate-800',
      columnBadge: 'bg-slate-50 border-slate-200 text-slate-600',
      infoBox: 'bg-blue-50 border border-blue-100 text-blue-800',
      infoTitle: 'text-blue-900',
      connBox: 'bg-slate-50 border border-slate-200 text-slate-800',
      connTitle: 'text-slate-800',
    },
    midnight: {
      card: 'bg-[#0c1222] border-slate-800/80 shadow-md rounded-2xl',
      title: 'text-white',
      sub: 'text-slate-400',
      subCard: 'bg-[#0c1222] border border-slate-800/80 shadow-md rounded-xl',
      subCardTitle: 'text-white',
      tableBorder: 'border-l-3 border-slate-800',
      tableName: 'text-slate-200',
      columnBadge: 'bg-[#080d19] border-slate-800/60 text-slate-400',
      infoBox: 'bg-blue-950/20 border border-blue-800/30 text-blue-300',
      infoTitle: 'text-blue-200',
      connBox: 'bg-[#080d19] border border-slate-800/80 text-white',
      connTitle: 'text-slate-200',
    },
    nordic: {
      card: 'bg-white border border-blue-100 shadow-sm rounded-2xl',
      title: 'text-[#1e293b]',
      sub: 'text-slate-500',
      subCard: 'bg-white border border-blue-100 shadow-sm rounded-xl',
      subCardTitle: 'text-[#1e293b]',
      tableBorder: 'border-l-3 border-slate-200',
      tableName: 'text-slate-800',
      columnBadge: 'bg-slate-50 border-slate-200 text-slate-600',
      infoBox: 'bg-blue-50 border border-blue-100 text-blue-800',
      infoTitle: 'text-blue-900',
      connBox: 'bg-slate-50 border border-blue-100 text-[#1e293b]',
      connTitle: 'text-slate-800',
    },
    warm: {
      card: 'bg-[#fbf9f5] border border-[#ebdcd0] shadow-xs rounded-2xl',
      title: 'text-[#2e2620]',
      sub: 'text-[#7a6d61]',
      subCard: 'bg-[#fbf9f5] border border-[#ebdcd0] shadow-xs rounded-xl',
      subCardTitle: 'text-[#2e2620]',
      tableBorder: 'border-l-3 border-[#ebdcd0]',
      tableName: 'text-[#2e2620]',
      columnBadge: 'bg-[#f4ebe1] border border-[#ebdcd0] text-[#7a6d61]',
      infoBox: 'bg-[#ebdcd0]/30 border border-[#dbcebf] text-[#2e2620]',
      infoTitle: 'text-[#2e2620]',
      connBox: 'bg-[#ebdcd0]/10 border border-[#ebdcd0] text-[#2e2620]',
      connTitle: 'text-[#2e2620]',
    },
    brutalist: {
      card: 'bg-white border-3.5 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      title: 'text-black font-mono font-black uppercase tracking-tight',
      sub: 'text-zinc-700 font-mono text-xs font-semibold',
      subCard: 'bg-white border-2.5 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
      subCardTitle: 'text-black font-mono font-bold uppercase tracking-wider text-xs',
      tableBorder: 'border-l-3 border-black',
      tableName: 'text-black font-mono font-black text-xs',
      columnBadge: 'bg-zinc-100 border border-black text-black font-mono rounded-none',
      infoBox: 'bg-[#facc15]/10 border-2 border-black text-black rounded-none',
      infoTitle: 'text-black font-mono font-black uppercase text-xs',
      connBox: 'bg-zinc-100 border-2 border-black text-black rounded-none',
      connTitle: 'text-black font-mono font-bold uppercase text-xs',
    },
    cyberneon: {
      card: 'bg-[#090514] border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.05)] rounded-2xl',
      title: 'text-white font-bold',
      sub: 'text-cyan-400/70 font-mono text-[11px]',
      subCard: 'bg-[#090514] border border-fuchsia-500/20 shadow-[0_0_12px_rgba(217,70,239,0.05)] rounded-xl',
      subCardTitle: 'text-white font-bold',
      tableBorder: 'border-l-3 border-fuchsia-500/30',
      tableName: 'text-cyan-300 font-mono font-bold text-xs',
      columnBadge: 'bg-[#06030c] border border-fuchsia-500/20 text-fuchsia-400 font-mono rounded text-[10px]',
      infoBox: 'bg-purple-950/20 border border-fuchsia-500/20 text-fuchsia-300 rounded-xl',
      infoTitle: 'text-fuchsia-200 font-bold',
      connBox: 'bg-[#06030c] border border-fuchsia-500/20 text-cyan-400 font-mono rounded-xl',
      connTitle: 'text-cyan-400 font-bold',
    }
  }[theme];

  return (
    <div id="postgres-db-pane" className="space-y-8 font-sans">
      {/* DB Overview Header */}
      <div className={`border p-6 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${layoutStyles.card}`}>
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10.5px] font-bold font-mono px-2 py-0.5 uppercase rounded">
              PostgreSQL
            </span>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10.5px] font-bold font-mono px-2 py-0.5 uppercase rounded flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> RLS Enabled
            </span>
          </div>
          <h2 className={`text-xl font-bold tracking-tight font-sans ${layoutStyles.title}`}>Multi-Tenant Storage & RLS Schema</h2>
          <p className={`text-xs leading-relaxed font-sans ${layoutStyles.sub}`}>
            Securely isolated on Supabase with Row Level Security (RLS). Every query automatically verifies tenant context before executing read/write commands, preventing database intrusion.
          </p>
        </div>

        {/* Supabase Status Indicator */}
        <div className={`p-4 min-w-56 space-y-2 ${layoutStyles.connBox}`}>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-500" />
            <span className={`text-xs font-bold ${layoutStyles.connTitle}`}>Connection State</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-emerald-700 font-medium">Supabase Connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: PostgreSQL Schema Explorer */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 space-y-4 ${layoutStyles.subCard}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${layoutStyles.subCardTitle}`}>
              <Key className="h-4 w-4 text-blue-500" />
              Relational Tables
            </h3>
            
            <div className="space-y-4.5">
              {dbTables.map(tbl => (
                <div key={tbl.name} className={`pl-4 space-y-1.5 ${layoutStyles.tableBorder}`}>
                  <span className={`font-mono text-xs font-bold block ${layoutStyles.tableName}`}>{tbl.name}</span>
                  <p className={`text-[11px] leading-relaxed font-sans ${layoutStyles.sub}`}>{tbl.desc}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tbl.columns.map(col => (
                      <span key={col} className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded border ${layoutStyles.columnBadge}`}>
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 space-y-3 ${layoutStyles.infoBox}`}>
            <h4 className={`text-xs font-bold flex items-center gap-1.5 ${layoutStyles.infoTitle}`}>
              <Info className="h-4 w-4" />
              B2B RLS Security Framework
            </h4>
            <p className="text-[11px] leading-relaxed font-sans opacity-90">
              RLS policies inspect the executing session identity using <code className="bg-blue-100/30 px-1 py-0.5 rounded font-mono">auth.uid()</code>. The lookup checks the <code className="bg-blue-100/30 px-1 py-0.5 rounded font-mono">profiles</code> table to confirm the matching <code className="bg-blue-100/30 px-1 py-0.5 rounded font-mono">organization_id</code>. Under this rule, a user is statically restricted from reading or mutating any records belonging to outside tenants, guaranteeing RLS isolation.
            </p>
          </div>
        </div>

        {/* Right column: SQL Copy-Paste DDL Terminal */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-lg">
          {/* Editor Header */}
          <div className="bg-slate-900/60 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs text-slate-200 font-semibold">schema_ddl_and_rls.sql</span>
            </div>
            <button
              onClick={handleCopy}
              className="bg-slate-800 text-slate-200 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy SQL Script'}
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-5 overflow-auto max-h-[500px]">
            <pre className="text-[10.5px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
              {POSTGRES_DDL_SCRIPT}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
