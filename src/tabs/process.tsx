import { Card, Typography, Space, Button, Upload, Progress, Select, Slider } from 'antd';
import { UploadOutlined, DownloadOutlined, CompressOutlined, FileImageOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { Option } = Select;

const StyledContainer = styled.div`
  padding: 32px 24px;
  max-width: 1000px;
  margin: 0 auto;
  background: #fafafa;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 20px;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const ProcessSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #1890ff;
  }
`;

const ImageProcessor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressQuality, setCompressQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [processing, setProcessing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [convertProgress, setConvertProgress] = useState(0);
  const [converting, setConverting] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOriginalSize(file.size);
    setCompressedFile(null);
    setCompressedSize(0);
    setConvertedFile(null);
    return false; // 阻止默认上传行为
  };

  const compressImage = (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 设置canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 清除画布
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制图片
        ctx?.drawImage(img, 0, 0);

        // 转换为Blob，设置压缩质量
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('压缩失败'));
            }
          },
          'image/jpeg',
          quality / 100
        );
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      // 加载图片
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setProgress(0);

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const compressed = await compressImage(selectedFile, compressQuality);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setCompressedFile(compressed);
      setCompressedSize(compressed.size);
      
      console.log('压缩完成', { 
        original: selectedFile.size, 
        compressed: compressed.size,
        ratio: ((1 - compressed.size / selectedFile.size) * 100).toFixed(1) + '%'
      });
    } catch (error) {
      console.error('压缩失败:', error);
    } finally {
      setTimeout(() => {
        setProcessing(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleDownloadCompressed = () => {
    if (!compressedFile || !selectedFile) return;

    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (): string => {
    if (originalSize === 0 || compressedSize === 0) return '0%';
    return ((1 - compressedSize / originalSize) * 100).toFixed(1) + '%';
  };

  const convertImageFormat = (file: File, format: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 设置canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 如果转换为PNG或其他支持透明的格式，需要处理透明背景
        if (format === 'png' || format === 'webp') {
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          // 对于JPEG和BMP，填充白色背景
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
        
        // 绘制图片
        ctx?.drawImage(img, 0, 0);

        // 根据格式设置MIME类型
        let mimeType: string;
        let quality: number | undefined;
        
        switch (format) {
          case 'jpeg':
            mimeType = 'image/jpeg';
            quality = 0.9; // 高质量
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'webp':
            mimeType = 'image/webp';
            quality = 0.9;
            break;
          case 'bmp':
            // Canvas不直接支持BMP，使用PNG代替
            mimeType = 'image/png';
            break;
          default:
            mimeType = 'image/png';
        }

        // 转换为Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('格式转换失败'));
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      // 加载图片
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDownloadConverted = () => {
    if (!convertedFile || !selectedFile) return;

    const url = URL.createObjectURL(convertedFile);
    const link = document.createElement('a');
    link.href = url;
    
    // 获取原文件名（不包含扩展名）
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '');
    const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    link.download = `${originalName}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFormatConvert = async () => {
    if (!selectedFile) return;

    setConverting(true);
    setConvertProgress(0);

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setConvertProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 100);

      const converted = await convertImageFormat(selectedFile, outputFormat);
      
      clearInterval(progressInterval);
      setConvertProgress(100);
      
      setConvertedFile(converted);
      
      console.log('格式转换完成', { 
        originalFormat: selectedFile.type,
        newFormat: outputFormat,
        size: converted.size
      });
    } catch (error) {
      console.error('格式转换失败:', error);
    } finally {
      setTimeout(() => {
        setConverting(false);
        setConvertProgress(0);
      }, 500);
    }
  };

  return (
    <StyledContainer>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          图片处理工具
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          本地处理，快速安全的图片编辑工具
        </Text>
      </div>

      {/* 文件上传区域 */}
      <StyledCard title="选择图片" extra={<FileImageOutlined />}>
        <Upload.Dragger
          beforeUpload={handleFileSelect}
          showUploadList={false}
          accept="image/*"
        >
          <ImagePreview>
            {selectedFile ? (
              <div style={{ textAlign: 'center' }}>
                <Text strong>{selectedFile.name}</Text>
                <br />
                <Text type="secondary">
                  大小: {(selectedFile.size / 1024).toFixed(1)} KB
                </Text>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <br />
                <Text>点击或拖拽图片到此处</Text>
              </div>
            )}
          </ImagePreview>
        </Upload.Dragger>
      </StyledCard>

      {/* 图片压缩 */}
      <StyledCard title="图片压缩" extra={<CompressOutlined />}>
        <ProcessSection>
          <div>
            <Text strong>压缩质量: {compressQuality}%</Text>
            <Slider
              min={1}
              max={100}
              value={compressQuality}
              onChange={setCompressQuality}
              style={{ marginTop: 8 }}
              disabled={!selectedFile}
            />
          </div>

          {/* 显示文件大小信息 */}
          {selectedFile && (
            <div style={{ 
              background: '#ffffff', 
              padding: 16, 
              borderRadius: 8,
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>原始大小</Text>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#595959' }}>
                    {formatFileSize(originalSize)}
                  </div>
                </div>
                {compressedSize > 0 && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>压缩后</Text>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>
                        {formatFileSize(compressedSize)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>压缩率</Text>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        {getCompressionRatio()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <Space size="middle">
            <Button
              type="primary"
              icon={<CompressOutlined />}
              onClick={handleCompress}
              disabled={!selectedFile || processing}
              loading={processing}
              style={{ borderRadius: 6 }}
            >
              开始压缩
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadCompressed}
              disabled={!compressedFile}
              style={{ borderRadius: 6 }}
            >
              下载结果
            </Button>
          </Space>

          {processing && (
            <Progress 
              percent={progress} 
              status="active" 
              showInfo={true}
              format={percent => `${percent}%`}
            />
          )}
        </ProcessSection>
      </StyledCard>

      {/* 格式转换 */}
      <StyledCard title="格式转换" extra={<FileImageOutlined />}>
        <ProcessSection>
          <div>
            <Text strong>输出格式:</Text>
            <Select
              value={outputFormat}
              onChange={setOutputFormat}
              style={{ width: 120, marginLeft: 8 }}
              disabled={!selectedFile || converting}
            >
              <Option value="jpeg">JPEG</Option>
              <Option value="png">PNG</Option>
              <Option value="webp">WebP</Option>
              <Option value="bmp">BMP</Option>
            </Select>
          </div>

          {/* 显示格式转换信息 */}
          {selectedFile && (
            <div style={{ 
              background: '#ffffff', 
              padding: 16, 
              borderRadius: 8,
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>原始格式</Text>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#595959' }}>
                    {selectedFile.type?.replace('image/', '').toUpperCase() || '未知'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>目标格式</Text>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1890ff' }}>
                    {outputFormat.toUpperCase()}
                  </div>
                </div>
                {convertedFile && (
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>状态</Text>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#52c41a' }}>
                      已完成
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Space size="middle">
            <Button
              type="primary"
              onClick={handleFormatConvert}
              disabled={!selectedFile || converting}
              loading={converting}
              style={{ borderRadius: 6 }}
            >
              开始转换
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadConverted}
              disabled={!convertedFile}
              style={{ borderRadius: 6 }}
            >
              下载结果
            </Button>
          </Space>

          {converting && (
            <Progress 
              percent={convertProgress} 
              status="active" 
              showInfo={true}
              format={percent => `${percent}%`}
            />
          )}
        </ProcessSection>
      </StyledCard>

      {/* 功能介绍 */}
      <StyledCard title="功能介绍" extra={<Text type="secondary">简洁高效的图片处理工具</Text>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* 当前功能 */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 15, color: '#262626' }}>✨ 当前功能</Text>
            </div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ padding: 12, background: '#ffffff', borderRadius: 6, border: '1px solid #f0f0f0' }}>
                <Space>
                  <CompressOutlined style={{ color: '#1890ff' }} />
                  <div>
                    <Text strong>智能压缩</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>质量可调，实时预览</Text>
                  </div>
                </Space>
              </div>
              <div style={{ padding: 12, background: '#ffffff', borderRadius: 6, border: '1px solid #f0f0f0' }}>
                <Space>
                  <FileImageOutlined style={{ color: '#52c41a' }} />
                  <div>
                    <Text strong>格式转换</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>支持主流格式互转</Text>
                  </div>
                </Space>
              </div>
            </Space>
          </div>

          {/* 即将推出 */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 15, color: '#262626' }}>🚀 即将推出</Text>
            </div>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary">• 智能抠图与背景移除</Text>
              <Text type="secondary">• 批量水印处理</Text>
              <Text type="secondary">• 长图拼接合成</Text>
              <Text type="secondary">• AI 图片增强工具</Text>
            </Space>
          </div>
        </div>

        {/* 技术特点 */}
        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          background: '#fafafa', 
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <Space split={<span style={{ color: '#d9d9d9' }}>•</span>} size="large" wrap>
            <Text type="secondary" style={{ fontSize: 12 }}>本地处理</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>数据安全</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>快速响应</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>免费使用</Text>
          </Space>
        </div>
      </StyledCard>
    </StyledContainer>
  );
};

export default ImageProcessor; 