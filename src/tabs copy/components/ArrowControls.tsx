// src/components/ImageEditor/ArrowControls.jsx
import React from 'react';
import { Card, InputNumber, Typography } from 'antd';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';

const { Title } = Typography;

const ControlsCard = styled(Card)`
  position: absolute;
  right: 20px;
  top: 20px;
  width: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ControlItem = styled.div`
  margin-bottom: 16px;

  .ant-typography {
    margin-bottom: 8px;
  }
`;

const ArrowControls = ({ arrowObject, onUpdate }) => {
  if (!arrowObject) return null;

  const handleStrokeWidthChange = (value) => {
    onUpdate({ strokeWidth: value });
  };

  const handleColorChange = (color) => {
    onUpdate({ stroke: color.hex });
  };

  return (
    <ControlsCard title="箭头设置">
      <ControlItem>
        <Title level={5}>线条粗细</Title>
        <InputNumber
          min={1}
          max={20}
          value={arrowObject.strokeWidth}
          onChange={handleStrokeWidthChange}
          style={{ width: '100%' }}
        />
      </ControlItem>

      <ControlItem>
        <Title level={5}>颜色</Title>
        <SketchPicker
          color={arrowObject.stroke}
          onChange={handleColorChange}
        />
      </ControlItem>
    </ControlsCard>
  );
};

export default ArrowControls;