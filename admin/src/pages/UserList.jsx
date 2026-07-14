import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Search, ChevronLeft, ChevronRight, Eye, Users, UserCheck, UserX, UserPlus, Edit } from 'lucide-react';
import userApi from '../api/userApi';
import '../styles/Movies.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab & search
  const [activeTab, setActiveTab] = useState('CUSTOMER'); // 'CUSTOMER' or 'STAFF'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1) {
      alert('Không thể xóa tài khoản admin duy nhất của hệ thống!');
      return;
    }
    
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${user?.fullName || ''} không? Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      const response = await userApi.deleteUser(id);
      if (response && response.success === false) {
          alert(response.message || 'Xóa thất bại');
          return;
      }
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('Xóa thành công!');

      // Adjust page if empty
      const filtered = displayUsers.filter(u => u.id !== id && (
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone || '').includes(searchTerm)
      ));
      if (filtered.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
        setCurrentPage(prev => Math.max(1, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa. Vui lòng kiểm tra console.');
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.role === 'ADMIN' && user.active !== false) {
      // Prevent disabling admin if they are active and it's the last admin
      const adminCount = users.filter(u => u.role === 'ADMIN' && u.active !== false).length;
      if (adminCount <= 1) {
        alert('Không thể khóa tài khoản admin duy nhất đang hoạt động!');
        return;
      }
    }
    const nextActive = user.active === false ? true : false;
    try {
      await userApi.toggleStatus(user.id, nextActive);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: nextActive } : u));
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Có lỗi xảy ra khi đổi trạng thái tài khoản.');
    }
  };

  // Grouped users lists
  const customerUsers = users.filter(u => u.role === 'CUSTOMER');
  const staffUsers = users.filter(u => u.role === 'STAFF' || u.role === 'ADMIN');

  // Stats calculation depending on active tab
  const totalCount = activeTab === 'CUSTOMER' ? customerUsers.length : staffUsers.length;
  const activeCount = activeTab === 'CUSTOMER' 
    ? customerUsers.filter(u => u.active !== false).length 
    : staffUsers.filter(u => u.active !== false).length;
  const lockedCount = activeTab === 'CUSTOMER' 
    ? customerUsers.filter(u => u.active === false).length 
    : staffUsers.filter(u => u.active === false).length;

  const displayUsers = activeTab === 'CUSTOMER' ? customerUsers : staffUsers;

  const filteredUsers = displayUsers.filter(u => 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone || '').includes(searchTerm)
  );
  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleLabel = (role) => {
    if (role === 'ADMIN') return 'Quản trị';
    if (role === 'STAFF') return 'Nhân viên';
    return 'Khách hàng';
  };

  return (
    <div className="movies-page">
      {/* Stats Cards */}
      <div className="user-stats-container">
        <div className="user-stat-card">
          <div className="user-stat-info">
            <span className="user-stat-label">Tổng {activeTab === 'CUSTOMER' ? 'Khách Hàng' : 'Nhân Viên'}</span>
            <span className="user-stat-value">{totalCount}</span>
          </div>
          <div className="user-stat-icon-wrapper total">
            <Users size={24} />
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-info">
            <span className="user-stat-label">Đang Hoạt Động</span>
            <span className="user-stat-value">{activeCount}</span>
          </div>
          <div className="user-stat-icon-wrapper active">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-info">
            <span className="user-stat-label">Đã Khóa</span>
            <span className="user-stat-value">{lockedCount}</span>
          </div>
          <div className="user-stat-icon-wrapper locked">
            <UserX size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-pill-row" style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
        <button 
          className={`tab-pill ${activeTab === 'CUSTOMER' ? 'active' : ''}`}
          onClick={() => { setActiveTab('CUSTOMER'); setCurrentPage(1); setSearchTerm(''); }}
          style={{
            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: activeTab === 'CUSTOMER' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'CUSTOMER' ? 'white' : 'var(--text-muted)', transition: '0.2s'
          }}
        >
          Khách Hàng
        </button>
        <button 
          className={`tab-pill ${activeTab === 'STAFF' ? 'active' : ''}`}
          onClick={() => { setActiveTab('STAFF'); setCurrentPage(1); setSearchTerm(''); }}
          style={{
            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: activeTab === 'STAFF' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'STAFF' ? 'white' : 'var(--text-muted)', transition: '0.2s'
          }}
        >
          Nhân Viên & Admin
        </button>
      </div>

      <div className="filter-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h2 style={{ margin: 0, color: 'inherit' }}>Quản lý {activeTab === 'CUSTOMER' ? 'Khách Hàng' : 'Nhân Viên'}</h2>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {activeTab === 'STAFF' && (
            <Link
              to="/users/create-staff"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: '8px', border: 'none',
                background: 'var(--primary-color)', color: 'white',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', transition: '0.2s'
              }}
            >
              <UserPlus size={16} /> Thêm Nhân Viên
            </Link>
          )}

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo email, họ tên..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)', color: 'inherit', outline: 'none', width: '250px'
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'inherit' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="glass-panel" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'inherit', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '15px' }}>ID</th>
                  <th style={{ padding: '15px' }}>Họ Và Tên</th>
                  <th style={{ padding: '15px' }}>Email</th>
                  <th style={{ padding: '15px' }}>Số Điện Thoại</th>
                  {activeTab === 'STAFF' && <th style={{ padding: '15px' }}>Vai Trò</th>}
                  <th style={{ padding: '15px' }}>Trạng Trái</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px' }}>#{user.id}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '13px', fontWeight: 'bold', color: 'white',
                          background: user.role === 'ADMIN' ? '#ef4444' : user.role === 'STAFF' ? '#f59e0b' : '#3b82f6'
                        }}>
                          {getAvatarInitials(user.fullName)}
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{user.fullName}</div>
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>{user.email}</td>
                    <td style={{ padding: '15px' }}>{user.phone || 'N/A'}</td>
                    {activeTab === 'STAFF' && (
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '12px', fontSize: '12.5px', fontWeight: 'bold',
                          background: user.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: user.role === 'ADMIN' ? '#f87171' : '#fbbf24'
                        }}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                    )}
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '44px',
                          height: '22px',
                          cursor: 'pointer'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={user.active !== false} 
                            onChange={() => handleToggleStatus(user)}
                            style={{ opacity: 0, width: 0, height: 0 }} 
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: user.active !== false ? 'rgba(16, 185, 129, 0.8)' : 'rgba(156, 163, 175, 0.3)',
                            transition: '0.3s',
                            borderRadius: '22px',
                            border: '1px solid var(--border-color)'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '16px',
                              width: '16px',
                              left: '2px',
                              bottom: '2px',
                              backgroundColor: '#ffffff',
                              transition: '0.3s',
                              borderRadius: '50%',
                              transform: user.active !== false ? 'translateX(22px)' : 'translateX(0)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                          </span>
                        </label>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          color: user.active !== false ? '#10b981' : 'var(--text-muted)',
                          minWidth: '65px',
                          textAlign: 'left'
                        }}>
                          {user.active !== false ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      {activeTab === 'STAFF' && (
                        <Link 
                          to={`/users/edit-staff/${user.id}`}
                          style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: '5px', marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}
                          title="Sửa thông tin nhân viên"
                        >
                          <Edit size={18} />
                        </Link>
                      )}
                      <Link 
                        to={`/users/${user.id}`}
                        style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '5px', marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}
                        title="Xem chi tiết & lịch sử"
                      >
                        <Eye size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                        title="Xóa tài khoản"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'STAFF' ? '7' : '6'} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Không tìm thấy dữ liệu phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)', color: 'inherit', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={16} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', color: 'inherit', gap: '10px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === page ? '#ffffff' : 'rgba(255,255,255,0.1)', color: currentPage === page ? '#000000' : 'white', border: 'none', cursor: 'pointer', fontWeight: currentPage === page ? 'bold' : 'normal' }}>
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)', color: 'inherit', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
