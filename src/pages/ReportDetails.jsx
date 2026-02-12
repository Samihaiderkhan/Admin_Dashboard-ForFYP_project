import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Search, Download, Maximize2, Play, AlertTriangle, 
    MapPin, Clock, Map, CheckCircle, XCircle, ArrowRight,
    MessageSquare, AlertCircle, Share2
} from 'lucide-react';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState('');

    return (
        <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Critical Priority</span>
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Report #{id || '10293'}</h1>
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
                {/* Left Content - Video & Meta */}
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                    {/* Video Player Container - Flex Grow to fill space */}
                    <div className="bg-black rounded-xl overflow-hidden shadow-sm relative flex-1 min-h-0 group">
                        {/* Video Placeholder/Content */}
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                            {/* Simulated Camera Feed */}
                            <div className="relative w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-900">
                                {/* Simulated Fire Detection Box */}
                                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-80 border-2 border-red-500 bg-red-500/10">
                                    <div className="absolute -top-7 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-sm">
                                        DETECTED: FIRE (82%)
                                    </div>
                                </div>
                                <img 
                                    src="https://images.unsplash.com/photo-1513224502586-d1e6093556f3?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Surveillance Feed" 
                                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                                />
                            </div>
                        </div>

                        {/* Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-center gap-4 text-white">
                                <button className="hover:text-blue-400 transition-colors">
                                    <Play className="w-5 h-5 fill-current" />
                                </button>
                                {/* Progress Bar */}
                                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                    <div className="w-[65%] h-full bg-blue-500 rounded-full relative"></div>
                                </div>
                                <span className="text-xs font-mono font-medium text-gray-300">00:14 / 00:22</span>
                                <span className="text-xs font-mono font-medium text-gray-300 uppercase">CAM_NORTH_042</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards Grid - Fixed Height */}
                    <div className="grid grid-cols-3 gap-4 h-[90px] flex-shrink-0">
                        {/* Location Card */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">LOCATION</h3>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-xs">Library North Wing</p>
                                    <p className="text-[10px] text-gray-500">Floor 2, Room 204</p>
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
                                    <p className="font-bold text-gray-900 text-xs">Oct 24, 2023</p>
                                    <p className="text-[10px] text-gray-500">14:32:11 GMT-5</p>
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

                {/* Right Sidebar - AI Analysis */}
                <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col h-full">
                    <div className="p-5 flex-1 flex flex-col gap-5 overflow-hidden">
                        {/* Analysis Section */}
                        <div className="flex-shrink-0">
                            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3">AI Analysis Details</h3>
                            
                            <div className="flex justify-between items-center mb-2.5">
                                <span className="text-xs font-medium text-gray-500">Classification</span>
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Fire Detection</span>
                            </div>

                            <div className="bg-red-50 border border-red-100 p-2.5 rounded-lg flex gap-2 mb-4">
                                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] font-medium text-red-800 leading-snug">
                                    Visual smoke and flame patterns identified in high-traffic zone.
                                </p>
                            </div>

                            {/* Confidence Score */}
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Confidence Score</span>
                                    <span className="text-sm font-bold text-blue-600">82%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                                    <div className="h-full bg-blue-600 rounded-full w-[82%]"></div>
                                </div>
                                <p className="text-[10px] text-gray-400">Based on pattern matching from 14,000+ thermal training samples.</p>
                            </div>

                            {/* Severity Level */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Severity Level</span>
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HIGH</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 h-1">
                                    <div className="bg-green-400 rounded-l-full opacity-30"></div>
                                    <div className="bg-yellow-400 opacity-30"></div>
                                    <div className="bg-orange-500 opacity-30"></div>
                                    <div className="bg-red-600 rounded-r-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 flex-shrink-0"></div>

                        {/* System Logs */}
                        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3">System Notes & Logs</h3>
                            <div className="space-y-3">
                                <div className="flex gap-2.5 relative">
                                    <div className="absolute top-2 left-[5px] bottom-[-15px] w-px bg-gray-100"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 z-10 mt-1">
                                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">System Alert</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">Automated announcement triggered in Zone B.</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">2 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 relative">
                                    <div className="w-3 h-3 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 z-10 mt-1">
                                        <Share2 className="w-2 h-2 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Sensor Hub 14</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">Smoke sensor S-104 confirming visual data.</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">1 min ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 flex-shrink-0"></div>

                        {/* Admin Comment */}
                        <div className="flex-shrink-0">
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
                    <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2 flex-shrink-0">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all">
                            <CheckCircle className="w-3.5 h-3.5" />
                            APPROVE & DISPATCH
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                <ArrowRight className="w-3 h-3" />
                                REASSIGN
                            </button>
                            <button className="flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors">
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
