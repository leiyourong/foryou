import React, { useEffect, useState } from 'react';
import { Avatar, Upload, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const storageKey = 'userAvatar';

const AvatarPicker: React.FC = () => {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSrc(saved);
    }
  }, []);

  const handleSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('请选择图片文件');
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSrc(result);
      localStorage.setItem(storageKey, result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      gap: 12 
    }}>
      <Upload
        showUploadList={false}
        beforeUpload={(file) => handleSelect(file)}
        accept="image/*"
        fileList={[]}
      >
        <div style={{ cursor: 'pointer', position: 'relative' }}>
          <Avatar 
            size={80} 
            src={src} 
            icon={<UserOutlined />}
            style={{
              border: '4px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#ff6b9d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            fontSize: '12px',
            color: 'white'
          }}>
            ✏️
          </div>
        </div>
      </Upload>
      <span style={{ 
        fontSize: '14px', 
        color: '#666',
        fontWeight: 500
      }}>
        点击更换头像
      </span>
    </div>
  );
};

export default AvatarPicker;
