import React, { useState, useEffect } from 'react';
import { MoreVertical, Filter, Download } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../backend/firebase';
import { useNavigate } from 'react-router-dom';

const IncidentTable = () => {
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
            setReports(reportsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reports:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getLocationString = (loc) => {
        if (!loc) return 'Unknown';
        if (typeof loc === 'string') return loc;
        if (Array.isArray(loc)) return `${loc[0]}, ${loc[1]}`;
        if (typeof loc === 'object') {
             if (loc.latitude) return `${loc.latitude}, ${loc.longitude}`;
             if (loc._lat) return `${loc._lat}, ${loc._long}`;
        }
        return String(loc);
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-400';
        const s = String(status).toLowerCase();
        if (s === 'resolved') return 'bg-green-500';
        if (s === 'in progress') return 'bg-blue-500';
        return 'bg-yellow-500';
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Loading incidents...</div>;
    }

    if (!reports) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="px-4 py-2.5 flex justify-between items-center border-b border-gray-200 shrink-0">
                <h3 className="text-sm font-semibold text-gray-900">Detailed Incident Log</h3>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded-md text-[11px] text-gray-600 hover:bg-gray-50 bg-white font-medium">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded-md text-[11px] text-gray-600 hover:bg-gray-50 bg-white font-medium">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide">Incident ID</th>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide">Type</th>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide">Location</th>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide">Reported By</th>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide">Status</th>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reports.map((row) => (
                            <tr 
                                key={row.id} 
                                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                onClick={() => navigate(`/reports/${row.id}`)}
                            >
                                <td className="px-4 py-2.5 font-semibold text-[11px] text-gray-900">#{String(row.id || '').substring(0, 8)}</td>
                                <td className="px-4 py-2.5 text-[11px] text-gray-700">
                                    {row.title || row.category || (row.description ? row.description.substring(0, 30) + (row.description.length > 30 ? '...' : '') : 'Incident Report')}
                                </td>
                                <td className="px-4 py-2.5 text-[11px] text-gray-600 truncate max-w-[150px]" title={String(row.address || getLocationString(row.location))}>
                                    {String(row.address || getLocationString(row.location))}
                                </td>
                                <td className="px-4 py-2.5 text-[11px] text-gray-600 font-mono">{row.userId ? String(row.userId).substring(0, 8) + '...' : 'Anonymous'}</td>
                                <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(row.status)}`}></div>
                                        <span className="font-medium text-[11px] text-gray-700">{row.status || 'Pending'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-3.5 h-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentTable;
