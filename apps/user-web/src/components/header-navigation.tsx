import { IconChessKnight, IconMenu2 } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useTheme } from "./theme-provider";
import { Link, useLocation } from "react-router-dom";

const navMenue = [
  { title: "Market", link: "/" },
  { title: "Position", link: "/position" },
  { title: "Leader board", link: "/leader-board" },
];

function DropDown() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <IconMenu2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>

          <DropdownMenuItem onClick={(e) => e.preventDefault()}>
            <div
              className="flex items-center space-x-2"
              onClick={() => {
                theme === "dark" ? setTheme("light") : setTheme("dark");
              }}
            >
              <Label htmlFor="theme-switch">Dark mode</Label>
              <Switch id="theme-switch" checked={theme === "dark"} />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function HeaderNavigation() {
  const pathname = useLocation().pathname;
  return (
    <div className="border dark:border-b-white/20 border-b-black/20 top-0 fixed w-full dark:bg-background bg-background">
      <div className="flex items-center justify-between gap-10 max-w-7xl mx-auto h-14 px-4">
        {/* Title */}
        <div>
          <h2 className="text-3xl font-semibold select-none">
            <Link to={"/"}>
              <span className="flex items-center">
                <IconChessKnight className="size-10!" />
                Gambit
              </span>
            </Link>
          </h2>
        </div>

        {/* Navigation menue */}
        <div className="md:flex hidden items-center">
          <div>
            <ul className="flex gap-5 mt-1">
              {navMenue.map((nav, i) => (
                <li
                  key={i}
                  className={`${pathname === nav.link ? "text-foreground" : "text-[#7b8996]"}  font-semibold text-sm select-none`}
                >
                  <Link to={nav.link}>{nav.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ml-auto">
          <DropDown />
        </div>
      </div>
    </div>
  );
}
