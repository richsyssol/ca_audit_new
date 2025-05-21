import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { BsExclamationCircle } from "react-icons/bs";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiPackage } from "react-icons/fi";
import { FaIdCard } from "react-icons/fa";
import useAuthStore from "../../../store/authStore";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await logout(); // Ensure backend logout request
      console.log(res);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic menu options based on the role
  const menuOptions = {
    admin: [],
    hr: [
      // { label: "Manage Employees", link: "employees" },
      // { label: "Manage Clients", link: "clients" },
      // { label: "Manage Tasks", link: "tasks" },
      // { label: "Employee Records", link: "employees" },
      // { label: "Attendance", link: "attendance" },
      // { label: "Leave Requests", link: "leave" },
    ],
    // Additional roles could go here
  };

  const role = user?.role; // Get the role of the logged-in employee
  const menu = menuOptions[role] || []; // Get the appropriate menu for the role

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <Button
          shape="circle"
          icon={<UserOutlined />}
          onClick={() => setOpen(!open)}
        ></Button>
      </div>

      {open && (
        <div className="origin-top-right leading-none absolute text-[13px] right-[-12px] mt-2 w-40 rounded-md shadow-lg bg-white ring-1  ring-blue-900 ring-opacity-1">
          <div className="py-1 flex justify-between items-center gap-6 active:scale-95">
            <div className="px-5">{user?.username}</div>
            <div className="mr-2">
              <Button shape="circle" className="text-[20px]">
                <FaIdCard />
              </Button>
            </div>
          </div>

          {/* Dynamically rendered menu items based on the role */}
          {menu.map((item) => (
            <div
              key={item.link}
              className="py-1 flex justify-between items-center gap-1 active:scale-95"
              onClick={() => {
                navigate(`/dashboard/${item.link}`);
                setOpen(false);
              }}
            >
              <div className="px-5">{item.label}</div>
              <div className="mr-2">
                <Button shape="circle" className="text-[20px]">
                  <FiPackage />
                </Button>
              </div>
            </div>
          ))}

          <div
            className="py-1 flex justify-between items-center gap-2 active:scale-95"
            onClick={() => {
              window.location.href = "https://www.richsol.com/";
              setOpen(false);
            }}
          >
            <div className="px-5">About Us</div>
            <div className="mr-2">
              <Button shape="circle" className="text-[20px]">
                <BsExclamationCircle />
              </Button>
            </div>
          </div>

          <div
            className="py-1 flex justify-between gap-7 items-center active:scale-95"
            onClick={handleLogout}
          >
            <div className="px-5">Logout</div>
            <div className="mr-2">
              <Button shape="circle" icon={<LogoutOutlined />} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
