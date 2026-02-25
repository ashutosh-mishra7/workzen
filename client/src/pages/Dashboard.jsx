import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  CircleCheck,
  Circle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import Badge from "../components/Badge";
import { format } from "date-fns";

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="
      rounded-xl border
      bg-[#111827]
      border-[#374151]
      px-5 py-5
      sm:px-6 sm:py-6
      hover:border-[#4B5563]
      transition-colors duration-200
    "
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs sm:text-sm font-medium text-[#9CA3AF]">
        {label}
      </span>

      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
    </div>

    <p className="text-2xl sm:text-3xl font-bold text-[#F9FAFB]">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const {
    projects,
    tasks,
    fetchProjects,
    fetchTasks,
    loadingProjects,
    loadingTasks,
  } = useApp();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    pending: tasks.filter((t) => t.status === "Pending").length,
  };

  const recentTasks = [...tasks].slice(0, 5);
  const recentProjects = [...projects].slice(0, 4);

  const isLoading = loadingProjects || loadingTasks;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F9FAFB] mb-2">
          {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>

        <p className="text-xs sm:text-sm text-[#9CA3AF]">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#374151] border-t-[#F9FAFB] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={FolderKanban}
              label="Projects"
              value={stats.totalProjects}
              color="#F9FAFB"
              delay={0}
            />

            <StatCard
              icon={CheckSquare}
              label="Total Tasks"
              value={stats.totalTasks}
              color="#F9FAFB"
              delay={0.05}
            />

            <StatCard
              icon={CircleCheck}
              label="Completed"
              value={stats.completed}
              color="#10B981"
              delay={0.1}
            />

            <StatCard
              icon={Clock}
              label="In Progress"
              value={stats.inProgress}
              color="#F59E0B"
              delay={0.15}
            />

            <StatCard
              icon={Circle}
              label="Pending"
              value={stats.pending}
              color="#9CA3AF"
              delay={0.2}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6 pb-6">
            {/* Recent Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl border bg-[#111827] border-[#374151]"
            >
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#374151]">
                <h2 className="text-sm font-semibold text-[#F9FAFB]">
                  Recent Tasks
                </h2>

                <Link
                  to="/tasks"
                  className="flex items-center gap-1 text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              {recentTasks.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-[#9CA3AF]">
                  No tasks yet.{" "}
                  <Link
                    to="/tasks"
                    className="text-[#F9FAFB] hover:underline"
                  >
                    Create one
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#374151]">
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-[#1F2937] transition-colors"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium text-[#F9FAFB] truncate">
                          {task.title}
                        </p>

                        <p className="text-xs text-[#9CA3AF] mt-1 truncate">
                          {task.projectId?.title || "No Project"}
                        </p>
                      </div>

                      <Badge label={task.status} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border bg-[#111827] border-[#374151]"
            >
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#374151]">
                <h2 className="text-sm font-semibold text-[#F9FAFB]">
                  Recent Projects
                </h2>

                <Link
                  to="/projects"
                  className="flex items-center gap-1 text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              {recentProjects.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-[#9CA3AF]">
                  No projects yet.{" "}
                  <Link
                    to="/projects"
                    className="text-[#F9FAFB] hover:underline"
                  >
                    Create one
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#374151]">
                  {recentProjects.map((project) => {
                    const projTasks = tasks.filter(
                      (t) =>
                        t.projectId?._id === project._id ||
                        t.projectId === project._id
                    );

                    const completed = projTasks.filter(
                      (t) => t.status === "Completed"
                    ).length;

                    const progress =
                      projTasks.length > 0
                        ? Math.round(
                            (completed / projTasks.length) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={project._id}
                        className="px-5 sm:px-6 py-4 hover:bg-[#1F2937] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Link
                            to={`/projects/${project._id}`}
                            className="text-sm font-medium text-[#F9FAFB] hover:underline truncate mr-3"
                          >
                            {project.title}
                          </Link>

                          <Badge label={project.status} />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-[#374151] overflow-hidden">
                            <div
                              className="h-full bg-[#F9FAFB] rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <span className="text-xs font-medium text-[#9CA3AF]">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;