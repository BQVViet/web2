import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const invoiceId = searchParams.get('invoiceId');
  const method = searchParams.get('method');

  useEffect(() => {
    if (invoiceId) {
      const checkPaymentStatus = async () => {
        try {
          const response = await axiosClient.get(`/invoices/check-payment-status/${invoiceId}`);
          setInvoiceData(response);
          setLoading(false);
        } catch (error) {
          console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
          setLoading(false);
        }
      };

      // Check immediately and then poll every 2 seconds for 30 seconds
      checkPaymentStatus();
      const interval = setInterval(checkPaymentStatus, 2000);
      setTimeout(() => clearInterval(interval), 30000);
    }
  }, [invoiceId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>⏳ Đang kiểm tra trạng thái thanh toán...</h2>
        <p>Vui lòng chờ trong giây lát</p>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>❌ Không tìm thấy đơn hàng</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', marginTop: '20px' }}>
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const isSuccess = invoiceData.paymentStatus === 'SUCCESS';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '50px 20px' }}>
      <div style={{
        textAlign: 'center',
        padding: '30px',
        border: isSuccess ? '2px solid #27ae60' : '2px solid #e74c3c',
        borderRadius: '8px',
        backgroundColor: isSuccess ? '#d5f4e6' : '#fadbd8'
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
          {isSuccess ? '✅' : '❌'}
        </h1>
        <h2 style={{ margin: '0 0 10px 0', color: isSuccess ? '#27ae60' : '#c0392b' }}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h2>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          Phương thức: <strong>{invoiceData.paymentMethod}</strong>
        </p>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          Số tiền: <strong>{invoiceData.totalAmount?.toLocaleString('vi-VN')} ₫</strong>
        </p>
        <p style={{ fontSize: '14px', margin: '10px 0', color: '#666' }}>
          Mã đơn hàng: #{invoiceData.id}
        </p>
        <p style={{ fontSize: '14px', margin: '20px 0 0 0', color: '#666' }}>
          Ngày: {new Date(invoiceData.createdDate).toLocaleString('vi-VN')}
        </p>

        {isSuccess && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '14px' }}>
              📧 Email xác nhận đã được gửi đến email của bạn
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
              🎫 Vé của bạn sẵn sàng trong tài khoản
            </p>
          </div>
        )}

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🏠 Trang chủ
          </button>
          <button
            onClick={() => navigate('/my-tickets')}
            style={{
              padding: '12px 30px',
              backgroundColor: isSuccess ? '#27ae60' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              opacity: isSuccess ? 1 : 0.5,
              pointerEvents: isSuccess ? 'auto' : 'none'
            }}
          >
            🎫 Vé của tôi
          </button>
        </div>
      </div>
    </div>
  );
}
