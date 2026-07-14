import React, { useState, useEffect } from 'react';
import { Lightbulb, Sliders, Sun, Zap, Power, Play, Brush, AlertTriangle, Tv } from 'lucide-react';
import roomApi from '../api/roomApi';

const LightManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [loading, setLoading] = useState(true);

  // Lighting states for the selected room
  const [dimmers, setDimmers] = useState({
    house: 80, // Main ceiling
    aisle: 100, // Floor/LED steps
    accent: 50, // Decorative wall lamps
    screenBacklight: 20 // Behind the screen
  });

  const [zones, setZones] = useState({
    zoneA: true,  // Left aisle bulbs
    zoneB: true,  // Right aisle bulbs
    zoneC: true,  // Front row spotlight
    zoneD: false, // Back row spotlight
    emergency: true // Always on
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomApi.getAll();
      const list = Array.isArray(data) ? data : [];
      setRooms(list);
      if (list.length > 0) {
        setSelectedRoomId(String(list[0].id));
      }
    } catch (e) {
      console.error("Failed to fetch rooms:", e);
      // Fallback rooms
      setRooms([
        { id: 1, name: 'Phòng 1' },
        { id: 2, name: 'Phòng 2' },
        { id: 3, name: 'Phòng IMAX' }
      ]);
      setSelectedRoomId('1');
    } finally {
      setLoading(false);
    }
  };

  const handleDimmerChange = (type, val) => {
    setDimmers(prev => ({ ...prev, [type]: Number(val) }));
  };

  const toggleZone = (zone) => {
    if (zone === 'emergency') return; // Locked
    setZones(prev => ({ ...prev, [zone]: !prev[zone] }));
  };

  // Pre-configured scenes
  const applyScene = (scene) => {
    if (scene === 'movie') {
      setDimmers({ house: 0, aisle: 15, accent: 10, screenBacklight: 0 });
      setZones({ zoneA: false, zoneB: false, zoneC: false, zoneD: false, emergency: true });
    } else if (scene === 'cleanup') {
      setDimmers({ house: 100, aisle: 100, accent: 80, screenBacklight: 50 });
      setZones({ zoneA: true, zoneB: true, zoneC: true, zoneD: true, emergency: true });
    } else if (scene === 'emergency') {
      setDimmers({ house: 100, aisle: 100, accent: 100, screenBacklight: 100 });
      setZones({ zoneA: true, zoneB: true, zoneC: true, zoneD: true, emergency: true });
      alert("ĐÃ KÍCH HOẠT CHẾ ĐỘ KHẨN CẤP! Tất cả hệ thống đèn phòng chiếu đã chuyển sang 100% công suất.");
    }
  };

  const currentRoom = rooms.find(r => String(r.id) === selectedRoomId);

  return (
    <div className="movies-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Hệ Thống Sơ Đồ Đèn Phòng Chiếu</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Bảng điều khiển & sơ đồ đèn chiếu sáng thông minh (Smart Lighting Dashboard)</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontWeight: 600 }}>Chọn phòng:</label>
          <select 
            value={selectedRoomId} 
            onChange={(e) => setSelectedRoomId(e.target.value)} 
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit', fontWeight: 'bold' }}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>{room.name || `Phòng ${room.id}`}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: Visual Room Layout & Lightbulbs map */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Sơ đồ bố trí đèn - {currentRoom?.name || 'Phòng chiếu'}
          </h3>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '40px 20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '380px', justifyContent: 'space-between' }}>
            
            {/* Screen location */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '30px' }}>
              <div style={{ width: '60%', height: '6px', background: dimmers.screenBacklight > 0 ? `rgba(59, 130, 246, ${dimmers.screenBacklight / 100})` : '#3b82f6', borderRadius: '3px', boxShadow: dimmers.screenBacklight > 0 ? `0 0 ${dimmers.screenBacklight / 5}px rgba(59, 130, 246, 0.8)` : 'none' }}></div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '6px', letterSpacing: '2px' }}>MÀN HÌNH CHÍNH</div>
            </div>

            {/* Bulbs Grid Representation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '40px', width: '80%', flex: 1, alignItems: 'center', margin: '20px 0' }}>
              
              {/* Row 1 Bulbs */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneA && dimmers.house > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneA && dimmers.house > 0 ? `drop-shadow(0 0 ${dimmers.house / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneA')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trần Trái 1</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneC && dimmers.house > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneC && dimmers.house > 0 ? `drop-shadow(0 0 ${dimmers.house / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneC')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cận Màn 1</span>
              </div>

              <div></div> {/* Empty space */}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneC && dimmers.house > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneC && dimmers.house > 0 ? `drop-shadow(0 0 ${dimmers.house / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneC')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cận Màn 2</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneB && dimmers.house > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneB && dimmers.house > 0 ? `drop-shadow(0 0 ${dimmers.house / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneB')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trần Phải 1</span>
              </div>

              {/* Row 2 Bulbs */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneA && dimmers.house > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneA && dimmers.house > 0 ? `drop-shadow(0 0 ${dimmers.house / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneA')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trần Trái 2</span>
              </div>

              <div></div> {/* Empty */}

              {/* Center Aisle Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Zap size={20} color={dimmers.aisle > 0 ? '#10b981' : '#4b5563'} style={{ filter: dimmers.aisle > 0 ? 'drop-shadow(0 0 6px #10b981)' : 'none' }} />
                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>LED LỐI ĐI ({dimmers.aisle}%)</span>
              </div>

              <div></div> {/* Empty */}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneB && dimmers.house > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneB && dimmers.house > 0 ? `drop-shadow(0 0 ${dimmers.house / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneB')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trần Phải 2</span>
              </div>

              {/* Row 3 Bulbs */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.emergency ? '#ef4444' : '#4b5563'} style={{ filter: zones.emergency ? 'drop-shadow(0 0 8px #ef4444)' : 'none' }} />
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>LỐI THOÁT 1</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneD && dimmers.accent > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneD && dimmers.accent > 0 ? `drop-shadow(0 0 ${dimmers.accent / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneD')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hàng Cuối 1</span>
              </div>

              <div></div> {/* Empty */}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.zoneD && dimmers.accent > 0 ? '#fbbf24' : '#4b5563'} style={{ filter: zones.zoneD && dimmers.accent > 0 ? `drop-shadow(0 0 ${dimmers.accent / 10}px #fbbf24)` : 'none', cursor: 'pointer' }} onClick={() => toggleZone('zoneD')} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hàng Cuối 2</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={24} color={zones.emergency ? '#ef4444' : '#4b5563'} style={{ filter: zones.emergency ? 'drop-shadow(0 0 8px #ef4444)' : 'none' }} />
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>LỐI THOÁT 2</span>
              </div>

            </div>

            {/* Back projector room */}
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', borderTop: '1px dashed var(--border-color)', width: '100%', pt: '10px', textAlign: 'center', marginTop: '20px' }}>
              BUỒNG CHIẾU PHIM (PROJECTOR ROOM)
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Control Sliders & Quick Scenes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Scene Buttons */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Chế độ mẫu nhanh</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => applyScene('movie')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', cursor: 'pointer', fontWeight: 600, color: 'inherit' }}
              >
                <Play size={16} color="#3b82f6" />
                <span>Chế độ CHIẾU PHIM</span>
              </button>
              
              <button 
                onClick={() => applyScene('cleanup')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', cursor: 'pointer', fontWeight: 600, color: 'inherit' }}
              >
                <Brush size={16} color="#10b981" />
                <span>Chế độ DỌN DẸP</span>
              </button>

              <button 
                onClick={() => applyScene('emergency')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.1)', cursor: 'pointer', fontWeight: 700, color: '#ef4444' }}
              >
                <AlertTriangle size={16} />
                <span>Chế độ KHẨN CẤP (100%)</span>
              </button>
            </div>
          </div>

          {/* Dimmer adjusters */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Bộ chiết áp (Dimmers)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span>Đèn trần chính (Ceiling)</span>
                  <span style={{ fontWeight: 'bold' }}>{dimmers.house}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={dimmers.house} 
                  onChange={(e) => handleDimmerChange('house', e.target.value)} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span>LED dẫn đường (Aisle Steps)</span>
                  <span style={{ fontWeight: 'bold' }}>{dimmers.aisle}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={dimmers.aisle} 
                  onChange={(e) => handleDimmerChange('aisle', e.target.value)} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span>Đèn tường trang trí (Accent)</span>
                  <span style={{ fontWeight: 'bold' }}>{dimmers.accent}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={dimmers.accent} 
                  onChange={(e) => handleDimmerChange('accent', e.target.value)} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span>Hắt nền màn hình (Screen)</span>
                  <span style={{ fontWeight: 'bold' }}>{dimmers.screenBacklight}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={dimmers.screenBacklight} 
                  onChange={(e) => handleDimmerChange('screenBacklight', e.target.value)} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LightManagement;
