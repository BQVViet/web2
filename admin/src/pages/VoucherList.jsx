import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, X, Percent, CheckCircle, XCircle } from 'lucide-react';
import voucherApi from '../api/voucherApi';

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountAmount: '',
    active: true
  });
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await voucherApi.getAll();
      setVouchers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mã giảm giá ${code} không?`)) {
      try {
        await voucherApi.delete(id);
        setVouchers(vouchers.filter(v => v.id !== id));
        alert(`Đã xóa mã voucher ${code} thành công.`);
      } catch (error) {
        console.error("Lỗi khi xóa voucher:", error);
        alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa voucher.");
      }
    }
  };

  const handleToggleActive = async (voucher) => {
    try {
      const updated = { ...voucher, active: !voucher.active };
      await voucherApi.update(voucher.id, updated);
      setVouchers(vouchers.map(v => v.id === voucher.id ? updated : v));
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái voucher:", error);
      alert(error.response?.data?.message || "Không thể cập nhật trạng thái voucher.");
    }
  };

  const openCreateModal = () => {
    setFormData({ code: '', discountAmount: '', active: true });
    setModalError('');
    setIsEdit(false);
    setSelectedVoucherId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (voucher) => {
    setFormData({
      code: voucher.code || '',
      discountAmount: voucher.discountAmount ?? '',
      active: voucher.active !== false
    });
    setModalError('');
    setIsEdit(true);
    setSelectedVoucherId(voucher.id);
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setModalError('Vui lòng nhập mã voucher.');
      return;
    }
    const discount = Number(formData.discountAmount);
    if (isNaN(discount) || discount <= 0) {
      setModalError('Mức giảm giá phải là số dương lớn hơn 0.');
      return;
    }

    try {
      setModalError('');
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountAmount: discount,
        active: formData.active !== false
      };

      if (isEdit) {
        const response = await voucherApi.update(selectedVoucherId, payload);
        setVouchers(vouchers.map(v => v.id === selectedVoucherId ? response : v));
      } else {
        const response = await voucherApi.create(payload);
        setVouchers([response, ...vouchers]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu voucher:", error);
      setModalError(error.response?.data?.message || "Mã voucher này đã tồn tại hoặc không hợp lệ!");
    }
  };

  const filteredVouchers = vouchers.filter(v =>
    (v.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const currentVouchers = filteredVouchers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-primary)' }}>Quản lý Mã Giảm Giá (Vouchers)</h1>
        <button onClick={openCreateModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
          <Plus size={18} /> Thêm Mã Mới
        </button>
      </div>

      <div className="filters-bar glass-panel" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã voucher..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="table-container glass-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã Voucher</th>
              <th>Mức Giảm Giá</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentVouchers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Không tìm thấy mã giảm giá nào
                </td>
              </tr>
            ) : (
              currentVouchers.map((voucher) => (
                <tr key={voucher.id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>#{voucher.id}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                    <span style={{ background: 'rgba(239, 26, 15, 0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px dashed var(--primary-color)', color: 'var(--primary-color)' }}>
                      {voucher.code}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {voucher.discountAmount.toLocaleString('vi-VN')} ₫
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(voucher)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: 0
                      }}
                      title="Bấm để bật/tắt"
                    >
                      {voucher.active ? (
                        <span className="status-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Hoạt động
                        </span>
                      ) : (
                        <span className="status-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={14} /> Tắt
                        </span>
                      )}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => openEditModal(voucher)} 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
                      >
                        <Edit size={14} /> Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(voucher.id, voucher.code)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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

      {/* CREATE & EDIT MODAL popup */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-panel" style={{
            width: '450px',
            padding: '24px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 'bold' }}>
                {isEdit ? 'Chỉnh sửa mã Voucher' : 'Tạo mới mã Voucher'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '13.5px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Mã Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleModalChange}
                  required
                  placeholder="Ví dụ: CGV50K"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '14.5px',
                    textTransform: 'uppercase'
                  }}
                  disabled={isEdit}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Mức Giảm Giá (VNĐ) *</label>
                <input
                  type="number"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleModalChange}
                  required
                  min="1"
                  placeholder="Ví dụ: 50000"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '14.5px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Trạng thái</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleModalChange}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Cho phép áp dụng voucher này</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
                >
                  {isEdit ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherList;
