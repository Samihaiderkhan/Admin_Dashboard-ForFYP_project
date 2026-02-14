import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, FileText, AlertTriangle, Target, CheckCircle, Download, Filter, ChevronDown, MoreVertical } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../backend/firebase';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('All Reports');
    const [timeFilter, setTimeFilter] = useState('Last 24 Hours');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, "complaints"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Reports Data:", reportsData);
            setReports(reportsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reports:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredReports = reports.filter(report => {
        if (activeTab === 'All Reports') return true;
        if (activeTab === 'Pending') return !report.status || report.status === 'Pending';
        if (activeTab === 'Resolved') return report.status === 'Resolved';
        // Add more logic if needed
        return true;
    });

    const stats = [
        {
            label: 'TOTAL REPORTS',
            value: reports.length,
            change: '',
            icon: FileText,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        // Placeholder stats - can be calculated based on reports data
        {
            label: 'HIGH SEVERITY',
            value: '0', 
            change: '',
            icon: AlertTriangle,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-600'
        },
        {
            label: 'AVG. AI CONFIDENCE',
            value: 'N/A',
            change: '',
            icon: Target,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            label: 'RESOLVED TODAY',
            value: reports.filter(r => r.status === 'Resolved').length,
            change: '',
            icon: CheckCircle,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600'
        }
    ];

    const tabs = ['All Reports', 'Pending', 'Critical', 'Resolved'];

    const getLocationString = (loc) => {
        if (!loc) return 'Unknown Location';
        if (typeof loc === 'string') return loc;
        if (Array.isArray(loc)) return `${loc[0]}, ${loc[1]}`;
        if (typeof loc === 'object') {
             if (loc.latitude) return `${loc.latitude}, ${loc.longitude}`;
             if (loc._lat) return `${loc._lat}, ${loc._long}`;
        }
        return String(loc);
    };

    return (
        <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input 
                            type="text" 
                            placeholder="Search by incident ID, location, or type..." 
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
                {/* Page Title */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Reports Management</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Review and manage reported safety incidents across the campus.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 bg-white font-medium">
                            Export CSV
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                            Create New Report
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${stat.iconBg} shrink-0`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    <span className="text-[10px] font-semibold text-green-600">{stat.change}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                    <div className="flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                    activeTab === tab
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 bg-white font-medium">
                            {timeFilter}
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 bg-white">
                            <Filter className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-auto flex-1">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Image</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Incident Type</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredReports.map((report) => (
                                    <tr 
                                        key={report.id} 
                                        onClick={() => navigate(`/reports/${report.id}`)}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg group-hover:bg-white transition-colors overflow-hidden">
                                                {(report.imageurl || report.imageUrl || report.image) ? (
                                                    <img 
                                                        src={report.imageurl || report.imageUrl || report.image} 
                                                        alt="Report" 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.style.display = 'none';
                                                            e.target.parentNode.textContent = '📷';
                                                        }}
                                                    />
                                                ) : '📷'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900">
                                                    {report.title || report.category || (report.description ? report.description.substring(0, 40) + (report.description.length > 40 ? '...' : '') : 'Incident Report')}
                                                </p>
                                                <p className="text-[10px] text-gray-500">ID: {report.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-blue-600 font-medium hover:underline truncate max-w-[200px]" title={report.address || getLocationString(report.location)}>
                                                {report.address || getLocationString(report.location)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold ${
                                                report.status === 'Resolved' ? 'text-green-600' : 'text-blue-600'
                                            }`}>
                                                {report.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button 
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredReports.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">
                                            No reports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
