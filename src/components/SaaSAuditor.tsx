import React, { useState } from 'react';
import { runSaaSAudit, parseUnstructuredInvoice } from '../lib/geminiClient';
import { Subscription, AuditInsight, AuditResponse } from '../types';
import { Sparkles, Activity, FileText, ArrowUpRight, CheckCircle, RefreshCw, AlertTriangle, AlertCircle, TrendingDown, HelpCircle } from 'lucide-react';

interface SaaSAuditorProps {
  subscriptions: Subscription[];
  onApplyOptimization: (toolName: string, actionItem: string, potentialSavings: number) => void;
  onImportSubscription: (sub: Omit<Subscription, 'id'>) => void;
  theme?: 'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist' | 'cyberneon';
}

const SAMPLE_INVOICE_TEXT = `----------------------------------------
INVOICE #INV-2026-94812
Date: July 12, 2026
Seller: Salesforce.com Inc.
Client: Optima Enterprises Inc.

PRODUCT DESCRIPTION:
Salesforce CRM Enterprise - 25 Annual Seats
Contract Term: 12 Months
Billing Cycle: Monthly Pay-As-You-Go

Line Items:
- 25 x CRM Enterprise seats @ $150.00/month = $3,750.00

Total Amount Due: $3,750.00
Payment Status: PAID
----------------------------------------
Thank you for your business. For seat additions or team active logs, please contact billing@salesforce.com. Only 11 seats have active logins recorded in the past 90 days. Please deprovision inactive developers.`;

const SAMPLE_EMAIL_TEXT = `---------- Forwarded message ---------
From: Slack Technologies <no-reply@slack.com>
Date: Wed, Jun 24, 2026 at 10:14 AM
Subject: Your Slack Business Pro subscription renewal receipt
To: Tanmay <mishratanmay225@gmail.com>

Receipt for Optima Enterprises
Billing period: Jun 24, 2026 - Jul 24, 2026

Your credit card ending in 4921 has been charged $375.00 for 30 users.
Details: Slack Business Pro Tier ($12.50 per user per month).
Currently active team members: 30 of 30.

Need to change your seat allocation? Visit workspace settings.`;

export default function SaaSAuditor({ subscriptions, onApplyOptimization, onImportSubscription, theme = 'slate' }: SaaSAuditorProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResponse, setAuditResponse] = useState<AuditResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [appliedTools, setAppliedTools] = useState<string[]>([]);

  // OCR ingestion states
  const [invoiceText, setInvoiceText] = useState(SAMPLE_INVOICE_TEXT);
  const [isParsingInvoice, setIsParsingInvoice] = useState(false);
  const [parsedSubscription, setParsedSubscription] = useState<any | null>(null);
  const [parsedStatusMsg, setParsedStatusMsg] = useState<string>('');

  // Execution logs animation simulation for AI depth
  const runAuditReasoningAnimation = async () => {
    setIsAuditing(true);
    setAuditResponse(null);
    setAuditLogs([]);

    const logSteps = [
      'Initializing B2B SaaS Auditor context...',
      'Mapping active multi-tenant organization index: org_enterprise_optima...',
      'Analyzing cross-tool categorical dependencies (Category: Communication / Collaboration)...',
      'Scanning seat utilization matrix (comparing active logins vs total licenses)...',
      'Running Gemini intelligence reasoner model "gemini-2.5-flash"...',
      'Cross-checking overlap redundancy metrics (MS Teams vs Zoom & Slack)...',
      'Synthesizing actionable optimization matrix and calculating dollar savings...',
      'Finalizing strict structured JSON response compilation...'
    ];

    for (let i = 0; i < logSteps.length; i++) {
      setAuditLogs(prev => [...prev, logSteps[i]]);
      await new Promise(resolve => setTimeout(resolve, 450));
    }

    try {
      const result = await runSaaSAudit(subscriptions);
      setAuditResponse(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyInsight = (insight: AuditInsight) => {
    onApplyOptimization(insight.tool, insight.action_item, insight.potential_savings);
    setAppliedTools(prev => [...prev, insight.tool]);
  };

  const handleParseInvoice = async () => {
    setIsParsingInvoice(true);
    setParsedSubscription(null);
    setParsedStatusMsg('Sending unstructured document to Gemini Ingestion model...');
    
    try {
      const data = await parseUnstructuredInvoice(invoiceText);
      setParsedSubscription(data);
      setParsedStatusMsg('Successfully extracted subscription variables!');
    } catch (err: any) {
      setParsedStatusMsg('Failed to process text. Using fallback rules.');
    } finally {
      setIsParsingInvoice(false);
    }
  };

  const handleImportParsed = () => {
    if (!parsedSubscription) return;
    onImportSubscription({
      organization_id: 'org_enterprise_optima',
      service_name: parsedSubscription.service_name,
      cost: parsedSubscription.cost,
      billing_cycle: parsedSubscription.billing_cycle,
      renewal_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      category: parsedSubscription.category,
      active_seats: parsedSubscription.active_seats,
      total_seats: parsedSubscription.total_seats,
      status: parsedSubscription.active_seats < parsedSubscription.total_seats ? 'Underused' : 'Active'
    });
    setParsedSubscription(null);
  };

  const layoutStyles = {
    slate: {
      banner: 'bg-slate-900 border-slate-800 text-white rounded-2xl',
      bannerBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl',
      card: 'bg-white border-slate-200 shadow-sm rounded-xl',
      title: 'text-slate-900',
      sub: 'text-slate-500',
      textMain: 'text-slate-800',
      badgeHigh: 'bg-rose-100 text-rose-800 rounded-full',
      badgeMed: 'bg-amber-100 text-amber-800 rounded-full',
      badgeLow: 'bg-blue-100 text-blue-800 rounded-full',
      recBox: 'bg-slate-50 border border-slate-200 rounded-lg',
      recBtn: 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 rounded-lg',
      textarea: 'bg-slate-950 text-slate-200 border-slate-800 focus:ring-emerald-500 rounded-lg',
      importBtn: 'bg-slate-900 hover:bg-slate-800 text-white rounded-lg',
      confirmBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg',
    },
    midnight: {
      banner: 'bg-[#0c1222] border-slate-800/80 text-white shadow-md rounded-2xl',
      bannerBtn: 'bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl shadow-teal-400/15',
      card: 'bg-[#0c1222] border border-slate-800/80 shadow-md rounded-xl',
      title: 'text-white',
      sub: 'text-slate-400',
      textMain: 'text-slate-200',
      badgeHigh: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full',
      badgeMed: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full',
      badgeLow: 'bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full',
      recBox: 'bg-[#080d19] border border-slate-800/80 rounded-lg',
      recBtn: 'bg-teal-400 text-slate-950 border-teal-400 hover:bg-teal-300 rounded-lg font-bold',
      textarea: 'bg-[#080d19] text-slate-200 border border-slate-800 focus:ring-teal-400 rounded-lg',
      importBtn: 'bg-teal-400 text-slate-950 border-teal-400 hover:bg-teal-300 rounded-lg font-bold',
      confirmBtn: 'bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-lg font-bold shadow-teal-400/20',
    },
    nordic: {
      banner: 'bg-slate-900 border-slate-800 text-white shadow-md rounded-2xl',
      bannerBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl',
      card: 'bg-white border border-blue-100 shadow-sm rounded-xl',
      title: 'text-[#1e293b]',
      sub: 'text-slate-500',
      textMain: 'text-slate-700',
      badgeHigh: 'bg-rose-100 text-rose-800 rounded-full',
      badgeMed: 'bg-amber-100 text-amber-800 rounded-full',
      badgeLow: 'bg-blue-100 text-blue-800 rounded-full',
      recBox: 'bg-[#f8fafc] border border-slate-100 rounded-lg',
      recBtn: 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500 rounded-lg',
      textarea: 'bg-slate-950 text-slate-200 border-slate-800 focus:ring-indigo-500 rounded-lg',
      importBtn: 'bg-slate-900 hover:bg-slate-800 text-white rounded-lg',
      confirmBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-indigo-600/10',
    },
    warm: {
      banner: 'bg-[#ebdcd0] border-[#dbcebf] text-[#2e2620] rounded-2xl',
      bannerBtn: 'bg-[#c2410c] hover:bg-[#b43e0b] text-white rounded-xl',
      card: 'bg-[#fbf9f5] border border-[#ebdcd0] shadow-xs rounded-xl',
      title: 'text-[#2e2620]',
      sub: 'text-[#7a6d61]',
      textMain: 'text-[#2e2620]',
      badgeHigh: 'bg-rose-100 text-rose-800 rounded-full',
      badgeMed: 'bg-amber-100 text-amber-800 rounded-full',
      badgeLow: 'bg-orange-100 text-orange-800 rounded-full',
      recBox: 'bg-[#f4ebe1] border border-[#ebdcd0] rounded-lg',
      recBtn: 'bg-[#c2410c] text-white border-[#c2410c] hover:bg-[#b43e0b] rounded-lg',
      textarea: 'bg-white text-[#2e2620] border border-[#ebdcd0] focus:ring-[#c2410c] rounded-lg',
      importBtn: 'bg-[#c2410c] hover:bg-[#b43e0b] text-white rounded-lg',
      confirmBtn: 'bg-[#c2410c] hover:bg-[#b43e0b] text-white rounded-lg shadow-[#c2410c]/10',
    },
    brutalist: {
      banner: 'bg-[#facc15] border-3.5 border-black text-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6',
      bannerBtn: 'bg-black border-2 border-black text-white hover:bg-zinc-800 rounded-none font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]',
      card: 'bg-white border-2.5 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      title: 'text-black font-mono font-black uppercase tracking-tight',
      sub: 'text-zinc-700 font-mono text-xs',
      textMain: 'text-black font-mono',
      badgeHigh: 'bg-red-400 text-black border-1.5 border-black rounded-none font-mono font-bold uppercase text-[9px] px-2',
      badgeMed: 'bg-yellow-400 text-black border-1.5 border-black rounded-none font-mono font-bold uppercase text-[9px] px-2',
      badgeLow: 'bg-blue-400 text-black border-1.5 border-black rounded-none font-mono font-bold uppercase text-[9px] px-2',
      recBox: 'bg-zinc-50 border-2 border-black rounded-none',
      recBtn: 'bg-[#facc15] text-black border-2 border-black hover:bg-yellow-400 font-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px]',
      textarea: 'bg-white text-black border-2 border-black focus:bg-yellow-50 rounded-none font-mono font-bold',
      importBtn: 'bg-black text-white border-2 border-black hover:bg-zinc-800 font-black rounded-none uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      confirmBtn: 'bg-[#facc15] text-black border-2 border-black hover:bg-yellow-400 font-black rounded-none uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px]',
    },
    cyberneon: {
      banner: 'bg-[#06030c] border-fuchsia-500/20 text-white rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.1)]',
      bannerBtn: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-cyan-300 hover:to-fuchsia-400 text-black font-extrabold rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.4)]',
      card: 'bg-[#090514] border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.05)] rounded-xl',
      title: 'text-white',
      sub: 'text-cyan-400/70 font-mono text-[11px]',
      textMain: 'text-slate-200',
      badgeHigh: 'bg-rose-950/80 text-rose-400 border border-rose-500/30 rounded-full font-mono font-bold text-[10px]',
      badgeMed: 'bg-amber-950/80 text-amber-400 border border-amber-500/30 rounded-full font-mono font-bold text-[10px]',
      badgeLow: 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 rounded-full font-mono font-bold text-[10px]',
      recBox: 'bg-[#0c0817] border border-fuchsia-500/15 rounded-lg',
      recBtn: 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black border-transparent hover:from-cyan-400 hover:to-fuchsia-400 rounded-lg font-bold',
      textarea: 'bg-[#050308] text-slate-200 border border-fuchsia-500/30 focus:ring-fuchsia-500 rounded-lg',
      importBtn: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg',
      confirmBtn: 'bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.3)]',
    }
  }[theme];

  return (
    <div id="saas-auditor-module" className="space-y-8 font-sans">
      {/* Module Banner */}
      <div className={`border transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 ${layoutStyles.banner}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-[10px] font-mono font-semibold uppercase flex items-center gap-1.5 ${
              theme === 'brutalist' 
                ? 'bg-[#facc15] border-2 border-black text-black rounded-none font-bold' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full'
            }`}>
              <Sparkles className="h-3 w-3" />
              Autonomous Agent
            </span>
            <span className={`text-xs font-mono ${theme === 'warm' ? 'text-[#7a6d61]' : theme === 'brutalist' ? 'text-black font-bold' : 'text-slate-400'}`}>powered by gemini-2.5-flash</span>
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${theme === 'warm' ? 'text-[#2e2620]' : theme === 'brutalist' ? 'text-black font-mono font-black uppercase' : 'text-white'}`}>SaaS Auditor</h2>
          <p className={`text-sm max-w-xl ${theme === 'warm' ? 'text-[#7a6d61]' : theme === 'brutalist' ? 'text-black font-semibold' : 'text-slate-300'}`}>
            SaaS-Optima's agentic optimizer analyzes stack overlaps, seat leakage anomalies, and right-sizes your subscriptions instantly.
          </p>
        </div>
        <button
          onClick={runAuditReasoningAnimation}
          disabled={isAuditing}
          className={`font-bold px-6 py-3 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer text-sm font-sans ${layoutStyles.bannerBtn}`}
        >
          {isAuditing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
          {isAuditing ? 'Auditing Stack...' : 'Audit Current Stack'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Audit Output & AI Logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Audit Logs Loader */}
          {isAuditing && (
            <div className={`rounded-xl border p-6 shadow-inner text-xs font-mono ${
              theme === 'brutalist' 
                ? 'bg-white border-2 border-black text-black' 
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <div className={`flex items-center justify-between mb-4 pb-2 border-b ${theme === 'brutalist' ? 'border-black' : 'border-slate-800'}`}>
                <span className={`font-bold uppercase tracking-wider text-[10px] ${theme === 'brutalist' ? 'text-black' : 'text-emerald-400'}`}>Auditor Intelligence Stream</span>
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'brutalist' ? 'bg-black' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === 'brutalist' ? 'bg-black' : 'bg-emerald-500'}`}></span>
                </span>
              </div>
              <div className="space-y-2">
                {auditLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 animate-fade-in">
                    <span className="text-slate-500">&gt;</span>
                    <span className={index === auditLogs.length - 1 ? (theme === 'brutalist' ? 'text-black font-black' : 'text-emerald-300 font-semibold') : 'text-slate-400'}>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actual Audit Results */}
          {auditResponse && !isAuditing && (
            <div className="space-y-6">
              {/* Savings Meter Card */}
              <div className={`border p-6 flex items-center justify-between ${
                theme === 'brutalist' 
                  ? 'bg-yellow-400 border-2.5 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : theme === 'warm'
                  ? 'bg-[#ebdcd0]/40 border-[#ebdcd0] rounded-xl'
                  : 'bg-emerald-50 border-emerald-100 rounded-xl'
              }`}>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${theme === 'brutalist' ? 'text-black' : theme === 'warm' ? 'text-[#7a6d61]' : 'text-emerald-800'}`}>Estimated Inefficiency Savings</p>
                  <p className={`text-4xl font-extrabold font-mono mt-1 ${theme === 'brutalist' ? 'text-black' : 'text-emerald-950'}`}>
                    ${auditResponse.summary.potential_savings.toLocaleString()}
                    <span className={`text-xs font-medium font-sans ${theme === 'brutalist' ? 'text-black' : 'text-emerald-700'}`}> / month target</span>
                  </p>
                  <p className={`text-xs mt-2 ${theme === 'brutalist' ? 'text-black font-semibold' : theme === 'warm' ? 'text-[#7a6d61]' : 'text-emerald-700'}`}>
                    Actioning the below recommendations can reduce your monthly B2B run-rate by {Math.round((auditResponse.summary.potential_savings / (auditResponse.summary.total_spend || 1)) * 100)}%.
                  </p>
                </div>
                <div className={`p-4 rounded-full border ${
                  theme === 'brutalist' 
                    ? 'bg-white text-black border-2 border-black' 
                    : theme === 'warm'
                    ? 'bg-[#ebdcd0] text-[#2e2620] border-[#dbcebf]'
                    : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                }`}>
                  <TrendingDown className="h-8 w-8" />
                </div>
              </div>

              {/* Insights List */}
              <div className="space-y-4">
                <h3 className={`text-base font-bold flex items-center gap-2 ${layoutStyles.title}`}>
                  <AlertCircle className={`h-5 w-5 ${theme === 'brutalist' ? 'text-black' : 'text-emerald-600'}`} />
                  SaaS Auditor Anomalies Detected ({auditResponse.insights.length})
                </h3>

                {auditResponse.insights.length > 0 ? (
                  auditResponse.insights.map((insight, idx) => {
                    const isApplied = appliedTools.includes(insight.tool);
                    const badgeClass = insight.severity === 'high' ? layoutStyles.badgeHigh : insight.severity === 'medium' ? layoutStyles.badgeMed : layoutStyles.badgeLow;

                    return (
                      <div
                        key={idx}
                        className={`border p-5 transition-all duration-150 space-y-4 ${layoutStyles.card} ${
                          isApplied ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <h4 className={`font-bold text-sm font-sans ${layoutStyles.title}`}>{insight.tool}</h4>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase ${badgeClass}`}>
                                {insight.severity} Priority
                              </span>
                            </div>
                            <p className={`text-xs font-sans mt-1 leading-relaxed ${layoutStyles.sub}`}>{insight.issue}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs font-medium ${layoutStyles.sub}`}>Potential Savings</p>
                            <p className="text-base font-bold text-emerald-600 font-mono mt-0.5">${insight.potential_savings}/mo</p>
                          </div>
                        </div>

                        {/* Action Container */}
                        <div className={`p-3.5 flex items-center justify-between gap-4 ${layoutStyles.recBox}`}>
                          <div className="flex items-start gap-2">
                            <ArrowUpRight className={`h-4 w-4 shrink-0 mt-0.5 ${theme === 'brutalist' ? 'text-black' : 'text-emerald-500'}`} />
                            <p className={`text-xs font-sans leading-relaxed ${layoutStyles.textMain}`}>
                              <span className="font-bold">Recommendation:</span> {insight.action_item}
                            </p>
                          </div>
                          <button
                            onClick={() => handleApplyInsight(insight)}
                            disabled={isApplied}
                            className={`shrink-0 text-xs font-semibold px-3 py-1.5 border transition cursor-pointer ${
                              isApplied
                                ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
                                : layoutStyles.recBtn
                            }`}
                          >
                            {isApplied ? 'Optimization Applied' : 'Execute Optimization'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={`border p-8 text-center ${layoutStyles.card}`}>
                    <CheckCircle className={`h-8 w-8 mx-auto mb-3 ${theme === 'brutalist' ? 'text-black' : 'text-emerald-500'}`} />
                    <p className={`font-bold font-sans text-sm ${layoutStyles.title}`}>Perfect Score! No leakage detected.</p>
                    <p className={`text-xs mt-1 ${layoutStyles.sub}`}>Your SaaS allocations are perfectly configured and optimal.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!auditResponse && !isAuditing && (
            <div className={`border p-8 text-center space-y-4 ${layoutStyles.card}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto border ${
                theme === 'brutalist' 
                  ? 'bg-yellow-400 text-black border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-bold font-sans text-sm ${layoutStyles.title}`}>Initiate First SaaS Stack Audit</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${layoutStyles.sub}`}>
                  Click 'Audit Current Stack' to scan your multi-tenant subscriptions with the Google Gemini auditing model.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Unstructured Document OCR Ingestion Scanner */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`border p-6 transition-all duration-200 space-y-5 ${layoutStyles.card}`}>
            <div className="space-y-1">
              <h3 className={`text-sm font-bold font-sans flex items-center gap-2 ${layoutStyles.title}`}>
                <FileText className={`h-4.5 w-4.5 ${theme === 'brutalist' ? 'text-black' : 'text-slate-500'}`} />
                OCR Bill Ingestion Scanner
              </h3>
              <p className={`text-xs font-sans leading-relaxed ${layoutStyles.sub}`}>
                Paste unstructured billing emails, receipts, or invoices below. Gemini will extract variables for B2B entry.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceText(SAMPLE_INVOICE_TEXT)}
                  className={`text-[10px] font-mono font-semibold px-2 py-1 transition-colors ${
                    theme === 'brutalist' 
                      ? 'border-2 border-black bg-white hover:bg-zinc-200 text-black rounded-none' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 rounded'
                  }`}
                >
                  Load Salesforce Bill
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceText(SAMPLE_EMAIL_TEXT)}
                  className={`text-[10px] font-mono font-semibold px-2 py-1 transition-colors ${
                    theme === 'brutalist' 
                      ? 'border-2 border-black bg-white hover:bg-zinc-200 text-black rounded-none' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 rounded'
                  }`}
                >
                  Load Slack Renewal Email
                </button>
              </div>
              <textarea
                value={invoiceText}
                onChange={(e) => setInvoiceText(e.target.value)}
                rows={9}
                className={`w-full text-xs font-mono p-3 outline-none ${layoutStyles.textarea}`}
                placeholder="Paste bill/receipt content here..."
              />
            </div>

            <button
              onClick={handleParseInvoice}
              disabled={isParsingInvoice || !invoiceText.trim()}
              className={`w-full font-bold text-xs py-2.5 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${layoutStyles.importBtn}`}
            >
              {isParsingInvoice ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {isParsingInvoice ? 'AI Parsing Document...' : 'Run Gemini Ingest OCR'}
            </button>

            {parsedStatusMsg && (
              <p className={`text-[10.5px] font-mono border-t pt-3 flex items-center gap-1.5 ${theme === 'midnight' ? 'border-slate-800' : 'border-slate-100'} ${layoutStyles.sub}`}>
                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${theme === 'brutalist' ? 'bg-black' : 'bg-blue-500'}`}></span>
                {parsedStatusMsg}
              </p>
            )}

            {/* Ingestion results preview */}
            {parsedSubscription && (
              <div className={`border p-4 space-y-4 animate-fade-in text-xs ${layoutStyles.recBox}`}>
                <div className={`flex items-center justify-between border-b pb-2 ${theme === 'brutalist' ? 'border-black' : 'border-slate-200'}`}>
                  <span className={`font-bold text-[11px] ${layoutStyles.textMain}`}>Extracted Variables</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 uppercase ${
                    theme === 'brutalist' ? 'bg-black text-[#facc15] rounded-none' : 'bg-emerald-100 text-emerald-800 rounded'
                  }`}>Ingest Ready</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-sans">
                  <div>
                    <span className={`block text-[10px] ${layoutStyles.sub}`}>Service Name</span>
                    <span className={`font-semibold ${layoutStyles.title}`}>{parsedSubscription.service_name}</span>
                  </div>
                  <div>
                    <span className={`block text-[10px] ${layoutStyles.sub}`}>Category</span>
                    <span className={`font-semibold ${layoutStyles.title}`}>{parsedSubscription.category}</span>
                  </div>
                  <div>
                    <span className={`block text-[10px] ${layoutStyles.sub}`}>Cost / Period</span>
                    <span className={`font-mono font-bold ${layoutStyles.title}`}>${parsedSubscription.cost} ({parsedSubscription.billing_cycle})</span>
                  </div>
                  <div>
                    <span className={`block text-[10px] ${layoutStyles.sub}`}>User Allocation</span>
                    <span className={`font-mono font-medium ${layoutStyles.title}`}>{parsedSubscription.active_seats} / {parsedSubscription.total_seats} seats active</span>
                  </div>
                </div>

                <button
                  onClick={handleImportParsed}
                  className={`w-full font-bold text-xs py-2 transition mt-2 cursor-pointer ${layoutStyles.confirmBtn}`}
                >
                  Confirm Ingestion & Import to Inventory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
