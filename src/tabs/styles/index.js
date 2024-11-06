// src/components/ImageEditor/styles/index.js
import styled from 'styled-components';

export const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const StyledHeader = styled.div`
  height: 64px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
`;

export const StyledContent = styled.div`
  flex: 1;
  position: relative;
  background: #f0f0f0;
  overflow: hidden;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`;