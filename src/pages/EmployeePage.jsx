import { useEffect, useState } from "react";
import { api } from "../api";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (_error) {
      setError("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="space-y-[1.5rem] sm:space-y-[2rem]">
      <div className="flex flex-col gap-[0.25rem]">
        <h2 className="text-[1.75rem] sm:text-[2rem] font-extrabold text-slate-900 leading-tight">Workforce Overview</h2>
        <p className="text-[0.875rem] text-slate-500">Manage your organization's human capital and worker profiles.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1.5rem] sm:gap-[2rem]">
        {/* Form First */}
        <div className="lg:col-span-5">
          <EmployeeForm 
            onCreated={() => { loadEmployees(); setEditingEmployee(null); }} 
            editData={editingEmployee}
            onCancelEdit={() => setEditingEmployee(null)}
          />
        </div>
        {/* Table Below Form */}
        <div className="lg:col-span-7 overflow-hidden">
          <EmployeeTable 
            employees={employees} 
            loading={loading} 
            error={error} 
            onRefresh={loadEmployees}
            onEdit={setEditingEmployee}
          />
        </div>
      </div>
    </div>
  );
}

export default EmployeePage;
