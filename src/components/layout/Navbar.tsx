
import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header 
      className="bg-droid-orange/95 border-b border-droid-orange/20 dark:border-gray-700 h-16 flex items-center px-4 md:px-6"
    >
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2 text-white hover:bg-white/20"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>
      
      <div className="flex-1 flex items-center gap-2 md:hidden">
        <img
          src="/Drooid_Logo_wordmark.png"
          alt="Drooid Logo"
          className="h-8"
        />
        <span className="text-white font-semibold">Admin</span>
      </div>
      
      <div className="flex-1"></div>
    </header>
  );
};
