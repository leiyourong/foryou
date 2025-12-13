import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalculatorOutlined,
  ReadOutlined,
  SmileOutlined,
  RocketOutlined
} from '@ant-design/icons';
import AvatarPicker from '../components/AvatarPicker';

const apps = [
  {
    id: 'math',
    title: '怪兽数学',
    icon: <CalculatorOutlined style={{ fontSize: 32, color: '#fff' }} />,
    to: '/monster-math',
    colorClass: 'icon-math'
  },
  {
    id: 'vocabulary',
    title: '单词复习',
    icon: <ReadOutlined style={{ fontSize: 32, color: '#fff' }} />,
    to: '/vocabulary',
    colorClass: 'icon-vocabulary'
  },
  {
    id: 'english',
    title: '趣味英语',
    icon: <SmileOutlined style={{ fontSize: 32, color: '#fff' }} />,
    to: '/english',
    colorClass: 'icon-english'
  },
  {
    id: 'games',
    title: '小游戏',
    icon: <RocketOutlined style={{ fontSize: 32, color: '#fff' }} />,
    to: '/games',
    colorClass: 'icon-games'
  }
];

const Home: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="mobile-desktop">
      {/* 状态栏 */}
      <div className="status-bar">
        <span>{currentTime}</span>
        <span style={{ fontSize: 12 }}>100% 🔋</span>
      </div>

      {/* 头像区域 */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px 0',
        marginBottom: '10px'
      }}>
        <AvatarPicker />
      </div>

      {/* 应用图标网格 */}
      <div className="app-grid">
        {apps.map((app) => (
          <Link key={app.id} to={app.to}>
            <div className="app-icon">
              <div className={`icon-wrapper ${app.colorClass}`}>
                {app.icon}
              </div>
              <div className="app-name">{app.title}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* 日期显示 */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        color: '#666',
        fontSize: '14px',
        fontWeight: 500
      }}>
        {currentDate}
      </div>
    </div>
  );
};

export default Home;
