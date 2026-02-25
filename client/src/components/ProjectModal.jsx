import { useState, useEffect } from "react";
import Modal from "./Modal";

const defaultForm = {
  title: "",
  description: "",
  status: "Not Started",
  priority: "Medium",
  startDate: "",
  dueDate: "",
};

const ProjectModal = ({ isOpen, onClose, onSubmit, project, loading }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "Not Started",
        priority: project.priority || "Medium",
        startDate: project.startDate
          ? project.startDate.split("T")[0]
          : "",
        dueDate: project.dueDate ? project.dueDate.split("T")[0] : "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [project, isOpen]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
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
      title={project ? "Edit Project" : "New Project"}
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
            placeholder="Enter project title"
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
            placeholder="Enter project description"
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Not Started</option>
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

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

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
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-6 border-t border-[#374151]">
          <button
            type="button"
            onClick={onClose}
            className="
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
            {loading
              ? "Saving..."
              : project
              ? "Update Project"
              : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;