import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  CalculatorOutlined,
  HomeOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined
} from '@ant-design/icons';
import Home from './pages/Home';
import MonsterMath from './pages/MonsterMath';
import Vocabulary from './pages/Vocabulary';
import English from './pages/English';
import Games from './pages/Games';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: 'home', icon: <HomeOutlined />, label: '主页', path: '/' },
    { key: 'monster-math', icon: <CalculatorOutlined />, label: '数学', path: '/monster-math' },
    { key: 'vocabulary', icon: <ReadOutlined />, label: '单词', path: '/vocabulary' },
    { key: 'english', icon: <SmileOutlined />, label: '英语', path: '/english' },
    { key: 'games', icon: <RocketOutlined />, label: '游戏', path: '/games' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monster-math" element={<MonsterMath />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/english" element={<English />} />
        <Route path="/games" element={<Games />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 底部导航栏 */}
      <div className="bottom-nav">
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="nav-item-icon">{item.icon}</div>
            <div className="nav-item-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
