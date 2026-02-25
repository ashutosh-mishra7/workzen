import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import api from "../services/api";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [errorProjects, setErrorProjects] = useState(null);
  const [errorTasks, setErrorTasks] = useState(null);

  /* ================= PROJECTS ================= */

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    setErrorProjects(null);

    try {
      const res = await api.get("/projects");

      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Projects Error:", err);

      setErrorProjects(
        err.response?.data?.message ||
          "Failed to fetch projects"
      );
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const createProject = useCallback(async (data) => {
    try {
      const res = await api.post("/projects", data);

      setProjects((prev) => [res.data, ...prev]);

      return res.data;
    } catch (err) {
      console.error("Create Project Error:", err);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id, data) => {
    try {
      const res = await api.put(`/projects/${id}`, data);

      setProjects((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );

      return res.data;
    } catch (err) {
      console.error("Update Project Error:", err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      await api.delete(`/projects/${id}`);

      setProjects((prev) =>
        prev.filter((p) => p._id !== id)
      );

      setTasks((prev) =>
        prev.filter(
          (t) =>
            t.projectId?._id !== id &&
            t.projectId !== id
        )
      );
    } catch (err) {
      console.error("Delete Project Error:", err);
      throw err;
    }
  }, []);

  /* ================= TASKS ================= */

  const fetchTasks = useCallback(async (params = {}) => {
    setLoadingTasks(true);
    setErrorTasks(null);

    try {
      const res = await api.get("/tasks", {
        params,
      });

      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);

      setErrorTasks(
        err.response?.data?.message ||
          "Failed to fetch tasks"
      );
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    try {
      const res = await api.post("/tasks", data);

      setTasks((prev) => [res.data, ...prev]);

      return res.data;
    } catch (err) {
      console.error("Create Task Error:", err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, data) => {
    try {
      const res = await api.put(`/tasks/${id}`, data);

      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );

      return res.data;
    } catch (err) {
      console.error("Update Task Error:", err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      setTasks((prev) =>
        prev.filter((t) => t._id !== id)
      );
    } catch (err) {
      console.error("Delete Task Error:", err);
      throw err;
    }
  }, []);

  /* ================= MEMO VALUE ================= */

  const value = useMemo(
    () => ({
      projects,
      tasks,

      loadingProjects,
      loadingTasks,

      errorProjects,
      errorTasks,

      fetchProjects,
      fetchTasks,

      createProject,
      updateProject,
      deleteProject,

      createTask,
      updateTask,
      deleteTask,
    }),
    [
      projects,
      tasks,
      loadingProjects,
      loadingTasks,
      errorProjects,
      errorTasks,
      fetchProjects,
      fetchTasks,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);

  if (!ctx)
    throw new Error(
      "useApp must be used within AppProvider"
    );

  return ctx;
};