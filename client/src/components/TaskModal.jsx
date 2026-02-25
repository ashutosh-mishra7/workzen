import { useState, useEffect } from "react";
import Modal from "./Modal";

const defaultForm = {
  title: "",
  description: "",
  projectId: "",
  status: "Pending",
  priority: "Medium",
  dueDate: "",
};

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  projects,
  loading,
  defaultProjectId,
}) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        projectId: task.projectId?._id || task.projectId || "",
        status: task.status || "Pending",
        priority: task.priority || "Medium",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
    } else {
      setForm({ ...defaultForm, projectId: defaultProjectId || "" });
    }
  }, [task, isOpen, defaultProjectId]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) return;
    onSubmit(form);
  };

  const inputClass = `
    w-full
    px-3.5 py-2.5
    text-sm
    rounded-lg
    bg-[#0B0F19]
    border border-[#374151]
    text-[#F9FAFB]
    placeholder:text-[#6B7280]
    focus:outline-none
    focus:border-[#9CA3AF]
    transition-colors duration-150
  `;

  const labelClass = `
    block
    text-xs font-medium
    text-[#9CA3AF]
    mb-1.5
  `;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "New Task"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className={labelClass}>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Project */}
        <div>
          <label className={labelClass}>Project *</label>
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className={labelClass}>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-5 mt-6 border-t border-[#374151]">
          <button
            type="button"
            onClick={onClose}
            className="
              w-full sm:w-auto
              px-4 py-2.5
              text-sm font-medium
              rounded-lg
              border border-[#374151]
              text-[#9CA3AF]
              hover:bg-[#1F2937]
              hover:text-[#F9FAFB]
              transition-colors duration-150
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full sm:w-auto
              px-4 py-2.5
              text-sm font-semibold
              rounded-lg
              bg-[#F9FAFB]
              text-[#111827]
              hover:bg-[#E5E7EB]
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-colors duration-150
            "
          >
            {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;