import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  SquaresFourIcon,
  RowsIcon,
  ChatCircleIcon,
  GearSixIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "U");

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-58 min-w-58 bg-[#111111] border-r border-white/5 flex flex-col px-2.5 py-4 gap-4">


        {/* Branding */}
        <div className="relative mb-3 overflow-hidden rounded-2xl border border-orange-500/10 bg-gradient-to-br from-orange-950/30 via-[#161311] to-[#0f0f0f] p-4">
          {/* ambient glow */}
          <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-orange-600/5 blur-3xl" />

          <div className="relative flex items-center gap-3">
            {/* softer icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/[0.04] backdrop-blur-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-300/15 to-orange-500/10 text-[13px] text-orange-100/80">
                ⚡
              </div>
            </div>

            {/* text */}
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-orange-50 via-orange-100 to-orange-300 bg-clip-text text-[15px] font-semibold tracking-[-0.03em] text-transparent">
                TurboForm
              </span>

              <div className="mt-1 flex items-center gap-1.5">
                <div className="h-px w-5 bg-orange-400/20" />

                <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-orange-100/35">
                  Form Builder
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* New Form Button */}
        <button className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-orange-700 hover:bg-orange-600 active:scale-[0.97] text-white text-[13.5px] font-semibold rounded-lg transition-all duration-150 mb-1.5">
          <PlusIcon size={15} weight="bold" />
          New Form
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-px flex-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-100 ${
                isActive
                  ? "bg-orange-200/10 text-orange-500"
                  : "text-white/40 hover:text-white/80 hover:bg-white/4"
              }`
            }
          >
            <SquaresFourIcon size={18} weight="duotone" />
            Dashboard
          </NavLink>

          <NavLink
            to="/templates"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-100 ${
                isActive
                  ? "bg-orange-200/10 text-orange-500"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`
            }
          >
            <RowsIcon size={18} weight="duotone" />
            Templates
          </NavLink>

          <NavLink
            to="/responses"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-100 ${
                isActive
                  ? "bg-orange-200/10 text-orange-500"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`
            }
          >
            <ChatCircleIcon size={18} weight="duotone" />
            Responses
          </NavLink>
        </nav>

        {/* ── Footer ── */}
        <div className="flex flex-col gap-px pt-1">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-100 ${
                isActive
                  ? "bg-orange-700/15 text-orange-500"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`
            }
          >
            <GearSixIcon size={18} weight="duotone" />
            Settings
          </NavLink>

          <div className="h-px bg-white/5 my-1.5 mx-0.5" />

          {/* User Row */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-100 group">
            <div className="w-7 h-7 min-w-[28px] bg-orange-700 rounded-md flex items-center justify-center text-[11px] font-bold text-white tracking-wide">
              {initials}
            </div>
            <div className="flex flex-col gap-px flex-1 min-w-0">
              <span className="text-[12.5px] font-semibold text-white/85 truncate leading-none">
                {user?.fullName ?? user?.email ?? "Account"}
              </span>
              {user?.fullName && (
                <span className="text-[11px] text-white/30 truncate leading-none">
                  {user.email}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-white/20 hover:text-orange-500 hover:bg-orange-700/10 p-1 rounded transition-all duration-100 flex-shrink-0"
            >
              <SignOutIcon size={15} weight="bold" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a] text-white">
        <Outlet />
      </main>
    </div>
  );
}
