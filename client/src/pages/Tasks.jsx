import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, CheckCircle2, Circle, Clock, ListTodo } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Tasks = () => {
    const { projects, tasks, fetchProjects, fetchTasks, createTask, updateTask, deleteTask, loadingTasks } = useApp();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterProject, setFilterProject] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, [fetchTasks, fetchProjects]);

    const filtered = tasks.filter(t => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || t.status === filterStatus;
        const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
        const matchProject = filterProject === 'All' || (t.projectId?._id === filterProject || t.projectId === filterProject);
        return matchSearch && matchStatus && matchPriority && matchProject;
    });

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editTask) {
                await updateTask(editTask._id, form);
                toast.success('Task updated');
            } else {
                await createTask(form);
                toast.success('Task created');
            }
            setModalOpen(false);
            setEditTask(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteTask(deleteId);
            toast.success('Task deleted');
            setDeleteId(null);
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
        } catch {
            toast.error('Failed to update task');
        }
    };

    const selectStyle = {
        backgroundColor: '#0B0F19', border: '1px solid #374151',
        color: '#F9FAFB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none'
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10 md:px-8 md:py-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: '#F9FAFB' }}>Tasks</h1>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>{tasks.length} total tasks</p>
                </div>
                <button onClick={() => { setEditTask(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    style={{ backgroundColor: '#F9FAFB', color: '#111827' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}>
                    <Plus size={16} /> New Task
                </button>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
                        className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-colors"
                        style={{ backgroundColor: '#0B0F19', border: '1px solid #374151', color: '#F9FAFB' }}
                        onFocus={e => e.target.style.borderColor = '#9CA3AF'}
                        onBlur={e => e.target.style.borderColor = '#374151'} />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
                    <option>All</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={selectStyle}>
                    <option>All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={selectStyle}>
                    <option value="All">All Projects</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
            </div>

            {/* Tasks List */}
            {loadingTasks ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F9FAFB', borderTopColor: 'transparent' }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 rounded-xl border border-dashed" style={{ borderColor: '#374151', backgroundColor: 'transparent' }}>
                    <ListTodo size={48} className="mx-auto mb-4" style={{ color: '#4B5563' }} />
                    <p className="font-medium text-lg" style={{ color: '#F9FAFB' }}>No tasks found</p>
                </div>
            ) : (
                <div className="rounded-xl border overflow-hidden shadow-sm" style={{ borderColor: '#374151' }}>
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold uppercase border-b"
                        style={{ backgroundColor: '#0B0F19', borderColor: '#374151', color: '#9CA3AF', letterSpacing: '0.05em' }}>
                        <div className="col-span-5">Task</div>
                        <div className="col-span-2">Project</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Priority</div>
                        <div className="col-span-1">Due</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y" style={{ divideColor: '#374151' }}>
                        {filtered.map((task, i) => (
                            <motion.div key={task._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-opacity-50"
                                style={{ backgroundColor: '#111827', hoverBackgroundColor: '#2b3548' }} // Used custom CSS earlier for true hover
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1F2937'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}>
                                <div className="col-span-5 flex items-center gap-4 min-w-0">
                                    <button onClick={() => toggleComplete(task)} className="shrink-0 transition-transform hover:scale-110">
                                        {task.status === 'Completed'
                                            ? <CheckCircle2 size={20} style={{ color: '#10B981' }} />
                                            : task.status === 'In Progress'
                                                ? <Clock size={20} style={{ color: '#F59E0B' }} />
                                                : <Circle size={20} style={{ color: '#4B5563' }} />}
                                    </button>
                                    <span className={`text-sm font-medium truncate ${task.status === 'Completed' ? 'line-through' : ''}`}
                                        style={{ color: task.status === 'Completed' ? '#6B7280' : '#F9FAFB' }}>
                                        {task.title}
                                    </span>
                                </div>
                                <div className="col-span-2 text-xs truncate font-medium" style={{ color: '#9CA3AF' }}>
                                    {task.projectId?.title || '-'}
                                </div>
                                <div className="col-span-2"><Badge label={task.status} /></div>
                                <div className="col-span-1"><Badge label={task.priority} /></div>
                                <div className="col-span-1 text-xs font-medium" style={{ color: '#9CA3AF' }}>
                                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                                </div>
                                <div className="col-span-1 flex justify-end gap-2">
                                    <button onClick={() => { setEditTask(task); setModalOpen(true); }}
                                        className="p-2 rounded-lg transition-colors border" style={{ color: '#9CA3AF', borderColor: 'transparent' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1F2937'; e.currentTarget.style.color = '#F9FAFB'; e.currentTarget.style.borderColor = '#374151'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => setDeleteId(task._id)}
                                        className="p-2 rounded-lg transition-colors border" style={{ color: '#9CA3AF', borderColor: 'transparent' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2D0A0A'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#7F1D1D'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <TaskModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTask(null); }}
                onSubmit={handleSubmit} task={editTask} projects={projects} loading={submitting} />
            <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
                title="Delete Task" message="This task will be permanently deleted." loading={deleting} />
        </div>
    );
};

export default Tasks;
