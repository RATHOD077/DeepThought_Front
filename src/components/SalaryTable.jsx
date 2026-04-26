import { IndianRupee, CreditCard, Search, Filter, Eye, Edit2, Trash2, X, User, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { api } from "../api";

function SalaryTable({ entries, loading, error, onRefresh, onEdit }) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;
    try {
      await api.deleteSalaryEntry(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatMonth = (monthYear) => {
    if (!monthYear) return "-";
    const [year, month] = monthYear.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
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
              >
                <X size={20} />
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-[1rem] text-center sm:text-left">
                <div className="h-[4.5rem] w-[4.5rem] rounded-[1.25rem] bg-white/10 flex items-center justify-center text-[1.75rem] font-bold border border-white/20">
                  {selectedEntry.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[1.25rem] font-bold">{selectedEntry.full_name}</h2>
                  <p className="text-indigo-100 font-medium opacity-90 text-[0.875rem]">{selectedEntry.designation}</p>
                </div>
              </div>
            </div>
            
            <div className="p-[1.5rem] sm:p-[2rem] space-y-[1.5rem] overflow-y-auto">
              <div className="grid grid-cols-2 gap-[1.5rem]">
                <div className="space-y-[0.25rem]">
                  <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Payment Month</p>
                  <div className="flex items-center gap-[0.5rem] text-slate-700 font-semibold text-[0.875rem]">
                    <Calendar size={16} className="text-indigo-500" />
                    <span>{formatMonth(selectedEntry.month_year)}</span>
                  </div>
                </div>
                <div className="space-y-[0.25rem] text-right">
                  <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Paid Amount</p>
                  <div className="flex items-center justify-end gap-[0.25rem] text-slate-900 font-bold text-[1.125rem]">
                    <IndianRupee size={16} className="text-slate-400" />
                    {Number(selectedEntry.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="space-y-[0.5rem]">
                <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Payroll Remarks</p>
                <div className="rounded-[1rem] bg-slate-50 p-[1rem] border border-slate-100 italic text-slate-600 text-[0.875rem]">
                  {selectedEntry.notes || "No additional remarks provided for this transaction."}
                </div>
              </div>

              <div className="flex items-center gap-[1rem] text-[0.75rem] text-slate-400">
                <span className="flex items-center gap-[0.25rem]"><Calendar size={12} /> Logged: {new Date(selectedEntry.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-[0.25rem]"><User size={12} /> ID: PAY-{selectedEntry.id}</span>
              </div>
            </div>

            <div className="p-[1.5rem] sm:p-[2rem] pt-0 border-t border-slate-50 mt-auto flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-[0.75rem]">
                 <button 
                   onClick={() => { onEdit(selectedEntry); setSelectedEntry(null); }}
                   className="flex-1 btn-primary py-[0.875rem]"
                 >
                   <Edit2 size={18} /> Update Record
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

      <div className="mb-[1.5rem] flex flex-col gap-[1rem] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-[0.75rem]">
          <div className="p-[0.5rem] bg-indigo-50 text-indigo-600 rounded-[0.5rem]">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-[1.125rem] font-bold">Payroll History</h3>
            <p className="text-[0.875rem] text-slate-500">View and manage processed salary records.</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-[1.5rem] px-[1.5rem]">
        <table className="w-full border-collapse text-left text-[0.875rem]">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700">Employee</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700">Month</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700 text-right">Amount</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[10rem] rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[6rem] rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[5rem] ml-auto rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[6rem] mx-auto rounded bg-slate-100" /></td>
                </tr>
              ))
            ) : entries.length ? (
              entries.map((entry) => (
                <tr key={entry.id} className="group transition-colors hover:bg-slate-50">
                  <td className="px-[1.5rem] py-[1rem]">
                    <div className="flex items-center gap-[0.75rem]">
                      <div className="h-[2rem] w-[2rem] rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[0.75rem]">
                        {entry.full_name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[8rem] sm:max-w-none">{entry.full_name}</p>
                        <p className="text-[0.625rem] text-slate-400 font-bold uppercase truncate">{entry.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-[1.5rem] py-[1rem] text-slate-600 font-medium">
                    {formatMonth(entry.month_year)}
                  </td>
                  <td className="px-[1.5rem] py-[1rem] text-right">
                    <div className="flex items-center justify-end gap-[0.25rem] font-mono font-bold text-slate-900">
                      <IndianRupee size={14} className="text-slate-400" />
                      {Number(entry.amount).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="px-[1.5rem] py-[1rem] text-center">
                    <div className="flex items-center justify-center gap-[0.5rem]">
                       <button 
                         onClick={() => setSelectedEntry(entry)}
                         className="p-[0.5rem] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[0.5rem] transition-all"
                         title="View Payslip"
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
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-[1.5rem] py-[3rem] text-center text-slate-400 font-medium">
                  No salary records processed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalaryTable;
