import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useApp } from "../context/AppContext";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import TaskModal from "../components/TaskModal";
import { format } from "date-fns";
import toast from "react-hot-toast";

const CalendarPage = () => {
  const { tasks, projects, fetchTasks, fetchProjects, createTask } = useApp();

  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const events = tasks
    .filter((t) => t.dueDate)
    .map((t) => ({
      id: t._id,
      title: t.title,
      date: t.dueDate.split("T")[0],
      backgroundColor:
        t.status === "Completed"
          ? "#10B981"
          : t.status === "In Progress"
          ? "#F59E0B"
          : "#9CA3AF",
      borderColor: "transparent",
      textColor: "#ffffff",
      extendedProps: { task: t },
    }));

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;

    const dayTasks = tasks.filter(
      (t) =>
        t.dueDate && t.dueDate.split("T")[0] === dateStr
    );

    setSelectedDate(dateStr);
    setSelectedDateTasks(dayTasks);
    setDetailOpen(true);
  };

  const handleEventClick = ({ event }) => {
    const task = event.extendedProps.task;

    const dayTasks = tasks.filter(
      (t) =>
        t.dueDate &&
        t.dueDate.split("T")[0] === task.dueDate.split("T")[0]
    );

    setSelectedDate(task.dueDate.split("T")[0]);
    setSelectedDateTasks(dayTasks);
    setDetailOpen(true);
  };

  const handleCreateTask = async (form) => {
    setSubmitting(true);

    try {
      await createTask({
        ...form,
        dueDate: selectedDate || form.dueDate,
      });

      toast.success("Task created");

      setTaskModalOpen(false);

      fetchTasks();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Error creating task"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 h-full flex flex-col">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F9FAFB] mb-1">
          Calendar
        </h1>

        <p className="text-sm text-[#9CA3AF]">
          View and manage tasks by due date
        </p>
      </motion.div>

      {/* Calendar Container FIXED */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="
          flex-1
          min-h-[650px]
          rounded-xl
          border
          bg-[#111827]
          border-[#374151]
          p-4 sm:p-6
          overflow-hidden
        "
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}

          /* FIXED HEADER */
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}

          /* CRITICAL FIX */
          height="100%"
          contentHeight="auto"
          aspectRatio={1.6}

          /* IMPROVES BUTTONS */
          buttonText={{
            today: "Today",
          }}

          /* RESPONSIVE */
          dayMaxEvents={true}
          fixedWeekCount={false}
          showNonCurrentDates={true}
        />
      </motion.div>

      {/* Detail Modal */}
      <Modal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={
          selectedDate
            ? format(
                new Date(
                  selectedDate + "T12:00:00"
                ),
                "MMMM d, yyyy"
              )
            : ""
        }
        size="sm"
      >
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">

          {selectedDateTasks.length === 0 ? (
            <p className="text-sm text-center py-6 text-[#6B7280]">
              No tasks due on this date
            </p>
          ) : (
            selectedDateTasks.map((task) => (
              <div
                key={task._id}
                className="
                  flex items-center justify-between
                  px-4 py-3
                  rounded-lg
                  border
                  bg-[#0B0F19]
                  border-[#374151]
                "
              >
                <span className="text-sm font-medium text-[#F9FAFB] truncate mr-3">
                  {task.title}
                </span>

                <Badge label={task.status} />
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => {
            setDetailOpen(false);
            setTaskModalOpen(true);
          }}
          className="
            w-full
            px-4 py-2.5
            rounded-lg
            text-sm font-semibold
            bg-[#F9FAFB]
            text-[#111827]
            hover:bg-[#E5E7EB]
            transition-colors
          "
        >
          + Add Task on This Date
        </button>
      </Modal>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={projects}
        loading={submitting}
        defaultProjectId={projects[0]?._id}
      />
    </div>
  );
};

export default CalendarPage;