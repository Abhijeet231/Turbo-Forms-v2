import { useState } from "react"
import { NavLink } from "react-router-dom"
import { FileText, BarChart2, Inbox, Settings, Zap, HelpCircle, LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/react"
import HelpModal from "./HelpModal"

const navItems = [
  { label: "Forms", to: "/dashboard", icon: FileText },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart2 },
  { label: "Submissions", to: "/dashboard/submissions", icon: Inbox },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
]

const Sidebar = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <aside className="w-56 shrink-0 h-screen border-r bg-muted/30 flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="text-sm font-medium">Turbo forms</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-background font-medium"
                    : "text-muted-foreground hover:bg-background/50"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t pt-3">
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-background/50"
        >
          <HelpCircle className="w-4 h-4" />
          Help
        </button>
        <SignOutButton redirectUrl="/">
          <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-background/50">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </SignOutButton>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </aside>
  )
}

export default Sidebar