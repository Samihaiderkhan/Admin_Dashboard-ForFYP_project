import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, FileText, Activity, ShieldAlert, Timer, Shield } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../backend/firebase';
import StatCard from '../components/dashboard/StatCard';
import HeatmapSection from '../components/dashboard/HeatmapSection';
import RecentReports from '../components/dashboard/RecentReports';
import IncidentTable from '../components/dashboard/IncidentTable';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalReports: 0,
        activeIssues: 0,
        avgResponse: '5m 12s', // Placeholder as we don't have response time data yet
        safetyScore: 100
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "complaints"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reports = snapshot.docs.map(doc => doc.data());
            const total = reports.length;
            const active = reports.filter(r => r.status === 'Pending' || r.status === 'In Progress' || !r.status).length;
            
            // Simple logic for Safety Score: Start at 100, deduct 5 for each active issue, min 0.
            const calculatedScore = Math.max(0, 100 - (active * 2)).toFixed(1);

            setStats({
                totalReports: total,
                activeIssues: active,
                avgResponse: '5m 12s', 
                safetyScore: calculatedScore
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-hidden">
            {/* Top Bar / Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-base font-semibold text-gray-900">Admin Overview</h1>
                    <p className="text-xs text-gray-500">Real-time campus security status</p>
                </div>
                
                {/* Centered Search */}
                <div className="flex-1 max-w-sm mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input 
                            type="text" 
                            placeholder="Search incidents..." 
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Action Button */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all">
                        <Plus className="w-3.5 h-3.5" />
                        Generate Report
                    </button>

                    {/* Profile */}
                    <button className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs hover:bg-blue-200 transition-colors">
                        👤
                    </button>
                </div>
            </header>

            {/* Main Content - Flex layout to fit screen */}
            <main className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                {/* Stats Grid - Fixed height */}
                <div className="grid grid-cols-4 gap-3">
                    <StatCard 
                        title="Total Reports" 
                        value={loading ? "..." : stats.totalReports.toLocaleString()} 
                        change="Live" 
                        changeType="positive" 
                        icon={FileText} 
                        color="blue"
                    />
                    <StatCard 
                        title="Active Issues" 
                        value={loading ? "..." : stats.activeIssues.toLocaleString()} 
                        change={stats.activeIssues > 5 ? "High Alert" : "Normal"} 
                        changeType={stats.activeIssues > 5 ? "negative" : "positive"}
                        icon={ShieldAlert} 
                        color="red"
                    />
                     <StatCard 
                        title="Avg. Response" 
                        value={stats.avgResponse} 
                        change="Est." 
                        changeType="positive" 
                        icon={Timer} 
                        color="green"
                    />
                     <StatCard 
                        title="Safety Score" 
                        value={loading ? "..." : stats.safetyScore} 
                        change={stats.safetyScore > 80 ? "Excellent" : "Fair"} 
                        changeType={stats.safetyScore > 80 ? "positive" : "negative"} 
                        icon={Shield} 
                        color="blue"
                    />
                </div>

                {/* Middle Section: Map & Recent Reports - Flex grow */}
                <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
                    <div className="col-span-2 min-h-0">
                        <HeatmapSection />
                    </div>
                    <div className="min-h-0">
                        <RecentReports />
                    </div>
                </div>

                {/* Bottom Section: Table - Fixed height */}
                <div className="h-[180px]">
                   <IncidentTable />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
