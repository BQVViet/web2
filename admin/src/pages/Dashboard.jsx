import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Film, Users, Ticket, Coffee, CalendarDays, Building2, PlaySquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from '../api/axiosClient';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeMovies: 0,
    totalUsers: 0,
    totalTickets: 0,
    revenueChart: [],
    topMovies: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/dashboard/overview');
      setStats(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Không thể tải dữ liệu tổng quan');
      setLoading(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '50px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: '#EF4444', padding: '50px', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>Tổng quan Hệ thống</h1>
        <div style={{ padding: '8px 16px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Hôm nay: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>
      
      {/* 4 Thẻ chỉ số */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Tổng Doanh Thu</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {(stats.totalRevenue || 0).toLocaleString()} ₫
            </div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: '#3B82F6' }}>
            <DollarSign size={28} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Phim Đang Chiếu</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{stats.activeMovies || 0}</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(225, 29, 72, 0.1)', borderRadius: '12px', color: '#E11D48' }}>
            <Film size={28} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Tổng Người Dùng</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{stats.totalUsers || 0}</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10B981' }}>
            <Users size={28} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Số Vé Đã Bán</h3>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{stats.totalTickets || 0}</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#F59E0B' }}>
            <Ticket size={28} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Truy cập nhanh</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <Link to="/movies" style={{ textDecoration: 'none', padding: '14px', borderRadius: '12px', background: 'rgba(225,29,72,0.1)', color: 'inherit', border: '1px solid rgba(225,29,72,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><Film size={16} /> Quản lý phim</div>
          </Link>
          <Link to="/food-drinks" style={{ textDecoration: 'none', padding: '14px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'inherit', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><Coffee size={16} /> Quản lý đồ ăn</div>
          </Link>
          <Link to="/showtimes" style={{ textDecoration: 'none', padding: '14px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: 'inherit', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><CalendarDays size={16} /> Lịch chiếu</div>
          </Link>
          <Link to="/users" style={{ textDecoration: 'none', padding: '14px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', color: 'inherit', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><Users size={16} /> Người dùng</div>
          </Link>
          <Link to="/invoices" style={{ textDecoration: 'none', padding: '14px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', color: 'inherit', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><Ticket size={16} /> Đơn vé</div>
          </Link>
          <Link to="/banners" style={{ textDecoration: 'none', padding: '14px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', color: 'inherit', border: '1px solid rgba(236,72,153,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><PlaySquare size={16} /> Banner</div>
          </Link>
        </div>
      </div>

      {/* Biểu đồ và Danh sách */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Biểu đồ doanh thu */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-primary)' }}>Doanh thu 7 ngày gần nhất</h3>
          <div style={{ width: '100%', height: '300px' }}>
            {stats.revenueChart && stats.revenueChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: '#E11D48' }}
                    formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#E11D48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Chưa có dữ liệu doanh thu
              </div>
            )}
          </div>
        </div>

        {/* Top phim */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-primary)' }}>Phim Hot Nhất</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.topMovies && stats.topMovies.length > 0 ? (
              stats.topMovies.map((movie, idx) => (
                <div key={movie.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: idx < stats.topMovies.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>{movie.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{movie.tickets} vé</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#10B981', fontSize: '14px' }}>
                    {movie.revenue}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Chưa có dữ liệu phim</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
