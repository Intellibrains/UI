import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Video,
  ClipboardList,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import intelliBrainIcon from "@/assets/intellibrain-icon.svg";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShareDropdown } from "@/components/sidebar/ShareDropdown";
import { SettingsDropdown } from "@/components/sidebar/SettingsDropdown";
import { UpgradePlanModal } from "@/components/sidebar/UpgradePlanModal";
import { logout, setAuthToken } from "@/services/api";

const navigation = [
  { name: "Chat with Documents", href: "/documents", icon: FileText },
  { name: "Chat with Videos", href: "/videos", icon: Video },
  { name: "Tests", href: "/tests", icon: ClipboardList },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"share" | "settings" | null>(null);
  const [shareButtonRef, setShareButtonRef] = useState<HTMLElement | null>(null);
  const [settingsButtonRef, setSettingsButtonRef] = useState<HTMLElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user info from localStorage
const name = localStorage.getItem("name") || "User";
const email = localStorage.getItem("email") || "user@email.com";
const avatarLetter = name.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-menu-trigger]") && !target.closest("[data-menu-popup]")) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeMenu]);

  const handleLogout = () => {
    logout();
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 h-screen",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Fixed Header — logo + collapse toggle */}
      <div className={cn(
        "flex items-center p-4 border-b border-sidebar-border shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={intelliBrainIcon} alt="IntelliBrain" className="w-8 h-8" />
            <span className="font-semibold text-sidebar-foreground">IntelliBrain</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* User Profile */}
        <div className={cn("p-4 border-b border-sidebar-border", collapsed && "flex justify-center")}>
          <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          <Avatar className="h-10 w-10 border-2 border-sidebar-accent">
  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
    {avatarLetter}
  </AvatarFallback>
</Avatar>

{!collapsed && (
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
    <p className="text-xs text-sidebar-foreground/60 truncate">{email}</p>
  </div>
)}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const link = (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn("sidebar-item", isActive && "sidebar-item-active", collapsed && "justify-center px-2")}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">{item.name}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}

          {/* Share dropdown */}
          {!collapsed && (
            <ShareDropdown
              isOpen={activeMenu === "share"}
              onOpen={() => {
                setActiveMenu(activeMenu === "share" ? null : "share");
              }}
              onClose={() => setActiveMenu(null)}
              buttonRef={shareButtonRef}
              onButtonRef={setShareButtonRef}
              sidebarWidth={collapsed ? 64 : 256}
            />
          )}

          {/* Settings dropdown */}
          {!collapsed && (
            <SettingsDropdown
              isOpen={activeMenu === "settings"}
              onOpen={() => {
                setActiveMenu(activeMenu === "settings" ? null : "settings");
              }}
              onClose={() => setActiveMenu(null)}
              buttonRef={settingsButtonRef}
              onButtonRef={setSettingsButtonRef}
              sidebarWidth={collapsed ? 64 : 256}
            />
          )}

          {/* Upgrade Plan */}
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div><UpgradePlanModal collapsed /></div>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">Upgrade Plan</TooltipContent>
            </Tooltip>
          ) : (
            <UpgradePlanModal />
          )}
        </nav>
      </div>

      {/* Logout — fixed at bottom */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button onClick={handleLogout} className="sidebar-item justify-center px-2 text-destructive hover:bg-destructive/10 w-full">
                <LogOut className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button onClick={handleLogout} className="sidebar-item text-destructive hover:bg-destructive/10 w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
