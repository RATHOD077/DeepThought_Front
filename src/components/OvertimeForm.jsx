import { useEffect, useState } from "react";
import { api } from "../api";
import { Clock, Calendar, User, FileText, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

const initialState = {
  employee_id: "",
  overtime_date: "",
  overtime_hours: "",
  reason: "",
  status: "pending"
};

function OvertimeForm({ onSubmitted, editData, onCancelEdit }) {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await api.getEmployees();
        setEmployees(data);
      } catch (_error) {
        setEmployees([]);
      }
    };
    loadEmployees();
  }, []);

  // Sync form with editData
  useEffect(() => {
    if (editData) {
      // Fix: Extract date string safely
      let dateValue = "";
      if (editData.overtime_date) {
        const d = new Date(editData.overtime_date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        dateValue = `${year}-${month}-${day}`;
      }

      setForm({
        employee_id: editData.employee_id,
        overtime_date: dateValue,
        overtime_hours: editData.overtime_hours,
        reason: editData.reason,
        status: editData.status || "pending"
      });
      setMessage("");
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.employee_id || !form.overtime_date || !form.overtime_hours || !form.reason) {
      return "All fields are required.";
    }
    const hours = Number(form.overtime_hours);
    if (hours < 1 || hours > 6) return "Overtime hours must be between 1 and 6.";

    const date = new Date(form.overtime_date);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pastLimit = new Date(today);
    pastLimit.setDate(today.getDate() - 7);

    if (date > today) return "Date cannot be in the future.";
    if (!editData && date < pastLimit) return "New overtime entries cannot be more than 7 days old.";
    if (form.reason.trim().length < 10) return "Reason must be at least 10 characters.";
    return "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    const validationError = validate();
    if (validationError) {
      setIsError(true);
      setMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        employee_id: Number(form.employee_id),
        overtime_date: form.overtime_date,
        overtime_hours: Number(form.overtime_hours),
        reason: form.reason.trim(),
        status: form.status // Will be 'approved' or 'pending'
      };

      if (editData) {
        await api.updateOvertimeEntry(editData.id, payload);
        setMessage("Overtime entry updated successfully.");
      } else {
        await api.createOvertimeEntry(payload);
        setMessage("Overtime submitted successfully.");
      }
      
      if (!editData) setForm(initialState);
      if (onSubmitted) onSubmitted();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card-main transition-all duration-300 ${editData ? "ring-2 ring-indigo-500 shadow-xl" : ""}`}>
      <div className="flex items-center justify-between mb-[1.5rem]">
        <div className="flex items-center gap-[0.75rem]">
          <div className={`p-[0.5rem] rounded-[0.5rem] ${editData ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
             <Clock size={20} />
          </div>
          <div>
            <h3 className="text-[1.125rem] font-bold">{editData ? "Edit Overtime Log" : "Log Overtime Hours"}</h3>
            <p className="text-[0.875rem] text-slate-500">{editData ? "Modifying existing overtime entry." : "Record extra hours worked for payroll calculation."}</p>
          </div>
        </div>
        {editData && (
          <button 
            onClick={onCancelEdit}
            className="p-[0.5rem] text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-[1rem]">
        <div className="grid gap-[1rem] md:grid-cols-2">
          <div className="space-y-[0.375rem] md:col-span-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Select Employee</label>
            <div className="relative">
              <select
                className="input-field pl-[2.5rem] appearance-none bg-no-repeat"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                name="employee_id"
                value={form.employee_id}
                onChange={onChange}
                required
              >
                <option value="">Choose worker...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name} — {employee.designation}
                  </option>
                ))}
              </select>
              <User className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-[0.375rem]">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Date</label>
            <div className="relative">
              <input
                className="input-field pl-[2.5rem]"
                name="overtime_date"
                type="date"
                value={form.overtime_date}
                onChange={onChange}
                required
              />
              <Calendar className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-[0.375rem]">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Hours Worked</label>
            <div className="relative">
              <input
                className="input-field pl-[2.5rem]"
                name="overtime_hours"
                type="number"
                min="1"
                max="6"
                step="0.5"
                value={form.overtime_hours}
                onChange={onChange}
                placeholder="1.0 to 6.0"
                required
              />
              <Clock className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          {editData && (
            <div className="space-y-[0.375rem] md:col-span-2 border-t border-slate-100 pt-[1rem]">
              <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Update Work Status</label>
              <div className="relative">
                <select
                  className="input-field pl-[2.5rem] appearance-none bg-no-repeat font-bold"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  required
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Mark as Completed (Approved)</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className={`absolute left-[0.75rem] top-1/2 -translate-y-1/2 w-[1rem] h-[1rem] rounded-full border-2 border-white ${form.status === 'approved' ? 'bg-emerald-500' : form.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
              </div>
            </div>
          )}

          <div className="space-y-[0.375rem] md:col-span-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Work Description / Reason</label>
            <div className="relative">
              <textarea
                className="input-field pl-[2.5rem] min-h-[6.25rem] resize-none"
                name="reason"
                value={form.reason}
                onChange={onChange}
                placeholder="Briefly describe the work performed..."
                required
              />
              <FileText className="absolute left-[0.75rem] top-[1rem] text-slate-400" size={16} />
            </div>
          </div>
        </div>

        <div className="pt-[0.5rem] flex flex-col gap-[0.75rem]">
          <div className="flex gap-[0.75rem]">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 btn-primary ${editData ? "bg-amber-600 hover:bg-amber-700" : ""}`}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /> Saving...</>
              ) : (
                editData ? "Update Entry" : "Submit Overtime Request"
              )}
            </button>
            {editData && (
              <button 
                type="button"
                onClick={onCancelEdit}
                className="rounded-[0.75rem] border border-slate-200 px-[1.5rem] py-[0.625rem] text-[0.875rem] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {message && (
            <div className={`flex items-center gap-[0.5rem] rounded-[0.75rem] p-[0.75rem] text-[0.875rem] font-medium ${isError ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
              {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default OvertimeForm;
