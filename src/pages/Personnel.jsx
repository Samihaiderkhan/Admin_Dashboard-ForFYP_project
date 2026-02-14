import React, { useState, useEffect } from 'react';
import { 
    Search, Plus, MoreVertical, Shield, User, Trash2, Edit2, 
    CheckCircle, XCircle, Mail, Phone, Calendar 
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../backend/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Personnel = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Admin',
        department: 'Security'
    });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleMakeAdmin = async (userId, currentName) => {
        if (window.confirm(`Are you sure you want to promote ${currentName} to Admin?`)) {
            try {
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, {
                    role: "Admin"
                });
            } catch (error) {
                console.error("Error promoting user:", error);
                alert("Failed to promote user.");
            }
        }
    };

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email) {
            alert("Please enter both name and email.");
            return;
        }
        
        setIsAdding(true);
        try {
            await addDoc(collection(db, "users"), {
                ...newUser,
                status: 'Active',
                createdAt: serverTimestamp(),
                joinedDate: serverTimestamp()
            });
            setShowAddModal(false);
            setNewUser({ name: '', email: '', role: 'Admin', department: 'Security' });
        } catch (error) {
            console.error("Error adding user: ", error);
            alert("Failed to add user. Please try again.");
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        // Fetch users from Firestore
        const q = query(collection(db, "users"), orderBy("name"));
        // If 'name' field doesn't exist or isn't indexed, this might fail or show nothing. 
        // Fallback to no order if needed, but let's try ordering by name.
        // Actually, to be safe, let's just fetch all.
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            // Implement delete logic here (e.g., deleteDoc)
            console.log("Delete user", id);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return String(name).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const getRandomColor = (id) => {
        if (!id) return 'bg-gray-100 text-gray-600';
        const colors = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600'];
        return colors[String(id).charCodeAt(0) % colors.length] || colors[0];
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
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
                
                {/* Super Admin Card - Static for now or fetch specific admin */}
                <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border-2 border-white/30">
                                {currentUser?.displayName ? getInitials(currentUser.displayName) : (currentUser?.email ? currentUser.email.substring(0,2).toUpperCase() : 'AD')}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-lg font-bold">{currentUser?.displayName || 'Current Admin'}</h2>
                                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-white/20">
                                        System Admin
                                    </span>
                                </div>
                                <p className="text-blue-100 text-sm">{currentUser?.email || 'admin@safecampus.edu'}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 text-center pr-8">
                            <div>
                                <p className="text-2xl font-bold">{users.length}</p>
                                <p className="text-xs text-blue-200">System Users</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">Active</p>
                                <p className="text-xs text-blue-200">System Status</p>
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
                             {['All', 'Admin', 'Moderator', 'User'].map((tab) => (
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
                                {loading && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading users...</td>
                                    </tr>
                                )}
                                {!loading && users.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No users found.</td>
                                    </tr>
                                )}
                                {users.filter(u => activeTab === 'All' || (u.role && u.role === activeTab)).map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${getRandomColor(user.id)} flex items-center justify-center text-xs font-bold`}>
                                                    {getInitials(user.name || user.email || 'User')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name || 'Unknown Name'}</p>
                                                    <p className="text-[10px] text-gray-500">ID: #{user.id.substring(0, 6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                user.role === 'Super Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                user.role === 'Admin' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-green-50 text-green-700 border-green-100'
                                            }`}>
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <Mail className="w-3 h-3 text-gray-400" />
                                                    {user.email || 'No Email'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                    {user.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <span className={`text-xs font-medium ${user.status === 'Active' ? 'text-green-700' : 'text-gray-500'}`}>
                                                    {user.status || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                {formatDate(user.createdAt || user.joinedDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.role !== 'Admin' && (
                                                    <button 
                                                        onClick={() => handleMakeAdmin(user.id, user.name)}
                                                        className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                                                        title="Promote to Admin"
                                                    >
                                                        <Shield className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
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
                                    <input 
                                        type="text" 
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                        placeholder="Enter full name" 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="email" 
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                        placeholder="Enter email address" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
                                    <select 
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Moderator">Moderator</option>
                                        <option value="User">User</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Department</label>
                                    <select 
                                        value={newUser.department}
                                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="Security">Security</option>
                                        <option value="IT Support">IT Support</option>
                                        <option value="Management">Management</option>
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
                            <button 
                                onClick={handleAddUser}
                                disabled={isAdding}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                {isAdding ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Personnel;
