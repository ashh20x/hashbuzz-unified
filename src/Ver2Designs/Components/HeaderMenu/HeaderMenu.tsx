import { resetState } from "@/Store/miscellaneousStoreSlice";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import XPlatformIcon from "@/SVGR/XPlatformIcon";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import React, { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HederaIcon from "../../../SVGR/HederaIcon";
import { useLogoutMutation } from "../../Pages/AuthAndOnboard/api/auth";
import { styles } from "./styles";

// Separated style objects

const HeaderMenu = () => {
  const { currentUser } = useAppSelector(s => s.app);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const open = Boolean(anchorEl);

  // Memoized handlers for better performance
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleWalletIdCopy = useCallback(() => {
    navigator.clipboard.writeText(currentUser?.hedera_wallet_id ?? "");
    toast.info("Wallet ID copied to clipboard");
  }, [currentUser?.hedera_wallet_id]);

  const handleNavigateAdmin = useCallback(() => {
    navigate(pathname.includes("admin") ? "/" : "/admin");
  }, [navigate, pathname]);

  const handleLogout = useCallback(async () => {
    try {
      setAnchorEl(null); // Close menu immediately
      
      // Call logout API
      await logout().unwrap();
      
      // Clear Redux state
      dispatch(resetState());
      
      // Clear localStorage
      localStorage.removeItem('access_token_expiry');
      localStorage.removeItem('user');
      localStorage.removeItem('device_id');
      
      // Navigate to home
      navigate("/");
      
      // Show success message
      toast.info("Logout Successfully");
    } catch (err: any) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    }
  }, [logout, dispatch, navigate]);

  // Memoized computed values
  const isAdmin = useMemo(() => 
    currentUser?.role && ["ADMIN", "SUPER_ADMIN"].includes(currentUser.role),
    [currentUser?.role]
  );

  const adminButtonText = useMemo(() => 
    pathname.includes("admin") ? "User Dashboard" : "Admin Dashboard",
    [pathname]
  );

  const userAvatar = useMemo(() => 
    currentUser?.profile_image_url 
      ? <Avatar src={currentUser.profile_image_url} sx={styles.avatar} />
      : <Avatar sx={styles.avatar} />,
    [currentUser?.profile_image_url]
  );

  return (
    <Box sx={styles.container}>
      <Tooltip title="Account Options">
        <IconButton 
          onClick={handleClick} 
          size="small" 
          sx={styles.avatarButton}
          aria-controls={open ? "account-menu" : undefined} 
          aria-haspopup="true" 
          aria-expanded={open ? "true" : undefined}
        >
          {userAvatar}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={styles.menuPaper}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem 
          title="Click to copy wallet ID" 
          onClick={handleWalletIdCopy}
        >
          <Avatar sx={styles.menuItemAvatar}>
            <HederaIcon 
              size={styles.hederaIcon.size} 
              fill={styles.hederaIcon.fill} 
              fillBg={styles.hederaIcon.fillBg} 
            />
          </Avatar>
          {currentUser?.hedera_wallet_id ?? ""}
        </MenuItem>
        
        <MenuItem>
          <Avatar sx={styles.menuItemAvatar}>
            <XPlatformIcon size={15} />
          </Avatar>
          @{currentUser?.personal_twitter_handle}
        </MenuItem>
        
        <Divider />
        
        {isAdmin && (
          <MenuItem onClick={handleNavigateAdmin}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            {adminButtonText}
          </MenuItem>
        )}
        
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderMenu;
