import React, { useState } from 'react';
import { Search, Bell, Settings, FileText, AlertTriangle, Target, CheckCircle, Download, Filter, ChevronDown, MoreVertical } from 'lucide-react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('All Reports');
    const [timeFilter, setTimeFilter] = useState('Last 24 Hours');

    const stats = [
        {
            label: 'TOTAL REPORTS',
            value: '1,284',
            change: '+12%',
            icon: FileText,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            label: 'HIGH SEVERITY',
            value: '18',
            change: '+4',
            icon: AlertTriangle,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-600'
        },
        {
            label: 'AVG. AI CONFIDENCE',
            value: '94.2%',
            change: '+0.5%',
            icon: Target,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            label: 'RESOLVED TODAY',
            value: '42',
            change: '85% daily goal',
            icon: CheckCircle,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600'
        }
    ];

    const reports = [
        {
            id: '#REP-2480',
            type: 'Broken Entry Point',
            severity: 'Critical',
            severityColor: 'bg-red-50 text-red-600',
            confidence: 98,
            location: 'Dormitory A, Floor 2',
            status: 'Pending',
            statusColor: 'text-gray-700',
            image: '🚪'
        },
        {
            id: '#REP-2488',
            type: 'Unauthorized Access',
            severity: 'Medium',
            severityColor: 'bg-yellow-50 text-yellow-700',
            confidence: 82,
            location: 'Main Library East',
            status: 'Resolved',
            statusColor: 'text-green-600',
            image: '🔐'
        },
        {
            id: '#REP-2487',
            type: 'Fire Hazard',
            severity: 'Critical',
            severityColor: 'bg-red-50 text-red-600',
            confidence: 95,
            location: 'Science Lab 402',
            status: 'Pending',
            statusColor: 'text-gray-700',
            image: '🏢'
        },
        {
            id: '#REP-2481',
            type: 'Slippery Surface',
            severity: 'Medium',
            severityColor: 'bg-yellow-50 text-yellow-700',
            confidence: 76,
            location: 'Student Center Lobby',
            status: 'Resolved',
            statusColor: 'text-green-600',
            image: '⚠️'
        }
    ];

    const tabs = ['All Reports', 'Pending', 'Critical', 'Resolved'];

    return (
        <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center flex-shrink-0">
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
                            <div className={`p-2 rounded-lg ${stat.iconBg} flex-shrink-0`}>
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
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Severity</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">AI Confidence</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <tr 
                                        key={report.id} 
                                        onClick={() => window.location.href = `/reports/${report.id.replace('#', '')}`}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg group-hover:bg-white transition-colors">
                                                {report.image}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900">{report.type}</p>
                                                <p className="text-[10px] text-gray-500">ID: {report.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-semibold ${report.severityColor}`}>
                                                {report.severity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                                                    <div 
                                                        className="bg-blue-600 h-1.5 rounded-full" 
                                                        style={{ width: `${report.confidence}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-semibold text-gray-900">{report.confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-blue-600 font-medium hover:underline">{report.location}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold ${report.statusColor}`}>
                                                {report.status}
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
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center">
                        <p className="text-xs text-gray-500">Showing 1 to 4 of 1,284 reports</p>
                        <div className="flex gap-1">
                            <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-gray-100">
                                ‹
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-xs bg-blue-600 text-white font-semibold">
                                1
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-gray-100">
                                2
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-gray-100">
                                3
                            </button>
                            <span className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">...</span>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-gray-100">
                                321
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-gray-100">
                                ›
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <p>© 2024 SafeCampus Monitoring Systems. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600">System Status</a>
                        <a href="#" className="hover:text-gray-600">Contact Support</a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
