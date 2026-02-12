import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const RecentReports = () => {
    const reports = [
        {
            id: '#REP-8821',
            title: 'Suspicious Activity',
            location: 'Library, North Wing',
            status: 'ACTIVE',
            time: '2 mins ago',
            statusColor: 'bg-blue-100 text-blue-600',
            user: {
                initials: 'JD',
                color: 'bg-blue-100 text-blue-800'
            },
            badgeCount: '+1'
        },
        {
            id: '#REP-8819',
            title: 'Maintenance: Broken Lock',
            location: 'Main Entrance, West',
            status: 'PENDING REVIEW',
            time: '14 mins ago',
            statusColor: 'bg-orange-100 text-orange-600',
            user: {
                initials: 'AM',
                color: 'bg-gray-100 text-gray-800'
            }
        },
        {
            id: '#REP-8815',
            title: 'Theft Reported',
            location: 'Gymnasium Locker Room',
            status: 'RESOLVED',
            time: '45 mins ago',
            statusColor: 'bg-green-100 text-green-600',
            user: {
                initials: 'RK',
                color: 'bg-gray-100 text-gray-800'
            }
        }
    ];

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm text-gray-900">Recent Reports</h3>
                <a href="#" className="text-blue-600 text-[11px] font-semibold hover:underline">
                    View All
                </a>
            </div>

            <div className="flex-1 space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="group cursor-pointer hover:bg-gray-50 rounded-lg p-2.5 transition-colors -mx-2.5 border-b border-gray-100 last:border-0 pb-3">
                        <div className="flex justify-between items-start mb-1.5">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${report.statusColor}`}>
                                {report.status}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">{report.time}</span>
                        </div>
                        
                        <h4 className="font-semibold text-xs text-gray-900 mb-1">{report.title}</h4>
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                            <p className="text-[11px] text-gray-500">{report.location}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${report.user.color}`}>
                                    {report.user.initials}
                                </div>
                                {report.badgeCount && (
                                    <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        {report.badgeCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{report.id}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="mt-3 w-full py-2 text-center text-[11px] text-gray-500 hover:text-gray-700 font-medium border-t border-gray-100 pt-3">
                Load more activity...
            </button>
        </div>
    );
};

export default RecentReports;
