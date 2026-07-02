import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top border-top">
        <div className="container footer-links">
          <div className="footer-col">
            <h3>CGV Việt Nam</h3>
            <ul>
              <li><a href="#">Giới Thiệu</a></li>
              <li><a href="#">Tiện Ích Online</a></li>
              <li><a href="#">Thẻ Quà Tặng</a></li>
              <li><a href="#">Tuyển Dụng</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Điều khoản sử dụng</h3>
            <ul>
              <li><a href="#">Điều Khoản Chung</a></li>
              <li><a href="#">Điều Khoản Giao Dịch</a></li>
              <li><a href="#">Chính Sách Thanh Toán</a></li>
              <li><a href="#">Chính Sách Bảo Mật</a></li>
            </ul>
          </div>
          <div className="footer-col text-center">
            <h3>Kết nối với chúng tôi</h3>
            <div className="social-icons">
               <div className="icon-box fb">f</div>
               <div className="icon-box yt">yt</div>
               <div className="icon-box ig">ig</div>
               <div className="icon-box zl">zl</div>
            </div>
          </div>
          <div className="footer-col">
            <h3>Chăm sóc khách hàng</h3>
            <p>Hotline: 1900 6017</p>
            <p>Giờ làm việc: 8:00 - 22:00</p>
            <p>Email hỗ trợ: hoidap@cgv.vn</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom border-top">
        <div className="container footer-info">
          <div className="footer-logo">
             <h2 className="footer-logo-text">CJ CGV</h2>
          </div>
          <div className="company-info">
            <h4>CÔNG TY TNHH CJ CGV VIỆT NAM</h4>
            <p>Giấy CNĐKDN: 0303675393, đăng ký lần đầu ngày 31/7/2008, cấp bởi Sở KHĐT TP.HCM.</p>
            <p>Địa chỉ: Lầu 2, số 7/28 Thành Thái, P.14, Q.10, TP.HCM.</p>
            <p>COPYRIGHT 2017 CJ CGV VIETNAM CO., LTD. ALL RIGHTS RESERVED</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
