// src/components/ImageEditor/components/TextTool/styles.js
import styled from 'styled-components';

export const StyledControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

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