import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const toErrorMessage = (error) => {
  const data = error?.response?.data;
  if (data?.errors?.length) return data.errors.join(" ");
  if (data?.message) return data.message;
  return "Something went wrong. Please try again.";
};

export const api = {
  health: async () => {
    const { data } = await client.get("/health");
    return data;
  },

  getEmployees: async () => {
    const { data } = await client.get("/employees");
    return data;
  },

  createEmployee: async (payload) => {
    try {
      const { data } = await client.post("/employees", payload);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },

  updateEmployee: async (id, payload) => {
    try {
      const { data } = await client.put(`/employees/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },

  deleteEmployee: async (id) => {
    try {
      const { data } = await client.delete(`/employees/${id}`);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },
  
  getSalaryEntries: async () => {
    const { data } = await client.get("/salaries");
    return data;
  },

  createSalaryEntry: async (payload) => {
    try {
      const { data } = await client.post("/salaries", payload);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },

  updateSalaryEntry: async (id, payload) => {
    try {
      const { data } = await client.put(`/salaries/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },

  deleteSalaryEntry: async (id) => {
    try {
      const { data } = await client.delete(`/salaries/${id}`);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },

  getOvertimeEntries: async () => {
    const { data } = await client.get("/overtime");
    return data;
  },

  createOvertimeEntry: async (payload) => {
    try {
      const { data } = await client.post("/overtime", payload);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },

  updateOvertimeEntry: async (id, payload) => {
    try {
      const { data } = await client.put(`/overtime/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },

  deleteOvertimeEntry: async (id) => {
    try {
      const { data } = await client.delete(`/overtime/${id}`);
      return data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  }
};

export default client;
