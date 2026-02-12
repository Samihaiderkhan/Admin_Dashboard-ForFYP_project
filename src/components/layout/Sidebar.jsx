import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, FileText, Users, Shield } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutGrid, label: 'Overview', path: '/' },
        { icon: FileText, label: 'Incident Reports', path: '/reports' },
        { icon: Users, label: 'Personnel', path: '/personnel' },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Shield className="w-6 h-6 text-white text-fill-white" fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-blue-900 tracking-tight">SafeCampus</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                                isActive
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                                )}
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section - User Profile */}
            <div className="px-6 py-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                        MT
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Marcus Thorne</p>
                        <p className="text-xs text-gray-500 font-medium">Senior Safety Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
