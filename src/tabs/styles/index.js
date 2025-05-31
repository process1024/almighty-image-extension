// src/components/ImageEditor/styles/index.js
import styled from 'styled-components';

export const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #212224;
`;

export const StyledHeader = styled.div`
  height: 46px;
  padding: 0 16px;
  background: #32343e;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
`;

export const StyledContent = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  margin-top: 46px;
  display: flex;
  align-items: center;
  justify-content: center;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`;