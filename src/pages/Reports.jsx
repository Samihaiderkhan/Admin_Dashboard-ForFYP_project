import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, FileText, AlertTriangle, Target, CheckCircle, Download, Filter, ChevronDown, MoreVertical, ImageOff } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../backend/firebase';
import { useNavigate } from 'react-router-dom';

// ── Helpers ──────────────────────────────────────────────────────────────────
const resolveImageUrl = (report) => {
    const raw = report?.imageurl || report?.imageUrl || report?.image || report?.photoURL || null;
    if (!raw) return null;
    // Proxy localhost / emulator URLs that can't be reached from the browser
    if (
        raw.startsWith('http://localhost') ||
        raw.startsWith('http://127.0.0.1') ||
        raw.startsWith('http://10.')
    ) {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(raw)}`;
    }
    return raw;
};

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

const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
};

// Check if a Firestore timestamp is today
const isToday = (ts) => {
    if (!ts) return false;
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    );
};

const STATUS_COLORS = {
    Resolved:     'text-green-600 bg-green-50',
    'In Progress':'text-yellow-600 bg-yellow-50',
    Pending:      'text-blue-600 bg-blue-50',
    Done:         'text-purple-600 bg-purple-50',
};

// ── Image cell with broken-state fallback ────────────────────────────────────
const ReportImage = ({ report }) => {
    const [error, setError] = useState(false);
    const url = resolveImageUrl(report);

    if (!url || error) {
        return (
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageOff className="w-4 h-4 text-gray-400" />
            </div>
        );
    }
    return (
        <img
            src={url}
            alt="Report"
            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
            onError={() => setError(true)}
        />
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Reports = () => {
    const [activeTab, setActiveTab] = useState('All Reports');
    const [searchQuery, setSearchQuery] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Live Firestore listener — picks up status changes from ReportDetails instantly
    useEffect(() => {
        const q = query(collection(db, 'complaints'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setReports(data);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching reports:', error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ── Derived stats ─────────────────────────────────────────────────────────
    const resolvedToday = reports.filter(
        (r) => (r.status === 'Resolved' || r.status === 'Done') && isToday(r.resolvedAt)
    ).length;

    const stats = [
        { label: 'TOTAL REPORTS',    value: reports.length,                                    icon: FileText,     iconBg: 'bg-blue-50',  iconColor: 'text-blue-600' },
        { label: 'HIGH SEVERITY',    value: reports.filter(r => r.severity === 'High').length, icon: AlertTriangle, iconBg: 'bg-red-50',   iconColor: 'text-red-600' },
        { label: 'AVG. AI CONFIDENCE', value: 'N/A',                                           icon: Target,       iconBg: 'bg-blue-50',  iconColor: 'text-blue-600' },
        { label: 'RESOLVED TODAY',   value: resolvedToday,                                     icon: CheckCircle,  iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    ];

    const tabs = ['All Reports', 'Pending', 'Critical', 'Resolved', 'Done'];

    // ── Filtering ─────────────────────────────────────────────────────────────
    const filteredReports = reports.filter((r) => {
        const matchesTab =
            activeTab === 'All Reports'  ? true :
            activeTab === 'Pending'      ? (!r.status || r.status === 'Pending') :
            activeTab === 'Resolved'     ? r.status === 'Resolved' :
            activeTab === 'Done'         ? r.status === 'Done' :
            activeTab === 'Critical'     ? r.severity === 'High' :
            true;

        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || (
            (r.id || '').toLowerCase().includes(q) ||
            (r.category || '').toLowerCase().includes(q) ||
            (r.description || '').toLowerCase().includes(q) ||
            (r.address || getLocationString(r.location)).toLowerCase().includes(q)
        );

        return matchesTab && matchesSearch;
    });

    // ── Export CSV ────────────────────────────────────────────────────────────
    const exportCSV = () => {
        const headers = ['ID', 'Category', 'Description', 'Status', 'Location', 'User ID', 'Reported At', 'Resolved At'];
        const rows = reports.map((r) => [
            r.id,
            r.category || '',
            (r.description || '').replace(/,/g, ';'),
            r.status || 'Pending',
            r.address || getLocationString(r.location),
            r.userId || '',
            formatDate(r.createdAt),
            r.resolvedAt ? formatDate(r.resolvedAt) : '',
        ]);

        const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SafeCampus_Reports_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Download All Reports (text list) ──────────────────────────────────────
    const downloadAllReports = () => {
        const lines = [
            '═══════════════════════════════════════════════════════',
            '           SAFECAMPUS — ALL INCIDENT REPORTS           ',
            `           Generated: ${new Date().toLocaleString()}`,
            '═══════════════════════════════════════════════════════',
            '',
        ];

        reports.forEach((r, i) => {
            lines.push(`${i + 1}. [${r.status || 'Pending'}] ${r.category || 'Incident'}`);
            lines.push(`   ID       : ${r.id}`);
            lines.push(`   Location : ${r.address || getLocationString(r.location)}`);
            lines.push(`   Reported : ${formatDate(r.createdAt)}`);
            lines.push(`   User ID  : ${r.userId || 'N/A'}`);
            lines.push(`   Details  : ${r.description || 'No description'}`);
            if (r.adminComment) lines.push(`   Admin    : ${r.adminComment}`);
            lines.push('');
        });

        lines.push('═══════════════════════════════════════════════════════');

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SafeCampus_AllReports_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Render ────────────────────────────────────────────────────────────────
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                {/* Page Title + Buttons */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Reports Management</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Review and manage reported safety incidents across the campus.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={exportCSV}
                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 bg-white font-medium transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export CSV
                        </button>
                        <button
                            onClick={downloadAllReports}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            Download All Reports
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 shrink-0">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${stat.iconBg} shrink-0`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs + Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center shrink-0">
                    <div className="flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                    activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                                {tab === 'Resolved' && (
                                    <span className="ml-1.5 bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        {reports.filter(r => r.status === 'Resolved').length}
                                    </span>
                                )}
                                {tab === 'Done' && (
                                    <span className="ml-1.5 bg-purple-100 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        {reports.filter(r => r.status === 'Done').length}
                                    </span>
                                )}
                                {tab === 'Pending' && (
                                    <span className="ml-1.5 bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        {reports.filter(r => !r.status || r.status === 'Pending').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 bg-white font-medium">
                            <Filter className="w-3 h-3" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
                    <div className="overflow-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                                Loading reports...
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-16">Image</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Incident Type</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Reported At</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            onClick={() => navigate(`/reports/${report.id}`)}
                                            className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-4 py-3">
                                                <ReportImage report={report} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs font-semibold text-gray-900">
                                                    {report.title || report.category || (report.description ? report.description.substring(0, 40) + (report.description.length > 40 ? '...' : '') : 'Incident Report')}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">ID: {report.id}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-blue-600 font-medium truncate max-w-xs" title={report.address || getLocationString(report.location)}>
                                                    {report.address || getLocationString(report.location)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-gray-500">{formatDate(report.createdAt)}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[report.status] || STATUS_COLORS['Pending']}`}>
                                                    {report.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.id}`); }}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReports.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-12 text-center text-gray-400 text-sm">
                                                No reports found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
