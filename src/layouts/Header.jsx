import { useAuth } from "@/contexts/AuthContext";
// import { useTheme } from "@/hooks/use-theme";
import {
  CloudMoon,
  CloudSun,
  Maximize,
  Minimize,
  PanelLeftClose,
} from "lucide-react";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider"

export const Header = ({ collapsed, setCollapsed }) => {
  const { userData, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-3">
        <button
          className="p-2 rounded-lg  hover:bg-gray-200 dark:hover:bg-slate-700"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeftClose className={collapsed ? "rotate-180 " : ""} />
        </button>
      </div>

      <nav className="flex items-center justify-end w-full">
        <div className="flex items-center gap-2">
          <div className="border border-gray-700 px-2 py-2 rounded-lg text-sm font-semibold">
            {userData.organization}
          </div>

          <button
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <CloudSun size={20} />
            ) : (
              <CloudMoon size={20} />
            )}
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700"
            onClick={toggleFullScreen}
          >
            {isFullscreen ? (
              <Minimize size={20} />
            ) : (
              <Maximize size={20} />
            )}
          </button>

          <div className="relative inline-block rounded-lg  dark:hover:bg-slate-700">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-1 px-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  alt="User avatar"
                  src={userData.currentUserImageData}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold">
                  {userData.currentUserName}
                </span>
                <span className="text-xs text-gray-400">
                  {userData.currentUserLogin}
                </span>
              </div>
            </div>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul className="absolute right-0 mt-3 w-52 rounded shadow-lg bg-white transition-colors dark:bg-slate-900">
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
