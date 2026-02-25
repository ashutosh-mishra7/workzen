import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, ExternalLink, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import ProjectModal from '../components/ProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Projects = () => {
    const { projects, tasks, fetchProjects, createProject, updateProject, deleteProject, loadingProjects } = useApp();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const filtered = projects.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || p.status === filterStatus;
        const matchPriority = filterPriority === 'All' || p.priority === filterPriority;
        return matchSearch && matchStatus && matchPriority;
    });

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editProject) {
                await updateProject(editProject._id, form);
                toast.success('Project updated');
            } else {
                await createProject(form);
                toast.success('Project created');
            }
            setModalOpen(false);
            setEditProject(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProject(deleteId);
            toast.success('Project deleted');
            setDeleteId(null);
        } catch (err) {
            toast.error('Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    const selectStyle = {
        backgroundColor: '#0B0F19', border: '1px solid #374151',
        color: '#F9FAFB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none'
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10 md:px-8 md:py-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: '#F9FAFB' }}>Projects</h1>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>{projects.length} total projects</p>
                </div>
                <button onClick={() => { setEditProject(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    style={{ backgroundColor: '#F9FAFB', color: '#111827' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}>
                    <Plus size={16} /> New Project
                </button>
            </motion.div>

            {/* Search & Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                        className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-colors"
                        style={{ backgroundColor: '#0B0F19', border: '1px solid #374151', color: '#F9FAFB' }}
                        onFocus={e => e.target.style.borderColor = '#9CA3AF'}
                        onBlur={e => e.target.style.borderColor = '#374151'} />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
                    <option>All</option>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={selectStyle}>
                    <option>All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>

            {/* Projects Grid */}
            {loadingProjects ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F9FAFB', borderTopColor: 'transparent' }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 rounded-xl border border-dashed" style={{ borderColor: '#374151', backgroundColor: 'transparent' }}>
                    <FolderOpen size={48} className="mx-auto mb-4" style={{ color: '#4B5563' }} />
                    <p className="font-medium text-lg" style={{ color: '#F9FAFB' }}>No projects found</p>
                    <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>Create your first project to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((project, i) => {
                        const projTasks = tasks.filter(t => t.projectId?._id === project._id || t.projectId === project._id);
                        const completed = projTasks.filter(t => t.status === 'Completed').length;
                        const progress = projTasks.length > 0 ? Math.round((completed / projTasks.length) * 100) : 0;
                        return (
                            <motion.div key={project._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className="rounded-xl border p-6 flex flex-col transition-colors"
                                style={{ backgroundColor: '#111827', borderColor: '#374151' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#4B5563'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#374151'}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-bold text-base leading-tight flex-1 mr-3 line-clamp-2" style={{ color: '#F9FAFB' }}>{project.title}</h3>
                                    <div className="flex gap-1.5 shrink-0">
                                        <button onClick={() => { setEditProject(project); setModalOpen(true); }}
                                            className="p-2 rounded-lg transition-colors border" style={{ color: '#9CA3AF', borderColor: 'transparent' }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1F2937'; e.currentTarget.style.color = '#F9FAFB'; e.currentTarget.style.borderColor = '#374151'; }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => setDeleteId(project._id)}
                                            className="p-2 rounded-lg transition-colors border" style={{ color: '#9CA3AF', borderColor: 'transparent' }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2D0A0A'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#7F1D1D'; }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                {project.description && (
                                    <p className="text-sm mb-5 line-clamp-2 leading-relaxed" style={{ color: '#9CA3AF' }}>{project.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <Badge label={project.status} />
                                    <Badge label={project.priority} />
                                </div>
                                {/* Progress */}
                                <div className="mb-5 mt-auto">
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span style={{ color: '#9CA3AF' }}>{completed}/{projTasks.length} tasks</span>
                                        <span style={{ color: '#F9FAFB' }}>{progress}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1F2937' }}>
                                        <div className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%`, backgroundColor: '#F9FAFB' }} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-4 border-t" style={{ borderColor: '#1F2937' }}>
                                    {project.dueDate ? (
                                        <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                                            Due {format(new Date(project.dueDate), 'MMM d, yyyy')}
                                        </span>
                                    ) : <span />}
                                    <Link to={`/projects/${project._id}`}
                                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                                        style={{ color: '#9CA3AF' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#F9FAFB'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                                        Open <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <ProjectModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditProject(null); }}
                onSubmit={handleSubmit} project={editProject} loading={submitting} />
            <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
                title="Delete Project" message="This will permanently delete the project and all its tasks. This action cannot be undone."
                loading={deleting} />
        </div>
    );
};

export default Projects;
