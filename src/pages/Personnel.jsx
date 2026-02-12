import React, { useState } from 'react';
import { 
    Search, Plus, MoreVertical, Shield, User, Trash2, Edit2, 
    CheckCircle, XCircle, Mail, Phone, Calendar 
} from 'lucide-react';

const Personnel = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    // Mock Data
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Marcus Thorne',
            role: 'Super Admin',
            email: 'marcus.t@safecampus.edu',
            phone: '+1 (555) 123-4567',
            status: 'Active',
            joinedDate: 'Oct 2021',
            avatar: 'MT',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            id: 2,
            name: 'Sarah Jenkins',
            role: 'Admin',
            email: 'sarah.j@safecampus.edu',
            phone: '+1 (555) 987-6543',
            status: 'Active',
            joinedDate: 'Jan 2023',
            avatar: 'SJ',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 3,
            name: 'David Kim',
            role: 'Moderator',
            email: 'david.k@safecampus.edu',
            phone: '+1 (555) 456-7890',
            status: 'Active',
            joinedDate: 'Mar 2023',
            avatar: 'DK',
            color: 'bg-green-100 text-green-600'
        },
        {
            id: 4,
            name: 'Elena Rodriguez',
            role: 'Moderator',
            email: 'elena.r@safecampus.edu',
            phone: '+1 (555) 234-5678',
            status: 'Inactive',
            joinedDate: 'Jun 2023',
            avatar: 'ER',
            color: 'bg-purple-100 text-purple-600'
        }
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Personnel Management</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage access and roles for the SafeCampus platform.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add New User
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
                
                {/* Super Admin Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg flex-shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border-2 border-white/30">
                                MT
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-lg font-bold">Marcus Thorne</h2>
                                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-white/20">
                                        Super Admin
                                    </span>
                                </div>
                                <p className="text-blue-100 text-sm">marcus.t@safecampus.edu</p>
                            </div>
                        </div>
                        <div className="flex gap-8 text-center pr-8">
                            <div>
                                <p className="text-2xl font-bold">4</p>
                                <p className="text-xs text-blue-200">System Users</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">Active</p>
                                <p className="text-xs text-blue-200">Account Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-64 shadow-sm focus-within:ring-1 focus-within:ring-blue-500">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search personnel..." 
                                className="text-xs w-full focus:outline-none placeholder-gray-400"
                            />
                        </div>
                        <div className="flex gap-2">
                             {['All', 'Admin', 'Moderator'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        activeTab === tab 
                                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.filter(u => activeTab === 'All' || u.role === activeTab).map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center text-xs font-bold`}>
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                                                    <p className="text-[10px] text-gray-500">ID: #{1000 + user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                user.role === 'Super Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                user.role === 'Admin' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-green-50 text-green-700 border-green-100'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <Mail className="w-3 h-3 text-gray-400" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                    {user.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <span className={`text-xs font-medium ${user.status === 'Active' ? 'text-green-700' : 'text-gray-500'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                {user.joinedDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== 'Super Admin' && (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input type="text" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Enter full name" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input type="email" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Enter email address" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                        <option>Admin</option>
                                        <option>Moderator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Department</label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                        <option>Security</option>
                                        <option>IT Support</option>
                                        <option>Management</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Personnel;
