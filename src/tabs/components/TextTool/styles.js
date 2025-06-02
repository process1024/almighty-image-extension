import styled from 'styled-components';

export const StyledControls = styled.div`
  position: absolute;
  top: 46px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #32343d;
  padding: 6px;
  border-radius: 4px;
  z-index: 1;
  display: flex;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  div {
    margin: 0;
    position: relative;
    display: flex;
    align-items: center;
  }

  input, select {
    padding: 6px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1890ff;
    }
    
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  input[type="color"] {
    width: 40px;
    height: 32px;
    padding: 3px;
    cursor: pointer;
  }
`;

export const StyledToolbarControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  label {
    color: #666;
  }

  gap: 24px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 6px;
  
  label {
    font-weight: 500;
    color: #333;
  }
`;

