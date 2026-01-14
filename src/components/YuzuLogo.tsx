import React from 'react';

type Props = {
  subtitle?: string;
};

const YuzuLogo: React.FC<Props> = ({ subtitle }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #ffe9a6 0, #ffcf5a 40%, #ffb347 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 700,
          color: '#8b4513',
          position: 'relative'
        }}
      >
        柚
        <span
          style={{
            position: 'absolute',
            top: -3,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#78c850'
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#ff6b9d'
          }}
        >
          柚子乐园
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: 12,
              color: '#888'
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default YuzuLogo;

