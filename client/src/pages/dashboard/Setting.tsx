// dashboard/settings
// App has no user-settings backend (no PATCH /user/me, no preferences table),
// so account management is delegated entirely to Clerk's own <UserProfile />
// (name, email, password, sessions) — same pattern the rest of the app uses
// for auth UI (Navbar's SignInButton/UserButton). The one real app-level
// preference that exists is theme, so that gets its own row above it.

import { UserProfile } from "@clerk/react";
import { Settings as SettingsIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";

const Setting = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <SettingsIcon className="h-6 w-6 text-pink-500" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your appearance preferences and account.
        </p>
      </header>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Appearance</p>
            <p className="text-xs text-muted-foreground">
              Currently using {theme} mode.
            </p>
          </div>
          <ModeToggle />
        </CardContent>
      </Card>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Account</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <UserProfile
            routing="hash"
            appearance={{
              variables: {
                colorBackground: "var(--card)",
                colorForeground: "var(--card-foreground)",
                colorMutedForeground: "var(--muted-foreground)",
                colorPrimary: "#ec4899",
                colorInput: "var(--background)",
                colorInputForeground: "var(--foreground)",
                colorNeutral: "var(--foreground)",
                borderRadius: "var(--radius)",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none border-0",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Setting;
