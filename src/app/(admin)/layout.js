// src/app/(admin)/layout.js
import AdminSidebar from '@/components/Admin/AdminSidebar/AdminSidebar';
import styles from './admin-layout.module.css';

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.adminContent}>
        {children}
      </main>
    </div>
  );
}