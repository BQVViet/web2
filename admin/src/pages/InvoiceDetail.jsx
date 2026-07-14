import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, AlertCircle, Ticket, Popcorn, User, CreditCard } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoiceDetail();
  }, [id]);

  const fetchInvoiceDetail = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get(`/invoices/${id}`);
      setInvoice(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoice detail:', err);
      setError('Không thể tải chi tiết hóa đơn. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content', padding: '6px 12px', borderRadius: '999px', fontWeight: 'bold' }}><CheckCircle size={14}/> Thành công</span>;
      case 'PENDING':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content', padding: '6px 12px', borderRadius: '999px', fontWeight: 'bold' }}><Clock size={14}/> Chờ xử lý</span>;
      case 'FAILED':
      case 'CANCELLED':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content', padding: '6px 12px', borderRadius: '999px', fontWeight: 'bold' }}><XCircle size={14}/> Thất bại</span>;
      default:
        return <span className="status-badge" style={{ backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content', padding: '6px 12px', borderRadius: '999px', fontWeight: 'bold' }}><AlertCircle size={14}/> {status || 'Không rõ'}</span>;
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

  if (loading) {
    return (
      <div className="movies-page">
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Đang tải thông tin chi tiết hóa đơn...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="movies-page">
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: '#EF4444' }}>
          {error || 'Không tìm thấy thông tin hóa đơn.'}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => navigate('/invoices')}
              style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      {/* Receipt and Print Styles */}
      <style>{`
        .receipt-card {
          max-width: 420px;
          margin: 0 auto;
          background: #fffdf9;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          font-family: 'Courier New', Courier, monospace, sans-serif;
          color: #1e293b;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 16px;
        }
        .receipt-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #e71a0f;
        }
        .receipt-header p {
          margin: 4px 0;
          font-size: 11px;
          color: #64748b;
        }
        .divider-dashed {
          border-top: 1px dashed #cbd5e1;
          margin: 16px 0;
        }
        .receipt-title {
          text-align: center;
          margin: 10px 0;
        }
        .receipt-title h3 {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
        }
        .receipt-title p {
          margin: 2px 0;
          font-size: 11px;
          color: #64748b;
        }
        .receipt-info {
          font-size: 13px;
          line-height: 1.6;
        }
        .receipt-info div {
          display: flex;
          justify-content: space-between;
        }
        .receipt-movie {
          font-size: 13px;
        }
        .receipt-movie .movie-title {
          font-size: 18px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 16px;
          line-height: 1.4;
          color: #0f172a;
        }
        .receipt-movie .movie-details {
          line-height: 1.7;
        }
        .receipt-movie .movie-details div {
          display: flex;
          justify-content: space-between;
        }
        .highlight-seats {
          font-size: 16px;
          color: #e71a0f;
          font-weight: bold;
        }
        .receipt-section-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 10px;
          letter-spacing: 1px;
          color: #0f172a;
        }
        .receipt-foods {
          font-size: 13px;
          line-height: 1.6;
        }
        .food-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .food-qty {
          font-weight: bold;
        }
        .receipt-summary {
          font-size: 14px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        .summary-row.sub {
          font-weight: normal;
          font-size: 12px;
          margin-top: 4px;
          color: #64748b;
        }
        .total-amount {
          font-size: 22px;
          color: #e71a0f;
          font-weight: bold;
        }
        .receipt-qrcode {
          text-align: center;
          margin: 20px 0 10px 0;
        }
        .receipt-qrcode img {
          width: 140px;
          height: 140px;
          display: inline-block;
          border: 1px solid #e2e8f0;
          padding: 6px;
          background: white;
          border-radius: 8px;
        }
        .qr-text {
          margin: 8px 0 2px 0;
          font-size: 12px;
          font-weight: bold;
          color: #0f172a;
        }
        .qr-hint {
          margin: 0;
          font-size: 10px;
          color: #94a3b8;
          line-height: 1.3;
        }
        .receipt-footer {
          text-align: center;
          font-size: 11px;
          color: #64748b;
          margin-top: 16px;
          line-height: 1.4;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-card, .receipt-card * {
            visibility: visible;
          }
          .receipt-card {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 380px !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Header Control (no-print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> Quay lại
            </button>
            <div>
              <h2 style={{ margin: 0 }}>Xem Hóa Đơn #{invoice.id}</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>Xem trước vé nhiệt và in hóa đơn tại quầy cho khách hàng</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              background: '#10B981', 
              color: 'white', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
            }}
          >
            🖨️ In Vé & Hóa Đơn
          </button>
        </div>

        {/* Real Thermal Receipt Card */}
        <div className="receipt-card">
          <div className="receipt-header">
            <h2>CGV CINEMAS</h2>
            <p>CJ CGV VIETNAM CO., LTD</p>
            <p>Chi nhánh: {invoice.tickets && invoice.tickets[0]?.cinemaName || 'CGV Cinema'}</p>
            <p>ĐT: 1900 6017 | cgv.vn</p>
          </div>
          
          <div className="divider-dashed"></div>
          
          <div className="receipt-title">
            <h3>PHIẾU THANH TOÁN VÉ</h3>
            <p>TICKET RECEIPT</p>
          </div>
          
          <div className="receipt-info">
            <div><span>Mã hóa đơn / Inv No:</span> <strong>#TKT{invoice.id}</strong></div>
            <div><span>Thời gian / Date:</span> <span>{formatDate(invoice.createdDate)}</span></div>
            <div><span>Khách hàng / Cust:</span> <span>{invoice.customerName}</span></div>
            <div><span>Email:</span> <span>{invoice.customerEmail}</span></div>
          </div>
          
          <div className="divider-dashed"></div>
          
          <div className="receipt-movie">
            <div className="movie-title">
              {invoice.tickets && invoice.tickets[0]?.movieTitle ? invoice.tickets[0].movieTitle.toUpperCase() : 'VÉ XEM PHIM'}
            </div>
            <div className="movie-details">
              <div><span>Rạp / Cinema:</span> <strong>{invoice.tickets && invoice.tickets[0]?.cinemaName || 'CGV'}</strong></div>
              <div><span>Phòng / Room:</span> <strong>{invoice.tickets && invoice.tickets[0]?.roomName || 'Room'}</strong></div>
              <div><span>Suất / Showtime:</span> <strong>{invoice.tickets && invoice.tickets[0]?.showTime ? formatDate(invoice.tickets[0].showTime) : ''}</strong></div>
              <div>
                <span>Ghế / Seats:</span> 
                <strong className="highlight-seats">
                  {invoice.tickets ? invoice.tickets.map(t => t.seatName).join(', ') : ''}
                </strong>
              </div>
              <div>
                <span>Giá vé / Ticket Price:</span> 
                <span>
                  {formatCurrency(invoice.tickets ? invoice.tickets.reduce((acc, t) => acc + t.price, 0) : 0)}
                </span>
              </div>
            </div>
          </div>
          
          {invoice.foods && invoice.foods.length > 0 && (
            <>
              <div className="divider-dashed"></div>
              <div className="receipt-section-title">BẮP NƯỚC / COMBO</div>
              <div className="receipt-foods">
                {invoice.foods.map((f, idx) => (
                  <div key={idx} className="food-item">
                    <div className="food-name">
                      {f.name} {f.flavor && `(${f.flavor})`}
                      <span className="food-qty"> x{f.quantity}</span>
                    </div>
                    <div className="food-price">{formatCurrency(f.price * f.quantity)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="divider-dashed"></div>
          
          <div className="receipt-summary">
            <div className="summary-row">
              <span>TỔNG CỘNG / TOTAL:</span>
              <span className="total-amount">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="summary-row sub">
              <span>Thanh toán / Method:</span>
              <span>{invoice.paymentMethod || 'Tại quầy'}</span>
            </div>
            <div className="summary-row sub">
              <span>Trạng thái / Status:</span>
              <strong>{invoice.paymentStatus === 'SUCCESS' || invoice.paymentStatus === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}</strong>
            </div>
          </div>
          
          <div className="divider-dashed"></div>
          
          <div className="receipt-qrcode">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT${invoice.id}`} alt="QR Code" />
            <p className="qr-text">MÃ VÉ: #TKT{invoice.id}</p>
            <p className="qr-hint">Vui lòng quét mã QR này tại quầy bán vé hoặc lối vào phòng chiếu</p>
          </div>
          
          <div className="divider-dashed"></div>
          
          <div className="receipt-footer">
            <p>Chúc quý khách xem phim vui vẻ!</p>
            <p>ENJOY YOUR MOVIE!</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetail;
