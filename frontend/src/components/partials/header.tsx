import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthContext from "../../contexts/AuthContext.tsx";
import "../../styles/header.css";
import { ChevronDown } from "lucide-react";
import { ThemeContext } from "../../contexts/ThemeContext.tsx";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Header = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const { toggleTheme, mode } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setAuthUser(storedUser);
    }
    setLoading(false);
  }, [setAuthUser]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuthUser(null);
    setMenuOpen(false);
    navigate("/home");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/home">
            <img src="http://localhost:3001/images/logo1.jpg" alt="Logo" />
          </a>
        </div>

        <nav className="nav-links">
          <a href="/home">Home</a>
          <a href="/courses">Courses</a>
          <a href="/enrollments">Enrollments</a>
          <a href="/add course">Add Course</a>
          <a href="/Translate">Translate</a>
          <a href="/contact">Contact</a>
          <a href="/AI">AI</a>
        </nav>

        <div className="header-actions">
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <button className="icon-button">
            <img src="http://localhost:3001/images/cart.jpeg" alt="Cart" />
          </button>

          {!loading &&
            (!authUser ? (
              <>
                <button
                  className="btn black"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="btn black"
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </button>
              </>
            ) : (
              <>
                <Button
                  ref={anchorRef}
                  onClick={handleMenuToggle}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-sm font-normal text-gray-700 hover:bg-gray-100 transition"
                >
                  <span className="normal-case">{authUser.username}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
                <Popper
                  open={menuOpen}
                  anchorEl={anchorRef.current}
                  transition
                  disablePortal
                >
                  {({ TransitionProps }) => (
                    <Grow
                      {...TransitionProps}
                      style={{ transformOrigin: "center top" }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleMenuClose}>
                          <MenuList autoFocusItem>
                            <MenuItem onClick={() => navigate("/account")}>
                              <ListItemIcon>
                                <AccountCircleIcon fontSize="small" />
                              </ListItemIcon>
                              My Account
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                              <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                              </ListItemIcon>
                              Logout
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            ))}

          <button className="hamburger-menu" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <nav className="sidebar-links">
          <a href="/home">Home</a>
          <a href="/courses">Courses</a>
          <a href="/enrollments">Enrollments</a>
          <a href="/account">My account</a>
          <a href="/contact">Contact Us</a>
          <a href="/logout">Log Out</a>
        </nav>
      </div>

      <div
        className={`backdrop ${isSidebarOpen ? "visible" : ""}`}
        onClick={toggleSidebar}
      ></div>
    </header>
  );
};

export default Header;
