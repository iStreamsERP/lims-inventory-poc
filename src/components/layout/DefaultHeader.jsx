import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { CloudMoon, CloudSun, LogOut, Maximize, Minimize, PanelLeftClose, Settings2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const DefaultHeader = ({ collapsed, setCollapsed }) => {
  const { userData, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const cart = useSelector((state) => state.cart.items);

  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="relative z-10 flex items-center justify-between bg-slate-100 px-3 py-2 shadow-sm dark:bg-slate-950">
      {/* Left: Logo and Collapse */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeftClose className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </Button>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="whitespace-nowrap text-sm font-semibold transition-colors hover:text-primary"
          >
            iStreams ERP Solutions - CRM
          </Link>
          <Badge className="hidden px-2 py-0.5 text-xs lg:flex">{userData.isAdmin ? "Admin Mode" : "User Mode"}</Badge>
        </div>
      </div>

      {/* Right: Controls */}
      <nav className="flex items-center gap-2">
        <div className="hidden rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium dark:border-gray-700 lg:block">
          {userData.companyName}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 p-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <CloudSun className="h-5 w-5" /> : <CloudMoon className="h-5 w-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden h-9 w-9 p-0 md:flex"
          onClick={toggleFullScreen}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>

        <Button
          variant="ghost"
          onClick={() => navigate("/cart-page")}
          className="relative"
        >
          <ShoppingCart className="h-6 w-6" />

          {/* Badge */}
          {cart.length > 0 && (
            <span className="absolute right-0 top-0 inline-flex items-center justify-center rounded-full bg-red-800 px-2 py-1 text-xs font-bold leading-none text-white">
              {cart.length}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={userData.userAvatar}
                alt={userData.userName}
              />
              <AvatarFallback>{userData.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-sm font-medium">{userData.userName}</span>
              <span className="max-w-[150px] truncate text-xs text-muted-foreground">{userData.userEmail}</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mt-2 w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userData.userName}</p>
                <p className="text-xs text-muted-foreground">{userData.userEmail}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/account-settings")}>
                <div className="flex w-full items-center justify-between">
                  Account Settings <Settings2 size={16} />
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600"
              >
                <div className="flex w-full items-center justify-between">
                  Log out <LogOut size={16} />
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="p-0">
                <Button className="h-9 w-full text-sm">Upgrade to Pro</Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};
