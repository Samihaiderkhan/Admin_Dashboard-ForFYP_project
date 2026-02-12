import React from 'react';
import { Maximize2, ChevronDown } from 'lucide-react';

const HeatmapSection = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-sm text-gray-900">Incident Heatmap</h3>
                    <p className="text-[11px] text-gray-500">Live density map of campus activity</p>
                </div>
                <div className="flex gap-1.5">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded-md text-[10px] font-medium text-gray-600 hover:bg-gray-50 bg-white">
                        Last 24 Hours
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    <button className="p-1 border border-gray-200 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-blue-50 rounded-lg relative overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-20" 
                     style={{ 
                         backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                         backgroundSize: '20px 20px' 
                     }}>
                </div>
                
                {/* Map Elements (Roads/Blocks - Abstract) */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-gray-300 transform -rotate-12"></div>
                <div className="absolute top-1/3 right-1/4 w-1/3 h-1 bg-gray-300 transform rotate-45"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1/2 h-1 bg-gray-300 transform rotate-12"></div>
                
                {/* Heatmap Spots */}
                <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-red-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                
                <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>

                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-orange-400 rounded-full opacity-20 blur-xl"></div>

                {/* Map Labels (Simulated) */}
                <span className="absolute top-1/4 left-1/4 text-[9px] font-semibold text-gray-500">Redwood City</span>
                <span className="absolute bottom-1/3 right-1/2 text-[9px] font-semibold text-gray-500">Menlo Park</span>
                <span className="absolute top-1/2 right-1/4 text-[9px] font-semibold text-gray-500">Palo Alto</span>

                {/* Legend Overlay */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-md border border-gray-100">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase block mb-1">Intensity</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-gray-400">Low</span>
                        <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500"></div>
                        <span className="text-[9px] text-gray-400">High</span>
                    </div>
                </div>
                 {/* Zoom Controls */}
                 <div className="absolute bottom-3 right-3 flex flex-col gap-0.5">
                    <button className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-t-md flex items-center justify-center hover:bg-white text-gray-600 font-semibold border border-gray-200 text-sm">+</button>
                    <button className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-b-md flex items-center justify-center hover:bg-white text-gray-600 font-semibold border border-gray-200 text-sm">-</button>
                </div>
            </div>
        </div>
    );
};

export default HeatmapSection;
