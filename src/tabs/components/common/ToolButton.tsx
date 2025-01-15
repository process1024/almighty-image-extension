// src/components/ImageEditor/components/common/ToolButton.jsx
import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';


export const ToolButton = ({
  icon,
  active,
  disabled = false,
  onClick
}) => {
  return (
    <StyledButton
      type="button"
      className={active ? 'active' : ''}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
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
  &.active  {
    background: rgba(0, 0, 0, .5);
    color: #fff;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;