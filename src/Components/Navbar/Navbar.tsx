import { useContext, useState } from "react";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { TiSocialFlickrCircular } from "react-icons/ti";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { UserType } from "../../Types/ProfileUser.type";
import { BiSolidVideos } from "react-icons/bi";
import { MdMessage } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

async function getProfile(): Promise<UserType> {
  const res = await axios.get(
    "https://route-posts.routemisr.com/users/profile-data",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return res.data.data.user;
}

const loggedInLinks = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
];

const loggedOutLinks = [{ to: "/register", label: "Register" }];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userLogin, setuserLogin } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const isLoggedIn = Boolean(userLogin);
  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  // Same query key as the Profile page, so the data is shared (one request)
  const { data: user } = useQuery<UserType, Error>({
    queryKey: ["getProfile"],
    queryFn: getProfile,
    enabled: isLoggedIn,
  });

  const closeMenu = () => setIsOpen(false);

  function handleLogout() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    closeMenu();
    navigate("/login");
  }

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-base font-medium transition-colors hover:text-indigo-600 ${
      isActive ? "text-indigo-600" : "text-gray-700"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-600 hover:bg-gray-50 ${
      isActive ? "text-indigo-600" : "text-gray-700"
    }`;

  const iconButtonClass =
    "relative flex size-9 sm:size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-lg active:scale-95";

  const desktopButtonClass =
    "px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors";

  const mobileButtonClass =
    "block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              onClick={closeMenu}
              aria-label="Home"
              className="text-indigo-600 transition-all duration-300 hover:scale-110 hover:rotate-12 hover:text-indigo-700"
            >
              <TiSocialFlickrCircular className="size-11" />
            </Link>
          </div>

          {/* Search bar (large screens, logged in) */}
          {isLoggedIn && (
            <div className="relative mx-6 hidden max-w-md flex-1 lg:block">
              <FaSearch className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border-2 border-transparent bg-slate-100 py-2 ps-11 pe-4 text-sm transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-md focus:shadow-indigo-200 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Icons (logged in) */}
            {isLoggedIn && (
              <>
                <button
                  type="button"
                  aria-label="Search"
                  className={`${iconButtonClass} lg:hidden`}
                >
                  <FaSearch className="size-4" />
                </button>

                <button type="button" aria-label="Reels" className={iconButtonClass}>
                  <BiSolidVideos className="size-5" />
                </button>

                <button type="button" aria-label="Messages" className={iconButtonClass}>
                  <MdMessage className="size-5" />
                  <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                    3
                  </span>
                </button>

                <button type="button" aria-label="Notifications" className={iconButtonClass}>
                  <FaBell className="size-4" />
                  <span className="absolute -end-0.5 -top-0.5 flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex size-3 rounded-full bg-red-500 ring-2 ring-white" />
                  </span>
                </button>

                <Link
                  to="/profile"
                  aria-label="Profile"
                  className="shrink-0 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
                >
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name ?? "Profile"}
                      className="size-9 sm:size-10 rounded-full border-2 border-indigo-600 object-cover"
                    />
                  ) : (
                    <FaUserCircle className="size-9 sm:size-10 text-slate-400" />
                  )}
                </Link>
              </>
            )}

            {/* Desktop Menu (md and up) */}
            <div className="hidden md:flex items-center space-x-6 ms-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={desktopLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={desktopButtonClass}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className={desktopButtonClass}>
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button (below md) */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none"
              >
                {isOpen ? <IoMdClose size={24} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className={mobileButtonClass}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={closeMenu} className={mobileButtonClass}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
