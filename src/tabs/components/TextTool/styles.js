import styled from 'styled-components';

export const StyledControls = styled.div`
  position: absolute;
  top: 60px;
  right: 50%;
  background-color: #32343d;
  background: white;
  padding: 10px;
  border-radius: 4px;
  z-index: 1;
  display: flex;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e5e5;
  gap: 12px;
  padding: 12px;

  div {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  label {
    min-width: 80px;
  }
  
  div {
    margin: 0;
    position: relative;
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

