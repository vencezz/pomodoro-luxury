import React from 'react';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {children}
      </div>
      
      {/* Background decorative elements */}
      <div className={styles.backgroundDecorations}>
        <div className={styles.decoration1}></div>
        <div className={styles.decoration2}></div>
        <div className={styles.decoration3}></div>
      </div>
    </div>
  );
};

export default Layout;
