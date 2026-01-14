import React, { useMemo, useState } from 'react';
import YuzuLogo from '../components/YuzuLogo';

type TrailDot = {
  id: number;
  x: number;
  y: number;
};

const Welcome: React.FC = () => {
  const [dots, setDots] = useState<TrailDot[]>([]);

  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();

  let greeting = '你好，柚子！';
  if (hour < 11) greeting = '早上好，柚子！';
  else if (hour < 14) greeting = '中午好，柚子！';
  else if (hour < 18) greeting = '下午好，柚子！';
  else greeting = '晚上好，柚子！';

  const handlePointer = (clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setDots((prev) => [...prev.slice(-20), { id, x: clientX, y: clientY }]);
    window.setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
    }, 600);
  };

  return (
    <div
      className="welcome-screen"
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) {
          handlePointer(t.clientX, t.clientY);
        }
      }}
      onClick={(e) => {
        handlePointer(e.clientX, e.clientY);
      }}
    >
      <div className="welcome-content">
        <div style={{ marginBottom: 24 }}>
          <YuzuLogo subtitle="小小银河学习站" />
        </div>
        <div className="welcome-greeting">
          <div className="welcome-greeting-main">{greeting}</div>
          <div className="welcome-greeting-sub">今天要去哪个星球冒险呢？</div>
        </div>
        <div className="welcome-bubbles">
          <div className="welcome-bubble bubble-1">🌟 怪兽数学</div>
          <div className="welcome-bubble bubble-2">📚 单词小书包</div>
          <div className="welcome-bubble bubble-3">🔤 趣味英语</div>
          <div className="welcome-bubble bubble-4">🎮 单词小游戏</div>
        </div>
        <div className="welcome-tip">点击下面的菜单，就可以开始冒险啦～</div>
      </div>
      <div className="welcome-trails">
        {dots.map((dot) => (
          <span
            key={dot.id}
            className="welcome-star"
            style={{
              left: dot.x,
              top: dot.y
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Welcome;

