import { Button, Tooltip } from 'antd';
import styled from 'styled-components';

import type { ToolButtonProps } from '../controlTypes';

export const ToolButton = ({
  icon,
  active,
  disabled = false,
  onClick,
  tooltip = '',
}: ToolButtonProps) => {
  return (
    <Tooltip title={tooltip}>
      <StyledButton
        htmlType="button"
        className={active ? 'active' : ''}
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </StyledButton>
    </Tooltip>
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
    color: #fff;
    
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
