// src/components/ImageEditor/components/common/ToolButton.jsx
import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

export const ToolButton = ({ active, icon, onClick, children }) => {
  return (
    <StyledButton
      type={active ? 'primary' : 'default'}
      icon={icon}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  &.ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    
    .anticon {
      font-size: 16px;
    }
  }
`;