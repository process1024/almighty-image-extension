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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  justify-content: center;
`;

export const StyledContent = styled.div`
  flex: 1;
  position: relative;
  overflow: auto;
  margin-top: 46px;
  background: #212224;
  min-height: calc(100vh - 46px);
  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    display: block;
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    min-width: 300px;
    min-height: 200px;
  }
`;