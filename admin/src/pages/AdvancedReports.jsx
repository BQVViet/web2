import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, Users, Ticket, DollarSign, Calendar } from 'lucide-react';
import '../styles/Movies.css'; // Kế thừa style giao diện glass-panel của bạn

// Dữ liệu mẫu (Mock data)
const revenueData = [
  { name: 'Tháng 1', revenue: 40000000, tickets: 400 },
  { name: 'Tháng 2', revenue: 30000000, tickets: 300 },
  { name: 'Tháng 3', revenue: 55000000, tickets: 550 },
  { name: 'Tháng 4', revenue: 27000000, tickets: 270 },
  { name: 'Tháng 5', revenue: 89000000, tickets: 890 },
  { name: 'Tháng 6', revenue: 120000000, tickets: 1200 },
];

const moviePerformanceData = [
  { name: 'Mai', value: 45 },
  { name: 'Đào, Phở và Piano', value: 25 },
  { name: 'Kung Fu Panda 4', value: 20 },
  { name: 'Dune: Part Two', value: 10 },
];

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const AdvancedReports = () => {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="movies-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      
      {/* Header */}
      <div className="filter-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--primary-color, #fff)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={28} /> Thống kê & Báo cáo
          </h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted, #aaa)', fontSize: '14px' }}>
            Cái nhìn tổng quan về doanh thu và hoạt động kinh doanh
          </p>
        </div>
        
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="7days">7 ngày qua</option>
          <option value="30days">30 ngày qua</option>
          <option value="6months">6 tháng qua</option>
          <option value="1year">1 năm qua</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '15px', borderRadius: '12px', color: '#10B981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted, #aaa)', fontSize: '14px', marginBottom: '5px' }}>Tổng Doanh Thu</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatVND(361000000)}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '15px', borderRadius: '12px', color: '#3B82F6' }}>
            <Ticket size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted, #aaa)', fontSize: '14px', marginBottom: '5px' }}>Vé Đã Bán</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>3,610</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '15px', borderRadius: '12px', color: '#F59E0B' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted, #aaa)', fontSize: '14px', marginBottom: '5px' }}>Khách Hàng Mới</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>842</div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Doanh thu theo tháng */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} /> Biểu đồ Doanh thu
          </h3>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" tickFormatter={(value) => `${value / 1000000}tr`} />
                <RechartsTooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatVND(value) : value, 
                    name === 'revenue' ? 'Doanh thu' : 'Số vé'
                  ]}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="tickets" name="Số vé" stroke="#10B981" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tỷ lệ phim hot */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Tỷ trọng vé bán ra theo Phim</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moviePerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {moviePerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(value) => [`${value}%`, 'Tỷ trọng']}
                />
                <Legend layout="vertical" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdvancedReports;
