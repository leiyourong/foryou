import React, { useState, useRef, useEffect } from 'react';
import YuzuLogo from '../components/YuzuLogo';

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  content: string;
  vx: number;
  vy: number;
}

const EMOJIS = ['🌟', '🎈', '🍭', '🎨', '🚀', '🦋', '🌸', '🐳', '🍎', '🌈', '🍦', '🎁'];

const Home: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const createItem = (x: number, y: number) => {
    const id = nextId.current++;
    const content = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const scale = 0.5 + Math.random() * 1.5;
    const rotation = Math.random() * 360;
    const vx = (Math.random() - 0.5) * 4;
    const vy = (Math.random() - 0.5) * 4;

    setItems(prev => [...prev, { id, x, y, scale, rotation, content, vx, vy }]);
  };

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    // 阻止默认行为，防止滚动等
    // e.preventDefault(); 
    
    let clientX, clientY;
    if ('touches' in e) {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        createItem(touch.clientX, touch.clientY);
      }
    } else {
      createItem((e as React.MouseEvent).clientX, (e as React.MouseEvent).clientY);
    }
  };

  useEffect(() => {
    const updateItems = () => {
      setItems(prevItems => {
        return prevItems
          .map(item => ({
            ...item,
            x: item.x + item.vx,
            y: item.y + item.vy,
            rotation: item.rotation + 1,
            // 简单的边界反弹
            vx: (item.x < 0 || item.x > window.innerWidth) ? -item.vx : item.vx,
            vy: (item.y < 0 || item.y > window.innerHeight) ? -item.vy : item.vy,
          }))
          // 如果元素太多，移除旧的，或者不做移除保持漫游
          .slice(-50); 
      });
      animationFrameRef.current = requestAnimationFrame(updateItems);
    };

    animationFrameRef.current = requestAnimationFrame(updateItems);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mobile-desktop"
      onClick={handleTouch}
      onTouchStart={handleTouch}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        touchAction: 'none' // 防止浏览器默认手势
      }}
    >
      <div style={{ position: 'absolute', top: 20, zIndex: 10 }}>
        <YuzuLogo subtitle="点点屏幕变魔术" />
      </div>

      <div style={{
        fontSize: '2rem',
        color: '#ff6b9d',
        fontWeight: 'bold',
        opacity: 0.8,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        点一点屏幕试试看！
      </div>

      {items.map(item => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
            fontSize: '40px',
            pointerEvents: 'none',
            transition: 'transform 0.1s linear' // 平滑一点
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default Home;
