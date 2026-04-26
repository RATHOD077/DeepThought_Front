import { useEffect, useState } from "react";
import { api } from "../api";
import { CreditCard, User, Calendar, IndianRupee, FileText, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

const initialState = {
  employee_id: "",
  month_year: "",
  amount: "",
  notes: ""
};

function SalaryForm({ onSubmitted, editData, onCancelEdit }) {
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
      setForm({
        employee_id: editData.employee_id,
        month_year: editData.month_year,
        amount: editData.amount,
        notes: editData.notes || ""
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

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (Number(form.amount) <= 0) {
      setIsError(true);
      setMessage("Salary amount must be greater than 0.");
      return;
    }

    try {
      setLoading(true);
      if (editData) {
        await api.updateSalaryEntry(editData.id, {
          employee_id: Number(form.employee_id),
          month_year: form.month_year,
          amount: Number(form.amount),
          notes: form.notes || null
        });
        setMessage("Salary record updated successfully.");
      } else {
        await api.createSalaryEntry({
          employee_id: Number(form.employee_id),
          month_year: form.month_year,
          amount: Number(form.amount),
          notes: form.notes || null
        });
        setMessage("Salary entry created successfully.");
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
             <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-[1.125rem] font-bold">{editData ? "Edit Salary Record" : "Process Monthly Salary"}</h3>
            <p className="text-[0.875rem] text-slate-500">{editData ? "Modifying existing payroll entry." : "Generate payroll records for individual employees."}</p>
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
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Employee</label>
            <div className="relative">
              <select
                className="input-field pl-[2.5rem] appearance-none bg-no-repeat"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                name="employee_id"
                value={form.employee_id}
                onChange={onChange}
                required
              >
                <option value="">Select worker...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name} ({employee.designation})
                  </option>
                ))}
              </select>
              <User className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-[0.375rem]">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Payroll Month</label>
            <div className="relative">
              <input
                className="input-field pl-[2.5rem]"
                name="month_year"
                value={form.month_year}
                onChange={onChange}
                placeholder="2024-03"
                pattern="^\d{4}-\d{2}$"
                required
              />
              <Calendar className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
            <p className="text-[0.625rem] text-slate-400 ml-[0.25rem]">Format: YYYY-MM</p>
          </div>

          <div className="space-y-[0.375rem]">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Total Amount</label>
            <div className="relative">
              <input
                className="input-field pl-[2.5rem] font-mono"
                name="amount"
                value={form.amount}
                onChange={onChange}
                type="number"
                min="1"
                placeholder="0.00"
                required
              />
              <IndianRupee className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-[0.375rem] md:col-span-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 ml-[0.25rem]">Remarks / Notes</label>
            <div className="relative">
              <textarea
                className="input-field pl-[2.5rem] min-h-[5rem] resize-none"
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder="Any special notes for this payment..."
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
                <><Loader2 className="animate-spin" size={18} /> Processing...</>
              ) : (
                editData ? "Update Record" : "Confirm Salary Payment"
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

export default SalaryForm;
