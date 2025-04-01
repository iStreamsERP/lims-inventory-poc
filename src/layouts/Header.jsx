import { useTheme } from "@/components/theme-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  CloudMoon,
  CloudSun,
  LogOut,
  Maximize,
  Minimize,
  PanelLeftClose,
} from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header = ({ collapsed, setCollapsed }) => {
  const { userData, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(false);
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

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-1">
        <button
          className="p-2 rounded-lg  hover:bg-gray-200 dark:hover:bg-slate-700"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeftClose className={collapsed ? "rotate-180 " : ""} />
        </button>
        <Link to="/" className="hidden md:block text-sm font-semibold whitespace-nowrap cursor-pointer hover:text-gray-300">
          iStreams ERP Solutions - CRM
        </Link>
      </div>

      <nav className="flex items-center justify-end w-full">
        <div className="flex items-center gap-2">
          <div className="border border-gray-700 px-2 py-2 rounded-lg text-sm font-semibold hidden lg:block">
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
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 hidden md:block"
            onClick={toggleFullScreen}
          >
            {isFullscreen ? (
              <Minimize size={20} />
            ) : (
              <Maximize size={20} />
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="seconsdary">
                <Avatar>
                  <AvatarImage src={userData.currentUserImageData} alt={userData.currentUserName} />
                  <AvatarFallback>{userData.currentUserName}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">
                    {userData.currentUserName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {userData.currentUserLogin}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut />  Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};







