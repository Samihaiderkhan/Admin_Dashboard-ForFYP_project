import React from 'react';
import { ShieldAlert, Timer, FileBarChart, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
    const isPositive = changeType === 'positive';
    const isNegative = changeType === 'negative'; // Usually bad but in context of Response Time, lower is better.

    // Color mapping
    const colorMap = {
        'blue': { bg: 'bg-blue-50', text: 'text-blue-600' },
        'red': { bg: 'bg-red-50', text: 'text-red-500' },
        'green': { bg: 'bg-green-50', text: 'text-green-600' },
    };

    const currentColors = colorMap[color] || colorMap['blue'];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${currentColors.bg}`}>
                    <Icon className={`w-4 h-4 ${currentColors.text}`} />
                </div>
                {change && (
                    <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            change === 'High Alert'
                                ? 'bg-orange-50 text-orange-600'
                                : isPositive
                                ? 'bg-green-50 text-green-600'
                                : 'bg-green-50 text-green-600'
                        }`}
                    >
                        {change}
                    </span>
                )}
            </div>
            <div>
                <p className="text-gray-500 text-[11px] font-medium mb-0.5">{title}</p>
                <h3 className="text-xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
