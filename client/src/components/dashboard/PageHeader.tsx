import { Link } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { Bell, ArrowLeft } from "lucide-react";

const PageHeader = () => {
  return (
   
     <div className="flex items-center justify-between px-2 py-2 border-b border-white/10">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors mr-4">
          <Bell className="w-5 h-5" />
        </button>

        <UserButton />
      </div>
    </div>
 
  );
};

export default PageHeader;