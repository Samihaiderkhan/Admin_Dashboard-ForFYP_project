import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../../backend/firebase';
import { useNavigate } from 'react-router-dom';

const RecentReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, "complaints"), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReports(reportsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching recent reports:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diff = new Date() - date;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-600';
        const s = String(status).toLowerCase();
        if (s === 'resolved') return 'bg-green-100 text-green-600';
        if (s === 'active' || s === 'in progress') return 'bg-blue-100 text-blue-600';
        return 'bg-orange-100 text-orange-600';
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

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-4 border border-gray-200 h-full flex items-center justify-center text-gray-400 text-xs">
                Loading...
            </div>
        );
    }
    
    if (!reports) return null;

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm text-gray-900">Recent Reports</h3>
                <button 
                    onClick={() => navigate('/reports')}
                    className="text-blue-600 text-[11px] font-semibold hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
                {reports.map((report) => (
                    <div 
                        key={report.id} 
                        onClick={() => navigate(`/reports/${report.id}`)}
                        className="group cursor-pointer hover:bg-gray-50 rounded-lg p-2.5 transition-colors -mx-2.5 border-b border-gray-100 last:border-0 pb-3"
                    >
                        <div className="flex justify-between items-start mb-1.5">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${getStatusColor(report.status)}`}>
                                {report.status || 'PENDING'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">{getTimeAgo(report.createdAt)}</span>
                        </div>
                        
                        <h4 className="font-semibold text-xs text-gray-900 mb-1 truncate">
                            {report.title || report.category || (report.description ? report.description.substring(0, 30) + '...' : 'Incident Report')}
                        </h4>
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                            <p className="text-[11px] text-gray-500 truncate">{String(report.address || getLocationString(report.location))}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold bg-gray-100 text-gray-600`}>
                                    {report.userId ? String(report.userId).substring(0, 2).toUpperCase() : 'NA'}
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">#{String(report.id || '').substring(0, 6)}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => navigate('/reports')}
                className="mt-3 w-full py-2 text-center text-[11px] text-gray-500 hover:text-gray-700 font-medium border-t border-gray-100 pt-3"
            >
                View all activity...
            </button>
        </div>
    );
};

export default RecentReports;
