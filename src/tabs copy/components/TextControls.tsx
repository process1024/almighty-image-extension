// src/components/ImageEditor/TextControls.jsx
import React from 'react';
import { Card, Input, Select, InputNumber, Typography } from 'antd';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';

const { Option } = Select;
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

const TextControls = ({ textObject, onUpdate }) => {
  if (!textObject) return null;

  const handleFontSizeChange = (value) => {
    onUpdate({ fontSize: value });
  };

  const handleFontFamilyChange = (value) => {
    onUpdate({ fontFamily: value });
  };

  const handleColorChange = (color) => {
    onUpdate({ fill: color.hex });
  };

  const handleTextChange = (e) => {
    onUpdate({ text: e.target.value });
  };

  return (
    <ControlsCard title="文字设置">
      <ControlItem>
        <Title level={5}>文字内容</Title>
        <Input
          value={textObject.text}
          onChange={handleTextChange}
          placeholder="输入文字内容"
        />
      </ControlItem>

      <ControlItem>
        <Title level={5}>字体</Title>
        <Select
          style={{ width: '100%' }}
          value={textObject.fontFamily}
          onChange={handleFontFamilyChange}
        >
          <Option value="Arial">Arial</Option>
          <Option value="Times New Roman">Times New Roman</Option>
          <Option value="Courier New">Courier New</Option>
          <Option value="SimSun">宋体</Option>
          <Option value="Microsoft YaHei">微软雅黑</Option>
        </Select>
      </ControlItem>

      <ControlItem>
        <Title level={5}>字体大小</Title>
        <InputNumber
          min={12}
          max={72}
          value={textObject.fontSize}
          onChange={handleFontSizeChange}
          style={{ width: '100%' }}
        />
      </ControlItem>

      <ControlItem>
        <Title level={5}>文字颜色</Title>
        <SketchPicker
          color={textObject.fill}
          onChange={handleColorChange}
          style={{ width: '100%' }}
        />
      </ControlItem>
    </ControlsCard>
  );
};

export default TextControls;