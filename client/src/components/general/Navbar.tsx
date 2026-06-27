import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      {/* Left Side — Navigation Links */}
      <NavigationMenu>
        <NavigationMenuList>

          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Explore
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>About Us</NavigationMenuTrigger>

            <NavigationMenuContent>
              <div className="w-120 p-6">
                <p className="text-sm font-semibold text-foreground mb-1">
                  What is TurboForm?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A dynamic form builder that lets users create, customize,
                  share and manage interactive forms - with smooth field
                  reordering and real-time form handling.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium text-foreground mb-1">🎨 Customize</p>
                    <p className="text-xs text-muted-foreground">Drag, drop, and style fields your way.</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium text-foreground mb-1">⚡ Real-time</p>
                    <p className="text-xs text-muted-foreground">See responses as they come in, live.</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium text-foreground mb-1">🔗 Share</p>
                    <p className="text-xs text-muted-foreground">One link to share your form anywhere.</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium text-foreground mb-1">📊 Manage</p>
                    <p className="text-xs text-muted-foreground">Organize and export responses easily.</p>
                  </div>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Side — Theme toggle + Auth */}
      <div className="flex items-center gap-3">
        <ModeToggle />

        <Show when="signed-in">
          <UserButton />
        </Show>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost">Sign In</Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button>Get Started</Button>
          </SignUpButton>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;


// // React Router
// import { Link } from "react-router-dom";

// <NavigationMenuLink asChild>
//   <Link to="/app/home">Home</Link>
// </NavigationMenuLink>

// // Next.js
// import Link from "next/link";

// <NavigationMenuLink asChild>
//   <Link href="/app/home">Home</Link>
// </NavigationMenuLink>