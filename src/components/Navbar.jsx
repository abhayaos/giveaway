import { useState, useEffect } from "react";
import { Menu, X, Gift, User, LogOut } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Rules", path: "/rules" },
  { name: "Winners", path: "/winners" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout, updateUserProfile } = useAuth();
  
  const isOrganizer = (currentUser?.role === 'organizer' && currentUser?.isApproved) || currentUser?.role === 'admin';
  
  const canPostGiveaways = isOrganizer;
  
  // Periodically check for updated approval status
  useEffect(() => {
    if (currentUser?.role === 'organizer' && !currentUser?.isApproved) {
      const interval = setInterval(async () => {
        await updateUserProfile();
      }, 10000); // Check every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [currentUser, updateUserProfile]);

  return (
    <nav className="w-full z-50 bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <RouterLink
          to="/"
          className="flex items-center gap-2 text-gray-900 font-bold text-xl"
        >
          <Gift className="text-black" />
          Abhaya Giveaway
        </RouterLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <RouterLink
              key={item.name}
              to={item.path}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              {item.name}
            </RouterLink>
          ))}

          {currentUser ? (
            <>
              <div className="flex items-center gap-4">
                <RouterLink
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                >
                  <User size={18} />
                  <span className="font-medium">{currentUser.name}</span>
                </RouterLink>
                {isOrganizer && (
                  <RouterLink
                    to="/organizer-dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    <Gift size={18} />
                    <span className="font-medium">My Giveaways</span>
                  </RouterLink>
                )}
                {isOrganizer && (
                  <RouterLink
                    to="/create-giveaway"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    <Gift size={18} />
                    <span className="font-medium">Post Giveaway</span>
                  </RouterLink>
                )}
                {(currentUser?.role === 'organizer' && !currentUser?.isApproved) && (
                  <div className="px-4 py-2 text-gray-500 italic text-sm">
                    <span className="font-medium">Pending approval</span>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
              <RouterLink
                to="/participants"
                className="px-6 py-2.5 rounded-lg bg-black text-white hover:bg-gray-900 transition-all duration-300 font-semibold shadow-sm"
              >
                My Entries
              </RouterLink>
            </>
          ) : (
            <>
              <RouterLink
                to="/login"
                className="px-5 py-2.5 rounded-lg text-gray-700 hover:text-black transition-colors duration-200 font-medium"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="px-6 py-2.5 rounded-lg bg-black text-white hover:bg-gray-900 transition-all duration-300 font-semibold shadow-sm"
              >
                Register
              </RouterLink>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-900 p-1"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-6 space-y-4 animate-fadeIn">
          {navItems.map((item) => (
            <RouterLink
              key={item.name}
              to={item.path}
              className="block py-2 text-gray-700 hover:text-black transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </RouterLink>
          ))}

          {currentUser ? (
            <>
              <div className="py-2 border-t border-gray-100">
                <RouterLink
                  to="/profile"
                  className="flex items-center gap-2 w-full py-2 text-left text-gray-700 hover:text-black transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  <User size={16} />
                  <span className="font-medium">{currentUser.name}</span>
                </RouterLink>
                {isOrganizer && (
                  <RouterLink
                    to="/organizer-dashboard"
                    className="flex items-center gap-2 w-full py-2 text-left text-gray-700 hover:text-black transition-colors duration-200"
                    onClick={() => setOpen(false)}
                  >
                    <Gift size={16} />
                    <span className="font-medium">My Giveaways</span>
                  </RouterLink>
                )}
                {isOrganizer && (
                  <RouterLink
                    to="/create-giveaway"
                    className="flex items-center gap-2 w-full py-2 text-left text-gray-700 hover:text-black transition-colors duration-200"
                    onClick={() => setOpen(false)}
                  >
                    <Gift size={16} />
                    <span className="font-medium">Post Giveaway</span>
                  </RouterLink>
                )}
                {(currentUser?.role === 'organizer' && !currentUser?.isApproved) && (
                  <div className="px-4 py-2 text-gray-500 italic text-sm">
                    <span className="font-medium">Pending approval</span>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full py-2 text-left text-gray-700 hover:text-black transition-colors duration-200 mt-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
              <RouterLink
                to="/participants"
                className="block text-center px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                My Entries
              </RouterLink>
            </>
          ) : (
            <>
              <RouterLink
                to="/login"
                className="block text-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="block text-center px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                Register
              </RouterLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
