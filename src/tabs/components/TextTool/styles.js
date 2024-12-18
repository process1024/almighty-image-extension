// src/components/ImageEditor/components/TextTool/styles.js
import styled from 'styled-components';

export const StyledControls = styled.div`
  position: absolute;
  top: 60px;
  right: 50%;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  display: flex;
  gap: 8px;

  div {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  label {
    min-width: 80px;
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
`;