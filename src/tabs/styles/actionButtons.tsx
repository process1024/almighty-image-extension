import styled from 'styled-components';

interface ActionButtonProps {
  primary?: boolean;
  isLast?: boolean;
}

export const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['primary', 'isLast'].includes(prop),
})<ActionButtonProps>`
  color: #fff;
  padding: 2px 12px;
  height: 30px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.primary ? '#5e4580' : '#4177a4'};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  margin-right: ${props => props.isLast ? '0' : '8px'};

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;
