import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Search, FileText, CheckCircle, Clock, XCircle, AlertCircle, Eye, Ticket, Popcorn, User, CreditCard, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import '../styles/Movies.css';


const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/invoices');
      setInvoices(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = currentInvoices.map(inv => inv.id);
      setSelectedIds(prev => {
        const newIds = [...prev];
        pageIds.forEach(id => {
          if (!newIds.includes(id)) newIds.push(id);
        });
        return newIds;
      });
    } else {
      const pageIds = currentInvoices.map(inv => inv.id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} đơn vé đã chọn không? Thao tác này sẽ hủy tất cả vé liên quan.`)) {
      try {
        setLoading(true);
        await Promise.all(selectedIds.map(id => axiosClient.delete(`/invoices/${id}`)));
        alert(`Đã xóa thành công ${selectedIds.length} đơn vé.`);
        setSelectedIds([]);
        fetchInvoices();
      } catch (err) {
        console.error('Error batch deleting invoices:', err);
        alert('Có lỗi xảy ra khi xóa một số đơn vé. Vui lòng thử lại sau.');
        fetchInvoices();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/invoices/${id}`);
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn vé #${id} không? Thao tác này sẽ hủy tất cả vé liên quan.`)) {
      try {
        await axiosClient.delete(`/invoices/${id}`);
        alert(`Đã xóa đơn vé #${id} thành công.`);
        fetchInvoices();
      } catch (err) {
        console.error('Error deleting invoice:', err);
        alert(err.response?.data?.message || 'Không thể xóa đơn vé. Vui lòng thử lại sau.');
      }
    }
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><CheckCircle size={14} /> Thành công</span>;
      case 'PENDING':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><Clock size={14} /> Chờ xử lý</span>;
      case 'FAILED':
      case 'CANCELLED':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><XCircle size={14} /> Thất bại</span>;
      default:
        return <span className="status-badge" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><AlertCircle size={14} /> {status || 'Không rõ'}</span>;
    }
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

  const filteredInvoices = invoices.filter(invoice =>
    (invoice.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.id || '').toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-container">
      <div className="filters-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <div className="search-box" style={{ flex: 1, minWidth: '280px' }}>
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên hoặc email khách hàng..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
          >
            <Trash2 size={18} />
            Xóa {selectedIds.length} đơn đã chọn
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '12px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="table-container glass-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={currentInvoices.length > 0 && currentInvoices.every(inv => selectedIds.includes(inv.id))}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
              </th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <FileText size={48} style={{ opacity: 0.2 }} />
                    <p>Không tìm thấy hóa đơn nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentInvoices.map((invoice) => (
                <tr key={invoice.id} style={{ background: selectedIds.includes(invoice.id) ? 'rgba(239, 68, 68, 0.04)' : 'transparent' }}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(invoice.id)}
                      onChange={() => handleSelectRow(invoice.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    #{invoice.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {invoice.customerName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {invoice.customerEmail}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(invoice.createdDate)}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {invoice.paymentMethod || 'Tại quầy'}
                  </td>
                  <td>
                    {getStatusBadge(invoice.paymentStatus)}
                  </td>
                   <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleViewDetail(invoice.id)}
                        className="icon-btn action-btn"
                        title="Xem chi tiết"
                        style={{ padding: '8px', background: 'var(--bg-surface-hover)', borderRadius: '8px', color: 'var(--primary-color)', border: 'none', cursor: 'pointer' }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="icon-btn action-btn"
                        title="Xóa đơn vé"
                        style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#EF4444', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
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

    </div>
  );
};

export default InvoiceList;
