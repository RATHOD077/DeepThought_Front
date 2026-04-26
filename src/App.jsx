import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Users, Clock, CreditCard, LayoutDashboard, Menu, X, Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import EmployeePage from "./pages/EmployeePage";
import OvertimePage from "./pages/OvertimePage";
import SalaryPage from "./pages/SalaryPage";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const navItems = [
    { to: "/", icon: Users, label: "Employees" },
    { to: "/overtime", icon: Clock, label: "Overtime" },
    { to: "/salary", icon: CreditCard, label: "Salary" },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile Responsive Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-[17.5rem] transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col px-[1rem] py-[1.5rem]">
          <div className="mb-[2.5rem] flex items-center justify-between px-[0.5rem]">
            <div className="flex items-center gap-[0.75rem]">
              <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-[0.75rem] bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h1 className="text-[1.25rem] font-bold text-slate-900 leading-tight">CultureTech</h1>
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">HRMS Portal</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-[0.5rem] text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-[0.5rem]">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : "sidebar-link-inactive"}`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-[1.25rem] bg-slate-900 p-[1rem] text-white">
            <p className="text-[0.75rem] font-medium text-slate-400">Logged in as</p>
            <p className="text-[0.875rem] font-bold">HR Administrator</p>
            <div className="mt-[0.75rem] flex items-center gap-[0.5rem] rounded-[0.5rem] bg-white/10 p-[0.5rem] text-[0.75rem] transition hover:bg-white/20 cursor-pointer">
               <div className="h-[0.5rem] w-[0.5rem] rounded-full bg-emerald-400 animate-pulse" />
               System Online
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        <header className="flex h-[4rem] items-center justify-between border-b border-slate-200 bg-white px-[1rem] sm:px-[1.5rem] lg:px-[2rem] flex-shrink-0">
          <div className="flex items-center gap-[0.75rem]">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-[0.5rem] text-slate-500 hover:bg-slate-50 rounded-[0.75rem] lg:hidden"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center relative">
               <Search size={16} className="absolute left-[1rem] text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search employees..." 
                 className="w-[12rem] lg:w-[18rem] bg-slate-50 border-none rounded-full pl-[2.5rem] pr-[1rem] py-[0.5rem] text-[0.875rem] focus:ring-2 focus:ring-indigo-500 transition-all"
               />
            </div>
          </div>
          
          <div className="flex items-center gap-[1rem]">
            <button className="h-[2.5rem] w-[2.5rem] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-[0.625rem] right-[0.625rem] h-[0.5rem] w-[0.5rem] bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-[0.75rem] border-l border-slate-200 pl-[1rem]">
              <div className="hidden xs:block text-right">
                <p className="text-[0.875rem] font-bold text-slate-900 leading-none">Sachin Rathod</p>
                <p className="text-[0.75rem] text-slate-500 mt-1">Project Admin</p>
              </div>
              <div className="h-[2.5rem] w-[2.5rem] rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 p-[0.125rem] shadow-md cursor-pointer hover:scale-105 transition-all">
                 <div className="h-full w-full rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-indigo-700 font-bold text-[0.875rem]">
                   SR
                 </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-[1rem] sm:p-[1.5rem] lg:p-[2rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mx-auto w-full max-w-[75rem]"
            >
              <Routes>
                <Route path="/" element={<EmployeePage />} />
                <Route path="/overtime" element={<OvertimePage />} />
                <Route path="/salary" element={<SalaryPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
