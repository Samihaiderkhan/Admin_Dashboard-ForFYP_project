import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-[#F9FAFB]">
            {/* Sidebar (Fixed width) */}
            <Sidebar />

            {/* Main Content Area (Fluid) - Add left margin to account for fixed sidebar */}
            <div className="flex-1 flex flex-col overflow-hidden ml-64">
                {/* Page Content (Scrollable) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
