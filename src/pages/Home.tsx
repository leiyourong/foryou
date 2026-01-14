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
  const now = new Date();
  const currentTime = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const hour = now.getHours();
  let greeting = '你好，柚子！';
  if (hour < 11) greeting = '早上好，柚子！';
  else if (hour < 14) greeting = '中午好，柚子！';
  else if (hour < 18) greeting = '下午好，柚子！';
  else greeting = '晚上好，柚子！';

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

      <div
        style={{
          textAlign: 'center',
          marginBottom: '16px',
          fontSize: 16,
          fontWeight: 600,
          color: '#ff6b9d'
        }}
      >
        {greeting}今天想玩什么呢？
      </div>

      <div
        style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 16px',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 16px rgba(255, 170, 60, 0.3)'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #ffe9a6 0, #ffcf5a 40%, #ffb347 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              color: '#8b4513',
              position: 'relative'
            }}
          >
            柚
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: -2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#78c850'
              }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#ff6b9d'
              }}
            >
              柚子的小小学习乐园
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: '#666'
              }}
            >
              和柚子一起玩游戏、练数学、学英语、背单词。
            </div>
          </div>
        </div>
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
