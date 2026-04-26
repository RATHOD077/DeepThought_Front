import { useEffect, useState } from "react";
import { api } from "../api";
import { UserPlus, Mail, Phone, Building2, Briefcase, IndianRupee, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

const initialState = {
  employee_code: "",
  full_name: "",
  email: "",
  phone: "",
  department: "Engineering",
  designation: "Fullstack Developer",
  basic_salary: ""
};

const designationOptions = [
  "Fullstack Developer", 
  "Frontend Developer", 
  "Backend Developer", 
  "UI/UX Designer", 
  "QA Engineer", 
  "Project Manager"
];

const departmentOptions = [
  "Engineering",
  "Product Management",
  "Design",
  "DevOps & Cloud",
  "Quality Assurance",
  "Human Resources",
  "Sales & Marketing",
  "Customer Success"
];

function EmployeeForm({ onCreated, editData, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync form with editData when editing
  useEffect(() => {
    if (editData) {
      setForm({
        employee_code: editData.employee_code || "",
        full_name: editData.full_name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        department: editData.department || "Engineering",
        designation: editData.designation || "Fullstack Developer",
        basic_salary: editData.basic_salary || ""
      });
      setMessage("");
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (Number(form.basic_salary) <= 0) {
      setIsError(true);
      setMessage("Basic salary must be greater than 0.");
      return;
    }

    try {
      setLoading(true);
      if (editData) {
        await api.updateEmployee(editData.id, {
          ...form,
          basic_salary: Number(form.basic_salary)
        });
        setMessage("Employee profile updated successfully.");
      } else {
        await api.createEmployee({
          ...form,
          basic_salary: Number(form.basic_salary)
        });
        setMessage("Employee created successfully.");
      }
      
      if (!editData) setForm(initialState);
      if (onCreated) onCreated();
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${editData ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
             <UserPlus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">{editData ? "Edit Employee" : "Register New Employee"}</h3>
            <p className="text-sm text-slate-500">
              {editData ? `Updating ${editData.full_name}'s record.` : "Add a new record to the employee directory."}
            </p>
          </div>
        </div>
        {editData && (
          <button 
            onClick={onCancelEdit}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Employee ID</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="employee_code"
                value={form.employee_code}
                onChange={handleChange}
                placeholder="EMP-001"
              />
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone</label>
            <div className="relative">
              <input
                className="input-field pl-10"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Department</label>
            <div className="relative">
              <select
                className="input-field pl-10 appearance-none bg-no-repeat"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                {departmentOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Designation</label>
            <div className="relative">
              <select
                className="input-field pl-10 appearance-none bg-no-repeat"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                name="designation"
                value={form.designation}
                onChange={handleChange}
                required
              >
                {designationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {!designationOptions.includes(form.designation) && (
                  <option value={form.designation}>{form.designation}</option>
                )}
              </select>
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Monthly Salary</label>
            <div className="relative">
              <input
                className="input-field pl-10 font-mono"
                name="basic_salary"
                type="number"
                min="1"
                value={form.basic_salary}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 btn-primary ${editData ? "bg-amber-600 hover:bg-amber-700" : ""}`}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /> Saving...</>
              ) : (
                editData ? "Update Record" : "Save Employee"
              )}
            </button>
            {editData && (
              <button 
                type="button"
                onClick={onCancelEdit}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {message && (
            <div className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${isError ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
              {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
