import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useClickOutside } from "../hooks/use-click-outside";
import { Sidebar, DefaultHeader } from "@/components";
import { Bot, CloudUpload } from "lucide-react";

export const DefaultLayout = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);

  const sidebarRef = useRef(null);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) setCollapsed(true);
  });

  return (
    <div className="min-h-screen bg-slate-100 text-2xl transition-colors dark:bg-slate-950">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
          !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
        )}
      />
      <Sidebar
        ref={sidebarRef}
        collapsed={collapsed}
      />
      <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[50px]" : "md:ml-[180px]")}>
        <DefaultHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <main className="h-[calc(100vh-52px)] overflow-y-auto overflow-x-hidden p-2">
          <Outlet />

          <Toaster />
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};
