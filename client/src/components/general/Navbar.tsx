import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { ModeToggle } from "@/components/mode-toggle";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Explore", link: "/explore" },
  { name: "Pricing", link: "/pricing" },
  { name: "Contact", link: "/contact" },
  { name: "About", link: "/about" },
];

const AppNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
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
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-neutral-600 dark:text-neutral-300"
            >
              {item.name}
            </a>
          ))}

          <div className="flex flex-col gap-3 w-full pt-2">
            <ModeToggle />
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full">Get Started</Button>
              </SignUpButton>
            </Show>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default AppNavbar;
