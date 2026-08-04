import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, FileText, Users } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../backend/firebase";
import logoImg from "../../assets/icon-192.png";

const Sidebar = () => {
  const [adminName, setAdminName] = useState("Admin");
  const [adminRole, setAdminRole] = useState("Administrator");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Try displayName from Firebase Auth first
        if (user.displayName) {
          setAdminName(user.displayName);
        } else {
          // Fall back to Firestore users collection
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setAdminName(
                data.name ||
                  data.displayName ||
                  user.email?.split("@")[0] ||
                  "Admin",
              );
              if (data.role) setAdminRole(data.role);
            } else {
              setAdminName(user.email?.split("@")[0] || "Admin");
            }
          } catch {
            setAdminName(user.email?.split("@")[0] || "Admin");
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const navItems = [
    { icon: LayoutGrid, label: "Overview", path: "/" },
    { icon: FileText, label: "Incident Reports", path: "/reports" },
    { icon: Users, label: "Personnel", path: "/personnel" },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-8">
        <img
          src={logoImg}
          alt="SafeCampus Logo"
          className="w-9 h-9 rounded-lg object-contain"
        />
        <span className="text-xl font-bold text-blue-900 tracking-tight">
          SafeCampus
        </span>
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
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
            {getInitials(adminName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {adminName}
            </p>
            <p className="text-xs text-gray-500 font-medium truncate">
              {adminRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
