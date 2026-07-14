import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Link, Image } from 'lucide-react';
import bannerApi from '../api/bannerApi';
import '../styles/Movies.css';

const BannerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerDetail();
  }, [id]);

  const fetchBannerDetail = async () => {
    try {
      setLoading(true);
      const data = await bannerApi.getById(id);
      setBanner(data);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết banner:", error);
      alert("Không thể tải thông tin chi tiết banner!");
      navigate('/banners');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ color: 'inherit', padding: '50px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (!banner) return <div style={{ color: 'inherit', padding: '50px', textAlign: 'center' }}>Không tìm thấy banner.</div>;

  return (
    <div className="movies-page">
      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button 
            onClick={() => navigate('/banners')} 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer' 
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Chi Tiết Banner</h2>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Banner Graphic Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)'
            }}>
              {banner.imageUrl ? (
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'rgba(0,0,0,0.5)' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '10px' }}>
                  <Image size={40} />
                  <span>Không có ảnh</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Metadata Panel */}
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', 
            border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' 
          }}>
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', color: 'var(--text-secondary)' }}>
                Thông tin chung
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tiêu đề</label>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{banner.title || 'Chưa đặt tiêu đề'}</div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Mã Banner (ID)</label>
                <div style={{ fontSize: '15px', fontFamily: 'monospace' }}>#{banner.id}</div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Đường dẫn Link đích (URL)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: banner.targetUrl ? '#3b82f6' : 'var(--text-muted)', wordBreak: 'break-all' }}>
                  <Link size={16} />
                  <a 
                    href={banner.targetUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: banner.targetUrl ? 'underline' : 'none' }}
                  >
                    {banner.targetUrl || 'Không có link'}
                  </a>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Trạng thái hiển thị</label>
                <div style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', borderRadius: '20px', background: banner.isActive !== false ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)', color: banner.isActive !== false ? '#10b981' : 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', border: '1px solid currentColor', marginTop: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', marginRight: '6px' }}></span>
                  {banner.isActive !== false ? 'Đang hoạt động (Hiện)' : 'Không hoạt động (Ẩn)'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={() => navigate(`/banners/edit/${banner.id}`)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Chỉnh sửa Banner
              </button>
              <button 
                onClick={() => navigate('/banners')}
                style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Quay lại
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BannerDetails;
