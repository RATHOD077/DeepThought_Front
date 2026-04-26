import { Clock, Calendar, User, Eye, Edit2, Trash2, X, FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { api } from "../api";

function OvertimeTable({ entries, loading, error, onRefresh, onEdit }) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  // LF-101: Fix date format to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this overtime entry?")) return;
    try {
      await api.deleteOvertimeEntry(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', color: 'emerald', icon: CheckCircle2 };
      case 'rejected':
        return { label: 'Rejected', color: 'red', icon: XCircle };
      default:
        return { label: 'Pending', color: 'amber', icon: Clock };
    }
  };

  return (
    <div className="card-main">
      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 px-0 sm:px-[1rem]">
          <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] shadow-2xl w-full max-w-[32rem] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
            <div className="bg-indigo-600 px-[1.5rem] py-[1.5rem] sm:py-[2rem] text-white relative flex-shrink-0">
              <button 
                onClick={() => setSelectedEntry(null)}
                className="absolute top-[1rem] right-[1rem] p-[0.5rem] bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-[1rem] text-center sm:text-left">
                <div className="h-[4rem] w-[4rem] rounded-[1rem] bg-white/10 flex items-center justify-center border border-white/20">
                  <Clock size={32} />
                </div>
                <div>
                  <h2 className="text-[1.25rem] font-bold">Overtime Details</h2>
                  <p className="text-indigo-100 font-medium opacity-90 text-[0.875rem]">{selectedEntry.full_name}</p>
                </div>
              </div>
            </div>
            
            <div className="p-[1.5rem] sm:p-[2rem] space-y-[1.5rem] overflow-y-auto">
              <div className="grid grid-cols-2 gap-[1rem]">
                <div className="rounded-[1rem] bg-slate-50 p-[1rem]">
                  <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400 mb-[0.25rem]">Date</p>
                  <p className="font-bold text-slate-700 text-[0.875rem]">{formatDate(selectedEntry.overtime_date)}</p>
                </div>
                <div className="rounded-[1rem] bg-slate-50 p-[1rem]">
                  <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400 mb-[0.25rem]">Hours</p>
                  <p className="font-bold text-slate-700 text-[0.875rem]">{selectedEntry.overtime_hours} Hours</p>
                </div>
              </div>

              <div>
                <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400 mb-[0.5rem]">Work Description</p>
                <div className="rounded-[1rem] border border-slate-100 p-[1rem] bg-slate-50/50">
                  <p className="text-slate-600 leading-relaxed italic text-[0.875rem]">"{selectedEntry.reason}"</p>
                </div>
              </div>

              {(() => {
                const config = getStatusConfig(selectedEntry.status);
                const Icon = config.icon;
                return (
                  <div className={`flex items-center justify-between p-[1rem] rounded-[1rem] border bg-${config.color}-50 border-${config.color}-100`}>
                    <div>
                      <p className={`text-[0.625rem] font-bold uppercase tracking-widest mb-[0.125rem] text-${config.color}-400`}>Status</p>
                      <p className={`font-bold uppercase tracking-wider text-[0.875rem] text-${config.color}-700`}>{config.label}</p>
                    </div>
                    <div className={`h-[2.5rem] w-[2.5rem] rounded-full flex items-center justify-center bg-${config.color}-100 text-${config.color}-600`}>
                       <Icon size={20} />
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-[1.5rem] sm:p-[2rem] pt-0 border-t border-slate-50 mt-auto flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-[0.75rem]">
                 <button 
                   onClick={() => { onEdit(selectedEntry); setSelectedEntry(null); }}
                   className="flex-1 btn-primary py-[0.875rem]"
                 >
                   <Edit2 size={18} /> Edit Entry
                 </button>
                 <button 
                   onClick={() => setSelectedEntry(null)}
                   className="flex-1 rounded-[0.75rem] border border-slate-200 py-[0.875rem] text-[0.875rem] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                 >
                   Close
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-[1.5rem] flex items-center gap-[0.75rem]">
        <div className="p-[0.5rem] bg-indigo-50 text-indigo-600 rounded-[0.5rem]">
          <Clock size={20} />
        </div>
        <div>
          <h3 className="text-[1.125rem] font-bold">Recent Overtime</h3>
          <p className="text-[0.875rem] text-slate-500">History of site worker entries.</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-[1.5rem] px-[1.5rem]">
        <table className="w-full border-collapse text-left text-[0.875rem]">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700">Worker</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700">Date</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700 text-center">Hours</th>
              <th className="hidden md:table-cell px-[1.5rem] py-[1rem] font-bold text-slate-700 text-center">Status</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[8rem] rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[6rem] rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[3rem] mx-auto rounded bg-slate-100" /></td>
                  <td className="hidden md:table-cell px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[5rem] mx-auto rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[6rem] mx-auto rounded bg-slate-100" /></td>
                </tr>
              ))
            ) : entries.length ? (
              entries.map((entry) => {
                const config = getStatusConfig(entry.status);
                return (
                  <tr key={entry.id} className="group transition-colors hover:bg-slate-50">
                    <td className="px-[1.5rem] py-[1rem]">
                      <div className="flex items-center gap-[0.75rem]">
                        <div className={`h-[2rem] w-[2rem] rounded-full flex items-center justify-center font-bold text-[0.75rem] bg-${config.color}-100 text-${config.color}-700`}>
                          {entry.full_name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[6rem] sm:max-w-none">{entry.full_name}</p>
                          <p className="text-[0.625rem] text-slate-400 font-bold uppercase truncate">{entry.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-[1.5rem] py-[1rem] text-slate-600 font-medium whitespace-nowrap">
                      {formatDate(entry.overtime_date)}
                    </td>
                    <td className="px-[1.5rem] py-[1rem] text-center">
                      <span className="inline-flex items-center rounded-[0.5rem] bg-indigo-50 px-[0.5rem] py-[0.125rem] text-[0.75rem] font-bold text-indigo-700">
                        {entry.overtime_hours}h
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-[1.5rem] py-[1rem] text-center">
                      <span className={`inline-flex items-center rounded-full px-[0.625rem] py-[0.125rem] text-[0.625rem] font-bold uppercase tracking-wider bg-${config.color}-50 text-${config.color}-600 ring-1 ring-inset ring-${config.color}-600/20`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-[1.5rem] py-[1rem] text-center">
                      <div className="flex items-center justify-center gap-[0.5rem]">
                         <button 
                           onClick={() => setSelectedEntry(entry)}
                           className="p-[0.5rem] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[0.5rem] transition-all"
                           title="View Details"
                         >
                           <Eye size={18} />
                         </button>
                         <button 
                           onClick={() => onEdit(entry)}
                           className="p-[0.5rem] text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-[0.5rem] transition-all"
                           title="Edit"
                         >
                           <Edit2 size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(entry.id)}
                           className="p-[0.5rem] text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[0.5rem] transition-all"
                           title="Delete"
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-[1.5rem] py-[3rem] text-center text-slate-400 font-medium">
                  No overtime records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OvertimeTable;
