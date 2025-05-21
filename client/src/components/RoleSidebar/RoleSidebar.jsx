import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  Home,
  Users,
  Briefcase,
  ClipboardList,
  FileText,
  Banknote,
  Receipt,
  LifeBuoy,
  AlertCircle,
  BookOpen,
  BarChart,
  TrendingUp,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const sidebars = {
  admin: [
    { label: "Dashboard", link: "dashboard", icon: Home },
    {
      label: "Manage Peers",
      icon: Users,
      subMenu: [
        {
          label: "Peer Form 1",
          link: "/dashboard/peer/form1",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 2",
          link: "/dashboard/peer/form2",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 3",
          link: "/dashboard/peer/form3",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 4",
          link: "/dashboard/peer/form4",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 5",
          link: "/dashboard/peer/form5",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 6",
          link: "/dashboard/peer/form6",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 7",
          link: "/dashboard/peer/form7",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 8",
          link: "/dashboard/peer/form8",
          icon: ClipboardList,
        },
        {
          label: "Peer Form 9",
          link: "/dashboard/peer/form9",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "Manage Employees",
      icon: Users,
      subMenu: [
        {
          label: "Add New Employee",
          link: "/dashboard/employees/add",
          icon: ClipboardList,
        },
        {
          label: "Employee List",
          link: "/dashboard/employees/list",
          icon: ClipboardList,
        },
        {
          label: "Manage Attendance",
          link: "/dashboard/employees/attend",
          icon: ClipboardList,
        },
        {
          label: "Leave Requests",
          link: "/dashboard/employees/leave",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "Manage Clients",
      icon: Briefcase,
      subMenu: [
        {
          label: "Client Onboard",
          link: "/dashboard/clients/add",
          icon: ClipboardList,
        },
        {
          label: "Client List",
          link: "/dashboard/clients/list",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "Manage Service",
      icon: Briefcase,
      subMenu: [
        {
          label: "Add Service",
          link: "/dashboard/services/add",
          icon: ClipboardList,
        },
        {
          label: "Service List",
          link: "/dashboard/services/list",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "Manage Tasks",
      icon: ClipboardList,
      subMenu: [
        { label: "Assign Task", link: "tasks/assign", icon: ClipboardList },
        { label: "Task List", link: "tasks/list", icon: ClipboardList },
      ],
    },

    {
      label: "Support",
      icon: LifeBuoy,
      subMenu: [
        { label: "View Tickets", link: "tickets", icon: ClipboardList },
        { label: "Client Issues", link: "issues", icon: ClipboardList },
        { label: "Knowledge Base", link: "knowledge", icon: ClipboardList },
      ],
    },
  ],
};
function RoleSidebar() {
  const { user } = useAuthStore();
  console.log(user);
  const role = user?.role;
  const menu = sidebars[role] || [];

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className=" rounded-r-3xl hidden md:flex flex-col w-64 h-screen bg-gray-900 text-white">
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menu.map((item, index) => (
            <li key={index} className="p-2 rounded">
              {item.subMenu ? (
                <div>
                  {/* Parent Menu Item */}
                  <button
                    onClick={() => toggleMenu(index)}
                    className="flex items-center justify-between w-full p-2 rounded text-sm md:text-md hover:bg-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {openMenus[index] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Submenu Items */}
                  {openMenus[index] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.link}
                            className={({ isActive }) =>
                              `block p-2 text-sm rounded ${
                                isActive ? "bg-gray-700" : "hover:bg-gray-800"
                              }`
                            }
                          >
                            <div className="flex items-center space-x-3">
                              <subItem.icon className="w-5 h-5" />
                              <span> {subItem.label}</span>
                            </div>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded text-sm md:text-md ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-800"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RoleSidebar;
