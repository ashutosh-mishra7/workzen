import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Pencil, Trash2, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import api from '../services/api';
import { format } from 'date-fns';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, tasks, fetchProjects, fetchTasks, createTask, updateTask, deleteTask } = useApp();
    const [project, setProject] = useState(null);
    const [loadingProj, setLoadingProj] = useState(true);
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [deleteTaskId, setDeleteTaskId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/projects/${id}`);
                setProject(res.data);
            } catch {
                toast.error('Project not found');
                navigate('/projects');
            } finally {
                setLoadingProj(false);
            }
        };
        load();
        fetchTasks({ projectId: id });
        fetchProjects();
    }, [id]);

    const projectTasks = tasks.filter(t => t.projectId?._id === id || t.projectId === id);
    const completed = projectTasks.filter(t => t.status === 'Completed').length;
    const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

    const handleTaskSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editTask) {
                await updateTask(editTask._id, form);
                toast.success('Task updated');
            } else {
                await createTask({ ...form, projectId: id });
                toast.success('Task created');
            }
            setTaskModalOpen(false);
            setEditTask(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTask = async () => {
        setDeleting(true);
        try {
            await deleteTask(deleteTaskId);
            toast.success('Task deleted');
            setDeleteTaskId(null);
        } catch {
            toast.error('Failed to delete task');
        } finally {
            setDeleting(false);
        }
    };

    const toggleComplete = async (task) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            await updateTask(task._id, { status: newStatus });
            toast.success(newStatus === 'Completed' ? 'Task completed!' : 'Task reopened');
        } catch {
            toast.error('Failed to update task');
        }
    };

    if (loadingProj) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6366F1', borderTopColor: 'transparent' }} />
        </div>
    );

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Link to="/projects" className="flex items-center gap-2 text-sm mb-6" style={{ color: '#9CA3AF' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                    <ArrowLeft size={16} /> Back to Projects
                </Link>

                {/* Project Info Card */}
                <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-2xl font-bold" style={{ color: '#F9FAFB' }}>{project?.title}</h1>
                        <div className="flex gap-2">
                            <Badge label={project?.status} size="md" />
                            <Badge label={project?.priority} size="md" />
                        </div>
                    </div>
                    {project?.description && (
                        <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>{project.description}</p>
                    )}
                    <div className="flex gap-6 text-sm mb-4" style={{ color: '#6B7280' }}>
                        {project?.startDate && <span>Start: {format(new Date(project.startDate), 'MMM d, yyyy')}</span>}
                        {project?.dueDate && <span>Due: {format(new Date(project.dueDate), 'MMM d, yyyy')}</span>}
                    </div>
                    {/* Progress */}
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span style={{ color: '#9CA3AF' }}>{completed} of {projectTasks.length} tasks completed</span>
                            <span className="font-semibold" style={{ color: '#6366F1' }}>{progress}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1F2937' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: '#6366F1' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tasks */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold" style={{ color: '#F9FAFB' }}>Tasks ({projectTasks.length})</h2>
                    <button onClick={() => { setEditTask(null); setTaskModalOpen(true); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#6366F1', color: '#fff' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4F46E5'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366F1'}>
                        <Plus size={14} /> Add Task
                    </button>
                </div>

                <div className="space-y-2">
                    {projectTasks.length === 0 ? (
                        <div className="text-center py-12 rounded-xl border" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
                            <p className="text-sm" style={{ color: '#6B7280' }}>No tasks yet. Add your first task!</p>
                        </div>
                    ) : (
                        projectTasks.map((task, i) => (
                            <motion.div key={task._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                                style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
                                <button onClick={() => toggleComplete(task)} className="shrink-0">
                                    {task.status === 'Completed'
                                        ? <CheckCircle2 size={20} style={{ color: '#10B981' }} />
                                        : task.status === 'In Progress'
                                            ? <Clock size={20} style={{ color: '#F59E0B' }} />
                                            : <Circle size={20} style={{ color: '#374151' }} />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through' : ''}`}
                                        style={{ color: task.status === 'Completed' ? '#6B7280' : '#F9FAFB' }}>
                                        {task.title}
                                    </p>
                                    {task.dueDate && (
                                        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                                            Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge label={task.priority} />
                                    <button onClick={() => { setEditTask(task); setTaskModalOpen(true); }}
                                        className="p-1.5 rounded-lg" style={{ color: '#6B7280' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1F2937'; e.currentTarget.style.color = '#F9FAFB'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}>
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => setDeleteTaskId(task._id)}
                                        className="p-1.5 rounded-lg" style={{ color: '#6B7280' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2D0A0A'; e.currentTarget.style.color = '#EF4444'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

            <TaskModal isOpen={taskModalOpen} onClose={() => { setTaskModalOpen(false); setEditTask(null); }}
                onSubmit={handleTaskSubmit} task={editTask} projects={projects} loading={submitting} defaultProjectId={id} />
            <ConfirmModal isOpen={!!deleteTaskId} onClose={() => setDeleteTaskId(null)} onConfirm={handleDeleteTask}
                title="Delete Task" message="This task will be permanently deleted." loading={deleting} />
        </div>
    );
};

export default ProjectDetail;
