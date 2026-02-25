import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

const Settings = () => {
    const { user } = useAuth();

    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-10 md:px-8 md:py-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ color: '#F9FAFB' }}>Settings</h1>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Manage your account</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border p-8 mb-6 shadow-sm"
                style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                <h2 className="text-xs font-bold mb-6" style={{ color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Profile
                </h2>
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm"
                        style={{ backgroundColor: '#1F2937', color: '#F9FAFB', border: '1px solid #374151' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-lg" style={{ color: '#F9FAFB' }}>{user?.name}</p>
                        <p className="text-sm font-medium mt-1" style={{ color: '#9CA3AF' }}>Free Plan</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { icon: User, label: 'Full Name', value: user?.name },
                        { icon: Mail, label: 'Email', value: user?.email },
                        { icon: Calendar, label: 'Member Since', value: user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : '-' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 px-5 py-4 rounded-lg border transition-colors"
                            style={{ backgroundColor: '#0B0F19', borderColor: '#374151' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#4B5563'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#374151'}>
                            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#1F2937' }}>
                                <Icon size={16} style={{ color: '#9CA3AF' }} />
                            </div>
                            <div>
                                <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{label}</p>
                                <p className="text-sm font-semibold mt-0.5" style={{ color: '#F9FAFB' }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border p-8 shadow-sm"
                style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                <h2 className="text-xs font-bold mb-6" style={{ color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Security
                </h2>
                <div className="flex items-center gap-4 px-5 py-4 rounded-lg border transition-colors"
                    style={{ backgroundColor: '#0B0F19', borderColor: '#374151' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#4B5563'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#374151'}>
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#064E3B' }}>
                        <Shield size={16} style={{ color: '#10B981' }} />
                    </div>
                    <div>
                        <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Authentication</p>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: '#F9FAFB' }}>JWT — Secured</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
