import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, CheckCircle, Clock, XCircle, AlertCircle, Eye, X, Ticket, Popcorn, User, CreditCard } from 'lucide-react';
import '../styles/Movies.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/invoices');
      setInvoices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      setLoadingDetail(true);
      setIsModalOpen(true); // Open modal immediately showing loading state
      const response = await axios.get(`/api/invoices/${id}`);
      setSelectedInvoice(response.data);
      setLoadingDetail(false);
    } catch (err) {
      console.error('Error fetching invoice detail:', err);
      alert('Không thể tải chi tiết hóa đơn!');
      setLoadingDetail(false);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 300); // Wait for transition
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><CheckCircle size={14}/> Thành công</span>;
      case 'PENDING':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><Clock size={14}/> Chờ xử lý</span>;
      case 'FAILED':
      case 'CANCELLED':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><XCircle size={14}/> Thất bại</span>;
      default:
        return <span className="status-badge" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><AlertCircle size={14}/> {status || 'Không rõ'}</span>;
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

  return (
    <div className="movies-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Đơn vé</h1>
          <p className="page-subtitle">Xem danh sách hóa đơn và lịch sử đặt vé của khách hàng</p>
        </div>
      </div>

      <div className="filters-bar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã đơn, tên hoặc email khách hàng..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <FileText size={48} style={{ opacity: 0.2 }} />
                    <p>Không tìm thấy hóa đơn nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
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
                    <button 
                      onClick={() => handleViewDetail(invoice.id)}
                      className="icon-btn action-btn" 
                      title="Xem chi tiết"
                      style={{ padding: '8px', background: 'var(--bg-surface-hover)', borderRadius: '8px', color: 'var(--primary-color)', border: 'none', cursor: 'pointer' }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Chi Tiết Hóa Đơn */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-panel" style={{
            width: '90%', maxWidth: '800px',
            maxHeight: '90vh', overflowY: 'auto',
            padding: '0',
            position: 'relative',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Header */}
            <div style={{ 
              padding: '20px 30px', 
              borderBottom: '1px solid var(--border-color)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 10
            }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={24} color="var(--primary-color)" />
                Chi Tiết Đơn Vé {selectedInvoice && `#${selectedInvoice.id}`}
              </h2>
              <button onClick={closeModal} style={{
                background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px'
              }}>
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '30px' }}>
              {loadingDetail ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                  Đang tải thông tin chi tiết...
                </div>
              ) : selectedInvoice ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Thông tin chung */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'var(--bg-surface-hover)', padding: '20px', borderRadius: '12px' }}>
                      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} /> Khách Hàng
                      </h3>
                      <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div><strong>Họ tên:</strong> {selectedInvoice.customerName}</div>
                        <div><strong>Email:</strong> {selectedInvoice.customerEmail}</div>
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--bg-surface-hover)', padding: '20px', borderRadius: '12px' }}>
                      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} /> Giao Dịch
                      </h3>
                      <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div><strong>Ngày đặt:</strong> {formatDate(selectedInvoice.createdDate)}</div>
                        <div><strong>Phương thức:</strong> {selectedInvoice.paymentMethod || 'Tại quầy'}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>Trạng thái:</strong> {getStatusBadge(selectedInvoice.paymentStatus)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin vé */}
                  {selectedInvoice.tickets && selectedInvoice.tickets.length > 0 && (
                    <div>
                      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <Ticket size={20} color="var(--primary-color)" /> Danh Sách Vé ({selectedInvoice.tickets.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedInvoice.tickets.map((t, idx) => (
                          <div key={idx} style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'var(--bg-surface-hover)', padding: '15px 20px', borderRadius: '8px'
                          }}>
                            <div>
                              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '16px', marginBottom: '4px' }}>
                                {t.movieTitle}
                              </div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                {t.cinemaName} • {t.roomName} • {formatDate(t.showTime)}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '18px' }}>
                                Ghế {t.seatName}
                              </div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                {formatCurrency(t.price)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Thông tin bắp nước */}
                  {selectedInvoice.foods && selectedInvoice.foods.length > 0 && (
                    <div>
                      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <Popcorn size={20} color="#F59E0B" /> Bắp Nước ({selectedInvoice.foods.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedInvoice.foods.map((f, idx) => (
                          <div key={idx} style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'var(--bg-surface-hover)', padding: '12px 20px', borderRadius: '8px'
                          }}>
                            <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                              {f.foodName}
                            </div>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                              <div style={{ color: 'var(--text-secondary)' }}>x{f.quantity}</div>
                              <div style={{ fontWeight: '600', color: 'var(--text-primary)', width: '90px', textAlign: 'right' }}>
                                {formatCurrency(f.price * f.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tổng kết */}
                  <div style={{ 
                    marginTop: '10px', paddingTop: '20px', borderTop: '2px dashed var(--border-color)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Tổng cộng thanh toán:</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      {formatCurrency(selectedInvoice.totalAmount)}
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#EF4444' }}>Đã xảy ra lỗi</div>
              )}
            </div>
            
            {/* Footer */}
            <div style={{ 
              padding: '20px 30px', 
              borderTop: '1px solid var(--border-color)',
              display: 'flex', justifyContent: 'flex-end',
              background: 'var(--bg-surface)'
            }}>
              <button onClick={closeModal} style={{
                padding: '10px 24px', background: 'var(--border-color)', color: 'inherit',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
