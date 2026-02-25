import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
    SortableContext, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import { format } from 'date-fns';
import { GripVertical, Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskModal from '../components/TaskModal';

const COLUMNS = [
    { id: 'Pending', label: 'Pending', color: '#9CA3AF', bg: '#0B0F19' },
    { id: 'In Progress', label: 'In Progress', color: '#F9FAFB', bg: '#0B0F19' },
    { id: 'Completed', label: 'Completed', color: '#10B981', bg: '#0B0F19' },
];

const TaskCard = ({ task, isDragging }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef}
            className="rounded-xl border p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
            style={{ ...style, backgroundColor: '#111827', borderColor: '#374151', borderWidth: '1px', borderStyle: 'solid' }}
            {...attributes} {...listeners}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#4B5563'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#374151'}>

            <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-semibold leading-tight line-clamp-2 pr-2" style={{ color: '#F9FAFB' }}>{task.title}</p>
                <GripVertical size={16} style={{ color: '#4B5563', flexShrink: 0 }} />
            </div>
            {task.description && (
                <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#9CA3AF' }}>{task.description}</p>
            )}
            <div className="flex items-center justify-between mt-auto">
                <Badge label={task.priority} />
                {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#9CA3AF' }}>
                        <Calendar size={12} />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </div>
                )}
            </div>
            {task.projectId?.title && (
                <div className="mt-4 pt-3 border-t" style={{ borderColor: '#1F2937' }}>
                    <p className="text-xs truncate font-medium" style={{ color: '#6B7280' }}>Project: {task.projectId.title}</p>
                </div>
            )}
        </div>
    );
};

const Column = ({ column, items }) => (
    <div className="flex-1 min-w-[280px] rounded-xl border p-5" style={{ backgroundColor: column.bg, borderColor: '#374151' }}>
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#F9FAFB' }}>{column.label}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ backgroundColor: '#1F2937', color: '#9CA3AF' }}>{items.length}</span>
            </div>
        </div>
        <SortableContext items={items.map(t => t._id)} strategy={verticalListSortingStrategy}>
            <div className="min-h-[150px]">
                {items.map(task => (
                    <TaskCard key={task._id} task={task} />
                ))}
            </div>
        </SortableContext>
    </div>
);

const Kanban = () => {
    const { tasks, projects, fetchTasks, fetchProjects, updateTask } = useApp();
    const [activeTask, setActiveTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { createTask } = useApp();

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, [fetchTasks, fetchProjects]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const columns = COLUMNS.map(col => ({
        ...col,
        items: tasks.filter(t => t.status === col.id),
    }));

    const handleDragStart = ({ active }) => {
        setActiveTask(tasks.find(t => t._id === active.id));
    };

    const handleDragEnd = async ({ active, over }) => {
        setActiveTask(null);
        if (!over) return;

        const sourceTask = tasks.find(t => t._id === active.id);
        if (!sourceTask) return;

        // Find target column
        let targetStatus = null;
        for (const col of COLUMNS) {
            if (col.id === over.id) { targetStatus = col.id; break; }
            const colItems = tasks.filter(t => t.status === col.id);
            if (colItems.find(t => t._id === over.id)) { targetStatus = col.id; break; }
        }

        if (targetStatus && sourceTask.status !== targetStatus) {
            try {
                await updateTask(sourceTask._id, { status: targetStatus });
                toast.success(`Moved to ${targetStatus}`);
            } catch {
                toast.error('Failed to update task status');
            }
        }
    };

    const handleCreateTask = async (form) => {
        setSubmitting(true);
        try {
            await createTask(form);
            toast.success('Task created');
            setModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating task');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 py-10 md:px-8 md:py-12 h-full flex flex-col">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: '#F9FAFB' }}>Kanban Board</h1>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>Drag and drop to update task status</p>
                </div>
                <button onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    style={{ backgroundColor: '#F9FAFB', color: '#111827' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}>
                    <Plus size={16} /> New Task
                </button>
            </motion.div>

            <DndContext sensors={sensors} collisionDetection={closestCenter}
                onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex gap-6 flex-1 overflow-x-auto pb-4">
                    {columns.map(col => (
                        <Column key={col.id} column={col} items={col.items} />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask && (
                        <div className="rounded-xl border p-4 shadow-2xl"
                            style={{ backgroundColor: '#111827', borderColor: '#4B5563', borderWidth: '1px', borderStyle: 'solid', maxWidth: '300px' }}>
                            <p className="text-sm font-semibold leading-tight pr-2 line-clamp-2" style={{ color: '#F9FAFB' }}>{activeTask.title}</p>
                            <div className="mt-4"><Badge label={activeTask.priority} /></div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                onSubmit={handleCreateTask} projects={projects} loading={submitting} />
        </div>
    );
};

export default Kanban;
