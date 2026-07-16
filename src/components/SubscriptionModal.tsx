import React, { useState } from 'react';
import { Subscription } from '../types';
import { X, Upload, Check, FileText, Loader2 } from 'lucide-react';
import { parseUnstructuredInvoice } from '../lib/geminiClient';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Omit<Subscription, 'id'>) => void;
  theme?: 'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist' | 'cyberneon';
}

export default function SubscriptionModal({ isOpen, onClose, onSave, theme = 'slate' }: SubscriptionModalProps) {
  const [serviceName, setServiceName] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [renewalDate, setRenewalDate] = useState('');
  const [category, setCategory] = useState<Subscription['category']>('Collaboration');
  const [totalSeats, setTotalSeats] = useState('1');
  const [activeSeats, setActiveSeats] = useState('1');

  // Drag-and-drop status states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'reading' | 'parsing' | 'done'>('idle');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !cost || !renewalDate) return;

    onSave({
      organization_id: 'org_enterprise_optima',
      service_name: serviceName,
      cost: parseFloat(cost),
      billing_cycle: billingCycle,
      renewal_date: renewalDate,
      category,
      active_seats: parseInt(activeSeats, 10),
      total_seats: parseInt(totalSeats, 10),
      status: parseInt(activeSeats, 10) < parseInt(totalSeats, 10) ? 'Underused' : 'Active',
    });

    // Reset fields
    setServiceName('');
    setCost('');
    setRenewalDate('');
    setCategory('Collaboration');
    setTotalSeats('1');
    setActiveSeats('1');
    setUploadProgress('idle');
    onClose();
  };

  // Simulating dragging & dropping B2B invoice
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      setUploadProgress('reading');

      // Step 1: Simulate reading file binary OCR text
      await new Promise(resolve => setTimeout(resolve, 800));
      setUploadProgress('parsing');

      // Step 2: Formulate some unstructured OCR text context depending on dropped file name
      let simulatedOCRText = `INVOICE STATEMENT\nProvider: GitHub Enterprise Inc.\nBilled amount: $504.00 per year\nLicensing allocation: 24 active seats of 24 total available.\nRenewal: 2027-04-12`;
      if (file.name.toLowerCase().includes('datadog')) {
        simulatedOCRText = `DATADOG BILLING INVOICE\nAPM Core Monitoring Integration\nAmount charged: $1280.00 monthly recurring cost\nLicense metrics: 15 agents configured (9 active in logs).\nNext invoice: 2026-08-15`;
      } else if (file.name.toLowerCase().includes('adobe')) {
        simulatedOCRText = `ADOBE SYSTEMS RECEIPT\nCreative Cloud Team Pack\n$419.00 USD charged per month.\nSeats: 5 team designers. Renewal: 2026-08-01`;
      }

      try {
        const parsed = await parseUnstructuredInvoice(simulatedOCRText);
        setServiceName(parsed.service_name || '');
        setCost(parsed.cost?.toString() || '');
        setBillingCycle(parsed.billing_cycle === 'annual' ? 'annual' : 'monthly');
        setCategory(parsed.category || 'Collaboration');
        setTotalSeats(parsed.total_seats?.toString() || '1');
        setActiveSeats(parsed.active_seats?.toString() || '1');
        setRenewalDate(new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]);
        setUploadProgress('done');
      } catch (err) {
        console.error('Invoice drop parser error:', err);
        setUploadProgress('idle');
      }
    }
  };

  const layoutStyles = {
    slate: {
      overlay: 'bg-slate-900/60 backdrop-blur-xs',
      modal: 'bg-white rounded-2xl shadow-xl border border-slate-200',
      header: 'bg-slate-50 border-b border-slate-100',
      title: 'text-slate-900',
      sub: 'text-slate-500',
      input: 'bg-white border-slate-200 focus:ring-emerald-500 text-slate-800 rounded-lg',
      label: 'text-slate-500',
      buttonCycleActive: 'bg-slate-900 text-white border-slate-900 rounded-lg',
      buttonCycleInactive: 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg',
      footer: 'bg-slate-50 border-t border-slate-100',
      buttonCancel: 'border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg',
      buttonSave: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-emerald-500/10',
      dragBox: 'border-slate-200 hover:border-slate-300 bg-slate-50/30 rounded-xl',
      dragIconBg: 'bg-white border border-slate-200 text-slate-400',
      dragTextMain: 'text-slate-700',
    },
    midnight: {
      overlay: 'bg-[#03060c]/85 backdrop-blur-sm',
      modal: 'bg-[#0c1222] border border-slate-800 shadow-2xl shadow-black/80',
      header: 'bg-[#080d19] border-b border-slate-800/80',
      title: 'text-white',
      sub: 'text-slate-400',
      input: 'bg-[#080d19] border-slate-800 focus:ring-teal-400 text-white focus:border-teal-400 rounded-lg',
      label: 'text-slate-400',
      buttonCycleActive: 'bg-teal-400 text-slate-950 border-teal-400 font-bold rounded-lg',
      buttonCycleInactive: 'bg-[#080d19] text-slate-300 border-slate-800 hover:bg-slate-800/40 rounded-lg',
      footer: 'bg-[#080d19] border-t border-slate-800/80',
      buttonCancel: 'border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg',
      buttonSave: 'bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-lg shadow-teal-400/20',
      dragBox: 'border-slate-800 bg-[#080d19]/40 rounded-xl',
      dragIconBg: 'bg-[#131b31] border border-slate-800 text-slate-300',
      dragTextMain: 'text-slate-300',
    },
    nordic: {
      overlay: 'bg-slate-900/60 backdrop-blur-xs',
      modal: 'bg-white rounded-2xl shadow-xl border border-blue-100',
      header: 'bg-[#f8fafc] border-b border-slate-100',
      title: 'text-[#1e293b]',
      sub: 'text-slate-500',
      input: 'bg-white border-slate-200 focus:ring-indigo-600 text-slate-800 rounded-lg',
      label: 'text-slate-500',
      buttonCycleActive: 'bg-indigo-600 text-white border-indigo-600 rounded-lg',
      buttonCycleInactive: 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg',
      footer: 'bg-[#f8fafc] border-t border-slate-100',
      buttonCancel: 'border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg',
      buttonSave: 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-indigo-500/10',
      dragBox: 'border-blue-100 bg-[#f8fafc]/50 rounded-xl',
      dragIconBg: 'bg-white border border-blue-100 text-slate-400',
      dragTextMain: 'text-slate-700',
    },
    warm: {
      overlay: 'bg-[#2e2620]/60 backdrop-blur-xs',
      modal: 'bg-[#fbf9f5] border border-[#ebdcd0] shadow-xl',
      header: 'bg-[#f4ebe1] border-b border-[#ebdcd0]',
      title: 'text-[#2e2620]',
      sub: 'text-[#7a6d61]',
      input: 'bg-white border-[#ebdcd0] focus:ring-[#c2410c] text-[#2e2620] rounded-lg',
      label: 'text-[#7a6d61]',
      buttonCycleActive: 'bg-[#c2410c] text-white border-[#c2410c] rounded-lg',
      buttonCycleInactive: 'bg-white text-[#7a6d61] border-[#ebdcd0] hover:bg-[#ebdcd0]/20 rounded-lg',
      footer: 'bg-[#f4ebe1] border-t border-[#ebdcd0]',
      buttonCancel: 'border-[#ebdcd0] text-[#7a6d61] hover:bg-white rounded-lg',
      buttonSave: 'bg-[#c2410c] hover:bg-[#b43e0b] text-white rounded-lg shadow-[#c2410c]/10',
      dragBox: 'border-[#ebdcd0] hover:border-[#dbcebf] bg-[#f4ebe1]/30 rounded-xl',
      dragIconBg: 'bg-white border border-[#ebdcd0] text-[#7a6d61]',
      dragTextMain: 'text-[#2e2620]',
    },
    brutalist: {
      overlay: 'bg-black/60 backdrop-blur-none',
      modal: 'bg-white border-3 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
      header: 'bg-[#facc15] border-b-3 border-black',
      title: 'text-black font-mono font-black uppercase tracking-tight',
      sub: 'text-black font-mono text-xs font-semibold',
      input: 'bg-white border-2 border-black rounded-none focus:bg-yellow-50 text-black font-mono font-bold',
      label: 'text-black font-mono font-black uppercase text-[10px] tracking-wider',
      buttonCycleActive: 'bg-black text-white border-2 border-black font-black rounded-none',
      buttonCycleInactive: 'bg-white text-black border-2 border-black font-bold rounded-none hover:bg-zinc-200',
      footer: 'bg-zinc-100 border-t-3 border-black',
      buttonCancel: 'bg-white border-2 border-black text-black font-black hover:bg-zinc-200 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]',
      buttonSave: 'bg-[#facc15] border-2 border-black text-black font-black hover:bg-yellow-400 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]',
      dragBox: 'border-2.5 border-black border-dashed bg-zinc-50 rounded-none',
      dragIconBg: 'bg-[#facc15] border-2 border-black text-black rounded-none shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
      dragTextMain: 'text-black font-mono font-bold uppercase text-xs',
    },
    cyberneon: {
      overlay: 'bg-[#03000a]/80 backdrop-blur-sm',
      modal: 'bg-[#090514] border border-fuchsia-500/20 shadow-2xl shadow-fuchsia-500/10',
      header: 'bg-[#06030c] border-b border-fuchsia-500/15',
      title: 'text-white font-bold',
      sub: 'text-cyan-400/70 font-mono text-[10px]',
      input: 'bg-[#050308] border border-fuchsia-500/30 focus:ring-cyan-400 focus:border-cyan-400 text-white rounded-lg font-mono text-xs',
      label: 'text-cyan-400 font-mono text-[10.5px]',
      buttonCycleActive: 'bg-cyan-500 text-black border-cyan-500 font-bold rounded-lg shadow-[0_0_8px_rgba(34,211,238,0.3)]',
      buttonCycleInactive: 'bg-[#050308] text-slate-400 border-fuchsia-500/20 hover:bg-fuchsia-500/10 rounded-lg',
      footer: 'bg-[#06030c] border-t border-fuchsia-500/15',
      buttonCancel: 'border-fuchsia-500/20 text-slate-400 hover:bg-fuchsia-500/10 rounded-lg',
      buttonSave: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-cyan-300 hover:to-fuchsia-400 text-black font-extrabold rounded-lg shadow-[0_0_12px_rgba(34,211,238,0.4)]',
      dragBox: 'border-fuchsia-500/20 bg-[#0c0817] hover:border-fuchsia-500/40 rounded-xl',
      dragIconBg: 'bg-[#140a24] border border-fuchsia-500/30 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]',
      dragTextMain: 'text-slate-200 font-bold',
    }
  }[theme];

  return (
    <div className={`fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans ${layoutStyles.overlay}`}>
      <div className={`max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] ${layoutStyles.modal}`}>
        
        {/* Modal Header */}
        <div className={`p-6 flex items-center justify-between ${layoutStyles.header}`}>
          <div>
            <h3 className={`text-base font-bold font-sans ${layoutStyles.title}`}>Add SaaS Subscription</h3>
            <p className={`text-xs font-sans mt-0.5 ${layoutStyles.sub}`}>Ingest manually or drop an invoice/receipt to parse with Gemini</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'brutalist' 
                ? 'border-2 border-black bg-white hover:bg-zinc-200 text-black rounded-none' 
                : theme === 'midnight' 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : theme === 'cyberneon'
                ? 'text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Drag & Drop OCR Ingest Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-5 text-center flex flex-col items-center justify-center transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50'
                : uploadProgress === 'done'
                ? 'border-emerald-200 bg-emerald-50/20'
                : layoutStyles.dragBox
            }`}
          >
            {uploadProgress === 'idle' && (
              <>
                <div className={`p-3 mb-3 ${layoutStyles.dragIconBg}`}>
                  <Upload className="h-5 w-5" />
                </div>
                <p className={`text-xs font-semibold ${layoutStyles.dragTextMain}`}>Drag & Drop Invoice/Receipt</p>
                <p className={`text-[10px] mt-1 max-w-xs leading-relaxed ${layoutStyles.sub}`}>
                  Support PDF, PNG or Email receipts (Simulated reader). Try dropping <code className={`px-1 py-0.5 rounded text-[9.5px] ${theme === 'midnight' || theme === 'cyberneon' ? 'bg-slate-950 text-slate-300 border border-fuchsia-500/10' : 'bg-slate-100 text-slate-800'}`}>adobe.pdf</code> or <code className={`px-1 py-0.5 rounded text-[9.5px] ${theme === 'midnight' || theme === 'cyberneon' ? 'bg-slate-950 text-slate-300 border border-fuchsia-500/10' : 'bg-slate-100 text-slate-800'}`}>datadog_bill.png</code>
                </p>
              </>
            )}

            {uploadProgress === 'reading' && (
              <div className="py-2 space-y-2">
                <Loader2 className={`h-5 w-5 animate-spin mx-auto ${theme === 'midnight' ? 'text-teal-400' : theme === 'cyberneon' ? 'text-cyan-400' : 'text-emerald-500'}`} />
                <p className={`text-xs font-semibold ${layoutStyles.dragTextMain}`}>Scanning Document File: "{fileName}"</p>
                <p className={`text-[10px] ${layoutStyles.sub}`}>Extracting raw bill characters via OCR scan layer...</p>
              </div>
            )}

            {uploadProgress === 'parsing' && (
              <div className="py-2 space-y-2">
                <Loader2 className={`h-5 w-5 animate-spin mx-auto ${theme === 'midnight' ? 'text-teal-400' : theme === 'cyberneon' ? 'text-fuchsia-400' : 'text-indigo-500'}`} />
                <p className={`text-xs font-semibold ${layoutStyles.dragTextMain}`}>Gemini Parsing Variables...</p>
                <p className={`text-[10px] ${layoutStyles.sub}`}>Resolving brand, cycle allocation, category taxonomy, and seat metrics.</p>
              </div>
            )}

            {uploadProgress === 'done' && (
              <div className="py-1 space-y-2">
                <div className="p-1 bg-emerald-500 text-white rounded-full inline-flex items-center justify-center mx-auto shadow-md">
                  <Check className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs font-semibold text-emerald-600">Parsed Successfully!</p>
                <p className={`text-[10.5px] ${layoutStyles.sub}`}>
                  Extracted variables from <span className="font-mono font-bold">"{fileName}"</span> are prefilled in the form below. Review and save.
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[10.5px] uppercase tracking-wider mb-1.5 font-sans ${layoutStyles.label}`}>SaaS Brand Name</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className={`w-full text-xs p-2.5 outline-none transition-all ${layoutStyles.input}`}
                  placeholder="e.g. Asana Premium"
                />
              </div>

              <div>
                <label className={`block text-[10.5px] uppercase tracking-wider mb-1.5 font-sans ${layoutStyles.label}`}>Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Subscription['category'])}
                  className={`w-full text-xs p-2.5 outline-none transition-all ${layoutStyles.input}`}
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Communication">Communication</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Security">Security</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-[10.5px] uppercase tracking-wider mb-1.5 font-sans ${layoutStyles.label}`}>Recurring Cost ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className={`w-full text-xs p-2.5 outline-none font-mono transition-all ${layoutStyles.input}`}
                  placeholder="299.00"
                />
              </div>

              <div>
                <label className={`block text-[10.5px] uppercase tracking-wider mb-1.5 font-sans ${layoutStyles.label}`}>Contract Cycle</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`text-xs py-2.5 font-medium border text-center transition cursor-pointer ${
                      billingCycle === 'monthly'
                        ? layoutStyles.buttonCycleActive
                        : layoutStyles.buttonCycleInactive
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`text-xs py-2.5 font-medium border text-center transition cursor-pointer ${
                      billingCycle === 'annual'
                        ? layoutStyles.buttonCycleActive
                        : layoutStyles.buttonCycleInactive
                    }`}
                  >
                    Annual
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-[10.5px] uppercase tracking-wider mb-1.5 font-sans ${layoutStyles.label}`}>Next Renewal Date</label>
                <input
                  type="date"
                  required
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className={`w-full text-xs p-2.5 outline-none font-mono transition-all ${layoutStyles.input}`}
                />
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 ${theme === 'midnight' ? 'border-slate-800' : theme === 'warm' ? 'border-[#ebdcd0]/40' : 'border-slate-100'}`}>
              <div>
                <label className={`block text-[10.5px] uppercase tracking-wider mb-1.5 font-sans ${layoutStyles.label}`}>Total Seat Licenses Billed</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  className={`w-full text-xs p-2.5 outline-none font-mono transition-all ${layoutStyles.input}`}
                  placeholder="10"
                />
              </div>

              <div>
                <label className={`block text-[10.5px] uppercase tracking-wider mb-1.5 font-sans ${layoutStyles.label}`}>Active Users (recorded logons)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={totalSeats}
                  value={activeSeats}
                  onChange={(e) => setActiveSeats(e.target.value)}
                  className={`w-full text-xs p-2.5 outline-none font-mono transition-all ${layoutStyles.input}`}
                  placeholder="10"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex items-center justify-end gap-3 pt-6 -mx-6 -mb-6 p-6 ${layoutStyles.footer}`}>
              <button
                type="button"
                onClick={onClose}
                className={`text-xs font-semibold px-4 py-2 border transition cursor-pointer ${layoutStyles.buttonCancel}`}
              >
                Cancel Entry
              </button>
              <button
                type="submit"
                className={`text-xs font-bold px-5 py-2 transition cursor-pointer shadow-md ${layoutStyles.buttonSave}`}
              >
                Save Subscription Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
