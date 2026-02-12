import React from 'react';
import { MoreVertical, Filter, Download } from 'lucide-react';

const IncidentTable = () => {
    const data = [
        {
            id: '#REP-8821',
            type: 'Safety Hazard',
            location: 'Science Bldg 4',
            reportedBy: 'Prof. Sarah J.',
            priority: 'EMERGENCY',
            status: 'In Progress',
            statusColor: 'bg-blue-500',
            priorityColor: 'bg-red-100 text-red-600',
        },
        {
            id: '#REP-8820',
            type: 'Technical Issue',
            location: 'Student Union',
            reportedBy: 'Marcus Reed',
            priority: 'LOW',
            status: 'Unassigned',
            statusColor: 'bg-gray-400',
            priorityColor: 'bg-green-100 text-green-600',
        },
        {
            id: '#REP-8818',
            type: 'Lost Property',
            location: 'Dorm C (Lobby)',
            reportedBy: 'Elena Petrova',
            priority: 'MEDIUM',
            status: 'Resolved',
            statusColor: 'bg-green-500',
            priorityColor: 'bg-yellow-100 text-yellow-600',
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="px-4 py-2.5 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
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
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide">Priority</th>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide">Status</th>
                            <th className="px-4 py-2 uppercase text-[10px] font-semibold tracking-wide text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-2.5 font-semibold text-[11px] text-gray-900">{row.id}</td>
                                <td className="px-4 py-2.5 text-[11px] text-gray-700">{row.type}</td>
                                <td className="px-4 py-2.5 text-[11px] text-gray-600">{row.location}</td>
                                <td className="px-4 py-2.5 text-[11px] text-gray-600">{row.reportedBy}</td>
                                <td className="px-4 py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${row.priorityColor}`}>
                                        {row.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${row.statusColor}`}></div>
                                        <span className="font-medium text-[11px] text-gray-700">{row.status}</span>
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
