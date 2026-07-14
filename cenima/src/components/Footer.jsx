import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top border-top">
        <div className="container footer-links" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1.2fr', gap: '30px', padding: '40px 0' }}>
          <div className="footer-col">
            <h3>CGV Việt Nam</h3>
            <ul>
              <li><a href="#">Giới Thiệu</a></li>
              <li><a href="#">Tiện Ích Online</a></li>
              <li><a href="#">Thẻ Quà Tặng</a></li>
              <li><a href="#">Tuyển Dụng</a></li>
              <li><a href="#">Liên Hệ Quảng Cáo CGV</a></li>
              <li><a href="#">Dành cho đối tác</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Điều khoản sử dụng</h3>
            <ul>
              <li><a href="#">Điều Khoản Chung</a></li>
              <li><a href="#">Điều Khoản Giao Dịch</a></li>
              <li><a href="#">Chính Sách Thanh Toán</a></li>
              <li><a href="#">Chính Sách Bảo Mật</a></li>
              <li><a href="#">Những Quy Định Tại Rạp Phim</a></li>
              <li><a href="#">Câu Hỏi Thường Gặp</a></li>
            </ul>
          </div>
          
          <div className="footer-col text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Kết nối với chúng tôi</h3>
            <div className="social-icons" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
               <div className="icon-box fb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#3b5998', color: 'white', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>f</div>
               <div className="icon-box yt" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#ff0000', color: 'white', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>yt</div>
               <div className="icon-box ig" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)', color: 'white', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>ig</div>
               <div className="icon-box zl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#0068ff', color: 'white', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>zl</div>
            </div>
            <a href="http://online.gov.vn/Home/WebDetails/19114" target="_blank" rel="noopener noreferrer">
              <img src="https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/dathongbao.png" alt="Bộ Công Thương" style={{ height: '36px', display: 'block' }} />
            </a>
          </div>
          
          <div className="footer-col" style={{ textAlign: 'left' }}>
            <h3>Chăm sóc khách hàng</h3>
            <p style={{ marginBottom: '8px', fontWeight: '500' }}>Hotline: 1900 6017</p>
            <p style={{ marginBottom: '8px', color: '#666', fontSize: '13px' }}>Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ Tết)</p>
            <p style={{ color: '#666', fontSize: '13px' }}>Email hỗ trợ: hoidap@cgv.vn</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom border-top">
        <div className="container footer-info" style={{ display: 'flex', alignItems: 'center', gap: '40px', padding: '30px 0' }}>
          <div className="footer-logo">
             <img src="https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/brand-logo-gray.png" alt="CJ CGV" style={{ height: '50px', opacity: 0.7 }} />
          </div>
          <div className="company-info" style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#333' }}>CÔNG TY TNHH CJ CGV VIỆT NAM</h4>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Giấy Chứng nhận đăng ký doanh nghiệp: 0303675393 đăng ký lần đầu ngày 31/7/2008, được cấp bởi Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh.</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Địa chỉ: Lầu 2, số 7/28, đường Thành Thái, phường Diễn Hồng, Thành phố Hồ Chí Minh, Việt Nam.</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Đường dây nóng (Hotline): 1900 6017</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>COPYRIGHT 2017 CJ CGV VIETNAM CO., LTD. ALL RIGHTS RESERVED</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
