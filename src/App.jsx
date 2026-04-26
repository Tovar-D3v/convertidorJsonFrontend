import React, { useState } from 'react';
import { Button, Input, Upload, message, Typography, Row, Col, ConfigProvider } from 'antd';
import { Upload as UploadIcon, Download, Trash2, RefreshCw } from 'lucide-react';

const { TextArea } = Input;
const { Title, Text } = Typography;

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [xmlOutput, setXmlOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file) => {
    if (!file) return false;

    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
      message.error('Por favor, sube un archivo con extensión .json');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setJsonInput(content);
    };

    reader.onerror = () => {
      message.error('Error al leer el archivo');
    };

    reader.readAsText(file);
    return false;
  };

  const handleConvert = async () => {
    if (!jsonInput.trim()) {
      message.warning('Por favor ingrese contenido JSON.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/convertir/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput,
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.text();
      setXmlOutput(data);
      message.success('Conversión finalizada');
    } catch (error) {
      console.error(error);
      message.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const downloadXML = () => {
    const blob = new Blob([xmlOutput], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.xml';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJsonInput('');
    setXmlOutput('');
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#000000',
          borderRadius: 4,
        },
      }}
    >
      <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
        <header style={{ marginBottom: '40px', borderBottom: '1px solid #e8e8e8', paddingBottom: '20px' }}>
          <Title level={2} style={{ margin: 0, letterSpacing: '-1px' }}>
            CONVERSOR JSON A XML
          </Title>
        </header>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>ENTRADA JSON</Text>
              <Upload 
                beforeUpload={handleFileUpload} 
                showUploadList={false}
                accept=".json"
              >
                <Button icon={<UploadIcon size={16} />} size="small">
                  Subir archivo
                </Button>
              </Upload>
            </div>
            <TextArea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Inserte el código JSON aquí..."
              style={{ height: '450px', fontFamily: 'monospace', fontSize: '13px' }}
            />
          </Col>

          <Col xs={24} md={12}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', height: '32px' }}>
              <Text strong>SALIDA XML</Text>
            </div>
            <TextArea
              value={xmlOutput}
              readOnly
              placeholder="El resultado se mostrará en esta sección..."
              style={{ 
                height: '450px', 
                fontFamily: 'monospace', 
                fontSize: '13px', 
                backgroundColor: '#fafafa' 
              }}
            />
          </Col>
        </Row>

        <div style={{ 
          marginTop: '40px', 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          borderTop: '1px solid #e8e8e8',
          paddingTop: '30px'
        }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleConvert} 
            loading={loading}
            icon={<RefreshCw size={18} />}
            style={{ backgroundColor: '#000', borderColor: '#000' }}
          >
            CONVERTIR
          </Button>
          
          <Button 
            size="large" 
            onClick={downloadXML} 
            disabled={!xmlOutput}
            icon={<Download size={18} />}
          >
            DESCARGAR XML
          </Button>

          <Button 
            size="large" 
            danger 
            onClick={clearAll} 
            icon={<Trash2 size={18} />}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            LIMPIAR
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;