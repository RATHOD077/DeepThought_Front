import { IndianRupee, Users, Search, Filter, Download, Eye, Edit2, Trash2, X, Mail, Phone, Building2, Briefcase, Calendar } from "lucide-react";
import { useState } from "react";
import { api } from "../api";

function EmployeeTable({ employees, loading, error, onRefresh, onEdit }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportCSV = () => {
    if (!employees.length) return;
    
    const headers = ["Name", "Designation", "Department", "Basic Salary"];
    const rows = employees.map(emp => [
      emp.full_name,
      emp.designation,
      emp.department,
      emp.basic_salary
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) return;
    
    try {
      setIsDeleting(true);
      await api.deleteEmployee(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card-main">
      {/* Detail Modal - Ultra Responsive Bottom Sheet / Dialog */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 px-0 sm:px-[1rem]">
          <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] shadow-2xl w-full max-w-[32rem] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-indigo-600 px-[1.5rem] py-[1.5rem] sm:py-[2rem] text-white relative flex-shrink-0">
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-[1rem] right-[1rem] p-[0.5rem] bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-[1rem] text-center sm:text-left">
                <div className="h-[4.5rem] w-[4.5rem] sm:h-[5rem] sm:w-[5rem] rounded-[1.25rem] bg-white/10 flex items-center justify-center text-[1.75rem] sm:text-[2rem] font-bold border border-white/20">
                  {selectedEmployee.full_name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold truncate">{selectedEmployee.full_name}</h2>
                  <p className="text-indigo-100 font-medium opacity-90 text-[0.875rem]">{selectedEmployee.designation}</p>
                  <span className="mt-[0.5rem] inline-flex items-center rounded-full bg-white/20 px-[0.75rem] py-[0.125rem] text-[0.625rem] font-bold uppercase tracking-wider text-white">
                    {selectedEmployee.employee_code || "No Code"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="p-[1.5rem] sm:p-[2rem] space-y-[1.5rem] overflow-y-auto">
              <div className="grid grid-cols-2 gap-[1.5rem]">
                <div className="space-y-[0.25rem]">
                  <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Department</p>
                  <div className="flex items-center gap-[0.5rem] text-slate-700 font-semibold text-[0.875rem]">
                    <Building2 size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{selectedEmployee.department}</span>
                  </div>
                </div>
                <div className="space-y-[0.25rem] text-right">
                  <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Monthly Salary</p>
                  <div className="flex items-center justify-end gap-[0.25rem] text-slate-900 font-bold text-[1.125rem]">
                    <IndianRupee size={16} className="text-slate-400 flex-shrink-0" />
                    {Number(selectedEmployee.basic_salary).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-slate-100" />

              <div className="space-y-[1.25rem]">
                <div className="flex items-center gap-[1rem] group">
                  <div className="p-[0.5rem] bg-slate-50 text-slate-400 rounded-[0.75rem] group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                    <p className="font-semibold text-slate-700 truncate text-[0.875rem]">{selectedEmployee.email || "Not Provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-[1rem] group">
                  <div className="p-[0.5rem] bg-slate-50 text-slate-400 rounded-[0.75rem] group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Phone Number</p>
                    <p className="font-semibold text-slate-700 text-[0.875rem]">{selectedEmployee.phone || "Not Provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-[1rem] group">
                  <div className="p-[0.5rem] bg-slate-50 text-slate-400 rounded-[0.75rem] group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Join Date</p>
                    <p className="font-semibold text-slate-700 text-[0.875rem]">{new Date(selectedEmployee.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-[1.5rem] sm:p-[2rem] pt-0 border-t border-slate-50 mt-auto flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-[0.75rem]">
                 <button 
                   onClick={() => { onEdit(selectedEmployee); setSelectedEmployee(null); }}
                   className="flex-1 btn-primary py-[0.875rem] shadow-indigo-100"
                 >
                   <Edit2 size={18} /> Edit Profile
                 </button>
                 <button 
                   onClick={() => setSelectedEmployee(null)}
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
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-[1.125rem] font-bold">Employee Directory</h3>
            <p className="text-[0.875rem] text-slate-500">Manage your workforce profile data.</p>
          </div>
        </div>
        <div className="flex items-center gap-[0.5rem]">
           <button 
             onClick={() => handleExportCSV()}
             className="flex-1 sm:flex-none inline-flex items-center justify-center gap-[0.5rem] rounded-[0.75rem] border border-slate-200 bg-white px-[0.75rem] py-[0.375rem] text-[0.75rem] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
           >
             <Download size={14} />
             Export
           </button>
           <span className="flex-1 sm:flex-none text-center inline-flex items-center justify-center rounded-full bg-indigo-50 px-[0.75rem] py-[0.25rem] text-[0.75rem] font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
             {employees.length} Workers
           </span>
        </div>
      </div>

      {error && (
        <div className="mb-[1rem] flex items-center gap-[0.5rem] rounded-[0.75rem] bg-red-50 p-[1rem] text-[0.875rem] font-medium text-red-700 border border-red-100">
           {error}
        </div>
      )}

      <div className="overflow-x-auto -mx-[1.5rem] px-[1.5rem]">
        <table className="w-full border-collapse text-left text-[0.875rem]">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700">Full Name</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700">Designation</th>
              <th className="hidden md:table-cell px-[1.5rem] py-[1rem] font-bold text-slate-700">Department</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700 text-right">Salary</th>
              <th className="px-[1.5rem] py-[1rem] font-bold text-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[8rem] rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[6rem] rounded bg-slate-100" /></td>
                  <td className="hidden md:table-cell px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[6rem] rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[5rem] ml-auto rounded bg-slate-100" /></td>
                  <td className="px-[1.5rem] py-[1rem]"><div className="h-[1rem] w-[6rem] mx-auto rounded bg-slate-100" /></td>
                </tr>
              ))
            ) : employees.length ? (
              employees.map((employee) => (
                <tr key={employee.id} className="group transition-colors hover:bg-slate-50">
                  <td className="px-[1.5rem] py-[1rem]">
                    <div className="flex items-center gap-[0.75rem]">
                      <div className="h-[2rem] w-[2rem] rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[0.75rem]">
                        {employee.full_name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900 truncate max-w-[8rem] sm:max-w-none">{employee.full_name}</span>
                    </div>
                  </td>
                  <td className="px-[1.5rem] py-[1rem]">
                    <span className="inline-flex items-center rounded-[0.5rem] bg-slate-100 px-[0.5rem] py-[0.25rem] text-[0.75rem] font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10">
                      {employee.designation}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-[1.5rem] py-[1rem] text-slate-600">{employee.department}</td>
                  <td className="px-[1.5rem] py-[1rem] text-right">
                    <div className="flex items-center justify-end gap-[0.25rem] font-mono font-bold text-slate-900">
                      <IndianRupee size={14} className="text-slate-400" />
                      {Number(employee.basic_salary).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="px-[1.5rem] py-[1rem] text-center">
                    <div className="flex items-center justify-center gap-[0.5rem]">
                       <button 
                         onClick={() => setSelectedEmployee(employee)}
                         className="p-[0.5rem] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[0.5rem] transition-all"
                         title="View Details"
                       >
                         <Eye size={18} />
                       </button>
                       <button 
                         onClick={() => onEdit(employee)}
                         className="p-[0.5rem] text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-[0.5rem] transition-all"
                         title="Edit"
                       >
                         <Edit2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(employee.id)}
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
                <td colSpan="5" className="px-[1.5rem] py-[3rem] text-center">
                  <div className="flex flex-col items-center gap-[0.5rem]">
                    <div className="rounded-full bg-slate-100 p-[0.75rem] text-slate-400">
                      <Users size={32} />
                    </div>
                    <p className="font-medium text-slate-600">No employees found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
