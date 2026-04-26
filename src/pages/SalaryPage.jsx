import { useEffect, useState } from "react";
import { api } from "../api";
import SalaryForm from "../components/SalaryForm";
import SalaryTable from "../components/SalaryTable";

function SalaryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getSalaryEntries();
      setEntries(data);
    } catch (_error) {
      setError("Failed to fetch salary records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <div className="space-y-[1.5rem] sm:space-y-[2rem]">
      <div className="flex flex-col gap-[0.25rem]">
        <h2 className="text-[1.75rem] sm:text-[2rem] font-extrabold text-slate-900 leading-tight">Payroll Management</h2>
        <p className="text-[0.875rem] text-slate-500">Generate monthly salary records and manage worker compensation.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1.5rem] sm:gap-[2rem]">
        {/* Form First */}
        <div className="lg:col-span-5">
           <SalaryForm 
             onSubmitted={() => { loadEntries(); setEditingEntry(null); }} 
             editData={editingEntry}
             onCancelEdit={() => setEditingEntry(null)}
           />
        </div>
        {/* Table Below Form */}
        <div className="lg:col-span-7 overflow-hidden">
           <SalaryTable 
             entries={entries} 
             loading={loading} 
             error={error} 
             onRefresh={loadEntries}
             onEdit={setEditingEntry}
           />
        </div>
      </div>
    </div>
  );
}

export default SalaryPage;
