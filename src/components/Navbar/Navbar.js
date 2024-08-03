import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { UseAuthValue } from "../../contexts/authContext";
import styles from "./Navbar.module.css";

// Importing icons
import homeIcon from '../../assets/icons/home.png';
import ordersIcon from '../../assets/icons/orders.png';
import cartIcon from '../../assets/icons/cart.png';
import signInIcon from '../../assets/icons/signin.png';
import signOutIcon from '../../assets/icons/logout.png';

export default function Navbar() {
  // User's login status
  const { isLoggedIn, SignOut } = UseAuthValue();

  return (
    <>
      {/* main container */}
      <nav className={styles.nav}>
        <div className={styles.navleft}>
          <NavLink to="/" className={styles.logo}>
            Busy Buy
          </NavLink>
        </div>
        <div className={styles.navright}>
          <NavLink to="/" className={styles.navLink}>
            <img src={homeIcon} alt="Home" className={styles.navIcon} />
            <span className={styles.navText}>Home</span>
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/myorder" className={styles.navLink}>
              <img src={ordersIcon} alt="My Orders" className={styles.navIcon} />
              <span className={styles.navText}>My Orders</span>
            </NavLink>
          )}

          {isLoggedIn && (
            <NavLink to="/cart" className={styles.navLink}>
              <img src={cartIcon} alt="Cart" className={styles.navIcon} />
              <span className={styles.navText}>Cart</span>
            </NavLink>
          )}

          {!isLoggedIn ? (
            <NavLink to="/signin" className={styles.navLink}>
              <img src={signInIcon} alt="Sign In" className={styles.navIcon} />
              <span className={styles.navText}>Sign In</span>
            </NavLink>
          ) : (
            <NavLink to="/" className={styles.navLink}>
              <img src={signOutIcon} alt="Sign Out" className={styles.navIcon} />
              <span className={styles.navText} onClick={SignOut}>Sign Out</span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* render child pages */}
      <Outlet />
    </>
  );
}
