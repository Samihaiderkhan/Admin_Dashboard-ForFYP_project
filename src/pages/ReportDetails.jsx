import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Download, Maximize2, AlertTriangle,
    MapPin, Clock, Map, CheckCircle, XCircle, ArrowRight,
    AlertCircle, Loader2
} from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../backend/firebase';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, 'complaints', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setReport({ id: docSnap.id, ...data });
                    setNote(data.adminComment || '');
                }
            } catch (error) {
                console.error('Error fetching report:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    // ── Update status in Firestore ──────────────────────────────────────────
    const updateStatus = async (newStatus) => {
        if (!report || updating) return;
        setUpdating(true);
        try {
            const docRef = doc(db, 'complaints', report.id);
            await updateDoc(docRef, {
                status: newStatus,
                adminComment: note,
                resolvedAt: serverTimestamp(),
            });
            setReport((prev) => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    // ── Delete (Reject) report from Firestore ───────────────────────────────
    const rejectReport = async () => {
        if (!report || updating) return;
        const confirmed = window.confirm(
            `Are you sure you want to REJECT and permanently delete this report?\n\nThis action cannot be undone.`
        );
        if (!confirmed) return;
        setUpdating(true);
        try {
            await deleteDoc(doc(db, 'complaints', report.id));
            navigate('/reports');
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Failed to delete the report. Please try again.');
            setUpdating(false);
        }
    };

    // ── Download report as a formatted text file ────────────────────────────
    const downloadReport = () => {
        if (!report) return;

        const formatDate = (ts) => {
            if (!ts) return 'N/A';
            const d = ts.toDate ? ts.toDate() : new Date(ts);
            return d.toLocaleString();
        };

        const getLocationString = (loc) => {
            if (!loc) return 'Unknown';
            if (Array.isArray(loc)) return `${loc[0]}, ${loc[1]}`;
            if (typeof loc === 'object' && loc.latitude) return `${loc.latitude}, ${loc.longitude}`;
            return loc;
        };

        const content = [
            '═══════════════════════════════════════════════',
            '           SAFECAMPUS — INCIDENT REPORT        ',
            '═══════════════════════════════════════════════',
            '',
            `Report ID   : ${report.id}`,
            `Category    : ${report.category || 'N/A'}`,
            `Status      : ${report.status || 'Pending'}`,
            `Reported By : ${report.userId || 'N/A'}`,
            `Location    : ${report.address || getLocationString(report.location)}`,
            `Timestamp   : ${formatDate(report.createdAt)}`,
            '',
            '───────────────────────────────────────────────',
            'DESCRIPTION',
            '───────────────────────────────────────────────',
            report.description || 'No description provided.',
            '',
            '───────────────────────────────────────────────',
            'ADMIN COMMENT',
            '───────────────────────────────────────────────',
            note || 'No comment added.',
            '',
            '═══════════════════════════════════════════════',
            `Generated: ${new Date().toLocaleString()}`,
            '═══════════════════════════════════════════════',
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SafeCampus_Report_${report.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Helpers ─────────────────────────────────────────────────────────────
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    const getLocationString = (loc) => {
        if (!loc) return 'Unknown Location';
        if (Array.isArray(loc)) return `${loc[0]}, ${loc[1]}`;
        if (typeof loc === 'object' && loc.latitude) return `${loc.latitude}, ${loc.longitude}`;
        return loc;
    };

    // Return the stored image URL directly — new uploads go to Firebase Storage
    // which is always publicly accessible from any browser.
    const resolveImageUrl = (r) => {
        return r?.imageurl || r?.imageUrl || r?.image || r?.photoURL || null;
    };

    const statusColor = {
        Resolved: 'text-green-600',
        'In Progress': 'text-yellow-600',
        Pending: 'text-blue-600',
        Done: 'text-purple-600',
    };

    const statusBarColor = {
        Resolved: 'bg-green-500',
        'In Progress': 'bg-yellow-500',
        Pending: 'bg-blue-500',
        Done: 'bg-purple-500',
    };

    // ── Render ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading report details...
            </div>
        );
    }

    if (!report) {
        return <div className="h-screen flex items-center justify-center text-gray-500">Report not found</div>;
    }

    const imageUrl = resolveImageUrl(report);
    const currentStatus = report.status || 'Pending';

    return (
        <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                            {report.category || 'Incident'}
                        </span>
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Report #{report.id}</h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Download Button */}
                    <button
                        onClick={downloadReport}
                        title="Download Report"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/reports')}
                        className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XCircle className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left — Image & Meta */}
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                    {/* Image */}
                    <div className="bg-black rounded-xl overflow-hidden shadow-sm relative flex-1 min-h-0">
                        {imageUrl && !imgError ? (
                            <img
                                src={imageUrl}
                                alt="Report Evidence"
                                className="w-full h-full object-contain bg-neutral-900"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-neutral-900 text-gray-500">
                                <AlertTriangle className="w-10 h-10 text-gray-600" />
                                <p className="text-sm text-gray-500">
                                    {imageUrl ? 'Image could not be loaded' : 'No image attached to this report'}
                                </p>
                            </div>
                        )}

                        {/* Overlay Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                            <h2 className="text-white text-lg font-semibold">
                                {report.title ||
                                    report.category ||
                                    (report.description
                                        ? report.description.substring(0, 50) + (report.description.length > 50 ? '...' : '')
                                        : 'Incident Report')}
                            </h2>
                            <p className="text-gray-300 text-sm mt-1">{report.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-3 gap-4 shrink-0">
                        {/* Location */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">LOCATION</h3>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p
                                        className="font-bold text-gray-900 text-xs truncate"
                                        title={report.address || getLocationString(report.location)}
                                    >
                                        {report.address || getLocationString(report.location)}
                                    </p>
                                    <p className="text-[10px] text-gray-500">Coordinates</p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">TIMESTAMP</h3>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-gray-50 rounded-lg text-gray-600">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-xs">{formatDate(report.createdAt)}</p>
                                    <p className="text-[10px] text-gray-500">Reported Time</p>
                                </div>
                            </div>
                        </div>

                        {/* Map View */}
                        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer hover:border-blue-200 transition-colors">
                            <div className="absolute inset-0 bg-blue-50 opacity-50">
                                <div
                                    className="absolute inset-0"
                                    style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                                ></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                                        <Map className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <span className="absolute top-2 left-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider z-10">MAP VIEW</span>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-95 bg-white border-l border-gray-200 flex flex-col h-full">
                    <div className="p-5 flex-1 flex flex-col gap-5 overflow-auto">
                        {/* Report Details */}
                        <div className="shrink-0">
                            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3">Report Details</h3>

                            <div className="flex justify-between items-center mb-2.5">
                                <span className="text-xs font-medium text-gray-500">Category</span>
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{report.category}</span>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-lg flex gap-2 mb-4">
                                <AlertTriangle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-medium text-gray-800 leading-snug">{report.description}</p>
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Status</span>
                                    <span className={`text-sm font-bold ${statusColor[currentStatus] || 'text-blue-600'}`}>
                                        {currentStatus}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                                    <div className={`h-full rounded-full w-full transition-colors ${statusBarColor[currentStatus] || 'bg-blue-500'}`}></div>
                                </div>
                            </div>

                            {/* User ID */}
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Reported By (User ID)</span>
                                </div>
                                <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{report.userId}</p>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 shrink-0"></div>

                        {/* Admin Comment */}
                        <div className="shrink-0">
                            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2">Admin Review Comment</h3>
                            <textarea
                                className="w-full h-16 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 resize-none"
                                placeholder="Add optional notes for the response team..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2 shrink-0">
                        <button
                            onClick={() => updateStatus('Resolved')}
                            disabled={updating || currentStatus === 'Resolved'}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                            {updating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            {currentStatus === 'Resolved' ? 'RESOLVED ✓' : 'MARK RESOLVED'}
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => updateStatus('In Progress')}
                                disabled={updating || currentStatus === 'In Progress'}
                                className="flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ArrowRight className="w-3 h-3" />
                                {currentStatus === 'In Progress' ? 'IN PROGRESS ✓' : 'IN PROGRESS'}
                            </button>

                            <button
                                onClick={rejectReport}
                                disabled={updating}
                                className="flex items-center justify-center gap-1.5 py-2 bg-white border border-red-200 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <XCircle className="w-3 h-3" />
                                REJECT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
