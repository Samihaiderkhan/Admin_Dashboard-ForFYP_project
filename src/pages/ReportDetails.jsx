import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Search, Download, Maximize2, Play, AlertTriangle, 
    MapPin, Clock, Map, CheckCircle, XCircle, ArrowRight,
    MessageSquare, AlertCircle, Share2
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../backend/firebase';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, 'complaints', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Fetched Report Data:", data);
                    setReport({ id: docSnap.id, ...data });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-gray-500">Loading report details...</div>;
    }

    if (!report) {
        return <div className="h-screen flex items-center justify-center text-gray-500">Report not found</div>;
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Handle Firestore Timestamp or serialized date string
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    const getLocationString = (loc) => {
        if (!loc) return 'Unknown Location';
        if (Array.isArray(loc)) return `${loc[0]}, ${loc[1]}`;
        if (typeof loc === 'object' && loc.latitude) return `${loc.latitude}, ${loc.longitude}`;
        return loc;
    };

    return (
        <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">{report.category || 'Incident'}</span>
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Report #{report.id}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Search className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
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
                {/* Left Content - Image & Meta */}
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                    {/* Image Container - Flex Grow to fill space */}
                    {/* Image Container - Flex Grow to fill space */}
                    <div className="bg-black rounded-xl overflow-hidden shadow-sm relative flex-1 min-h-0 group">
                        <img
                            src={report.imageurl || report.imageUrl || report.image || "/api/placeholder/800/600"}
                            alt="Report Evidence"
                            className="w-full h-full object-contain bg-neutral-900" 
                            onError={(e) => { e.target.src = "/api/placeholder/800/600"; }}
                        />

                        {/* Overlay Info */}
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                            <h2 className="text-white text-lg font-semibold">
                                {report.title || report.category || (report.description ? report.description.substring(0, 50) + (report.description.length > 50 ? '...' : '') : 'Incident Report')}
                            </h2>
                            <p className="text-gray-300 text-sm mt-1">{report.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    {/* Info Cards Grid - Fixed Height */}
                    <div className="grid grid-cols-3 gap-4 h-[90px] shrink-0">
                        {/* Location Card */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">LOCATION</h3>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-gray-900 text-xs truncate" title={report.address || getLocationString(report.location)}>
                                        {report.address || getLocationString(report.location)}
                                    </p>
                                    <p className="text-[10px] text-gray-500">Coordinates</p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamp Card */}
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

                        {/* Map View Card */}
                        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer hover:border-blue-200 transition-colors">
                            <div className="absolute inset-0 bg-blue-50 opacity-50">
                                <div className="absolute inset-0" style={{ 
                                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                                    backgroundSize: '10px 10px' 
                                }}></div>
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

                {/* Right Sidebar - Details */}
                <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col h-full">
                    <div className="p-5 flex-1 flex flex-col gap-5 overflow-hidden">
                        {/* Analysis Section */}
                        <div className="shrink-0">
                            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3">Report Details</h3>
                            
                            <div className="flex justify-between items-center mb-2.5">
                                <span className="text-xs font-medium text-gray-500">Category</span>
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{report.category}</span>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-lg flex gap-2 mb-4">
                                <AlertTriangle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-medium text-gray-800 leading-snug">
                                    {report.description}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Status</span>
                                    <span className="text-sm font-bold text-blue-600">{report.status || 'Pending'}</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                                    <div className={`h-full rounded-full w-full ${report.status === 'Resolved' ? 'bg-green-600' : 'bg-blue-600'}`}></div>
                                </div>
                            </div>
                            
                            {/* User ID */}
                             <div className="mb-4">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Reported By (User ID)</span>
                                </div>
                                <p className="text-xs font-mono bg-gray-100 p-2 rounded">{report.userId}</p>
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
                            ></textarea>
                        </div>
                    </div>

                    {/* Fixed Actions Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2 shrink-0">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all">
                            <CheckCircle className="w-3.5 h-3.5" />
                            MARK RESOLVED
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                <ArrowRight className="w-3 h-3" />
                                IN PROGRESS
                            </button>
                            <button className="flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors">
                                <XCircle className="w-3 h-3" />
                                REJECT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             {/* Debug Section - Remove in production */}
            <div className="p-4 bg-gray-100 border-t border-gray-200 mt-4 overflow-auto">
                <h3 className="font-bold text-red-600 mb-2">Debug Data (For troubleshooting)</h3>
                <p className="text-xs font-mono mb-2"><strong>Image Source Used:</strong> {report.imageurl || report.imageUrl || report.image || "None detected"}</p>
                <details>
                    <summary className="cursor-pointer text-xs font-bold text-gray-700">View Raw Firestore Data</summary>
                    <pre className="text-[10px] whitespace-pre-wrap mt-2 bg-white p-2 rounded border border-gray-300">
                        {JSON.stringify(report, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    );
};

export default ReportDetails;
