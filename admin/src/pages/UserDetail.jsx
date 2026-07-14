import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Lock, Mail, Phone, ShieldCheck, Trash2, Unlock, UserCircle2, X, FileText, CreditCard, Ticket, Popcorn, User as UserIcon } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import userApi from '../api/userApi';

const getRoleLabel = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'STAFF':
      return 'Nhân viên';
    default:
      return 'Khách hàng';
  }
};

const getStatusLabel = (active) => (active !== false ? 'Hoạt động' : 'Đã khóa');

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userApi.getById(id);
      setUser(data);

      try {
        const invoicesData = await axiosClient.get('/invoices');
        const userInvoices = invoicesData.filter(
          (inv) => inv.customerEmail && inv.customerEmail.toLowerCase() === data.email.toLowerCase()
        );
        setInvoices(userInvoices);
      } catch (err) {
        console.error('Lỗi khi tải danh sách hóa đơn:', err);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      alert('Không thể tải thông tin người dùng.');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (invoiceId) => {
    try {
      setLoadingDetail(true);
      setIsModalOpen(true);
      const data = await axiosClient.get(`/invoices/${invoiceId}`);
      setSelectedInvoice(data);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', err);
      alert('Không thể tải chi tiết hóa đơn!');
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 300);
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '0 ₫';
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleUpdateRole = async (event) => {
    const newRole = event.target.value;
    try {
      setSaving(true);
      await userApi.updateRole(id, newRole);
      setUser((prev) => prev ? { ...prev, role: newRole } : prev);
      alert('Cập nhật vai trò thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = user?.active !== false;
    if (!window.confirm(`Bạn có chắc chắn muốn ${nextStatus ? 'khóa' : 'mở khóa'} tài khoản này không?`)) {
      return;
    }

    try {
      setSaving(true);
      await userApi.toggleStatus(id, !nextStatus);
      setUser((prev) => prev ? { ...prev, active: !nextStatus } : prev);
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await userApi.deleteUser(id);
      if (response?.success === false) {
        alert(response.message || 'Không thể xóa người dùng.');
        return;
      }
      alert('Xóa người dùng thành công!');
      navigate('/users');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="movies-page">
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          Đang tải thông tin người dùng...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="movies-page">
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/users')}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} /> Quay lại
            </button>
            <div>
              <h2 style={{ margin: 0 }}>Thông tin người dùng</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>Xem và quản lý tài khoản của người dùng này</p>
            </div>
          </div>
          <Link to="/users" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Về danh sách
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', marginTop: '24px' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCircle2 size={36} color="#60a5fa" />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{user.fullName || 'Không rõ'}</h3>
                <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#60a5fa" />
                <span>{user.email || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#60a5fa" />
                <span>{user.phone || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={16} color="#60a5fa" />
                <span>Vai trò: {getRoleLabel(user.role)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarDays size={16} color="#60a5fa" />
                <span>Ngày tham gia: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}</span>
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>Trạng thái tài khoản</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ padding: '6px 12px', borderRadius: '999px', background: user.active !== false ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: user.active !== false ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                  {getStatusLabel(user.active)}
                </span>
                <button onClick={handleToggleStatus} disabled={saving} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {user.active !== false ? <><Lock size={14} /> Khóa</> : <><Unlock size={14} /> Mở khóa</>}
                </button>
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>Thay đổi vai trò</div>
              <select value={user.role || 'CUSTOMER'} onChange={handleUpdateRole} disabled={saving} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }}>
                <option value="CUSTOMER">Khách hàng</option>
                <option value="STAFF">Nhân viên</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button onClick={handleDelete} disabled={saving} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.12)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Trash2 size={16} /> Xóa tài khoản
              </button>
            </div>
          </div>
        </div>

        {/* Lịch sử mua hàng */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', background: 'rgba(255,255,255,0.03)', marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={20} color="var(--primary-color)" /> Lịch sử mua vé ({invoices.length} đơn hàng)
          </h3>
          {invoices.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'inherit' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px' }}>Mã đơn</th>
                    <th style={{ padding: '12px' }}>Ngày đặt</th>
                    <th style={{ padding: '12px' }}>Tổng tiền</th>
                    <th style={{ padding: '12px' }}>Thanh toán</th>
                    <th style={{ padding: '12px' }}>Trạng thái</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>#{inv.id}</td>
                      <td style={{ padding: '12px' }}>{formatDate(inv.createdDate)}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{formatCurrency(inv.totalAmount)}</td>
                      <td style={{ padding: '12px' }}>{inv.paymentMethod || 'Tại quầy'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                          backgroundColor: inv.paymentStatus === 'SUCCESS' || inv.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : inv.paymentStatus === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: inv.paymentStatus === 'SUCCESS' || inv.paymentStatus === 'PAID' ? '#10b981' : inv.paymentStatus === 'PENDING' ? '#f59e0b' : '#ef4444'
                        }}>
                          {inv.paymentStatus === 'SUCCESS' || inv.paymentStatus === 'PAID' ? 'Thành công' : inv.paymentStatus === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleViewDetail(inv.id)}
                          style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
              Người dùng này chưa mua đơn hàng nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
