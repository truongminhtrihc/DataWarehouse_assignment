import React, { useState } from 'react';
import { Form, InputNumber, Select, Button, Typography, Row, Col, Card } from 'antd';
import './App.css';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const App: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);

  const onFinish = (values: any) => {
    const data = Object.values(values);
    axios
      .post('http://127.0.0.1:8000/predict', { data: data })
      .then((res) => {
        let predictionResult = '';
        if (res.data.prediction === 0) {
          predictionResult = 'Art';
        } else if (res.data.prediction === 1) {
          predictionResult = 'Commerce';
        } else {
          predictionResult = 'Science';
        }
        setResult(`Kết quả: ${predictionResult}`);
      })
      .catch((err) => {
        console.log(err);
        setResult('Kết quả: Lỗi khi lấy dữ liệu');
      });
  };

  return (
    <div className="App" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px' }}>
      <Card
        style={{
          maxWidth: '900px',
          margin: 'auto',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <header className="App-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Title level={2} style={{ color: '#1890ff' }}>
            Nhóm học sinh phù hợp
          </Title>
          <Text style={{ fontSize: '16px', color: '#595959' }}>
            Điền thông tin bên dưới để dự đoán nhóm học sinh phù hợp.
          </Text>
        </header>

        <Form
          name="user-form"
          onFinish={onFinish}
          layout="vertical"
          className="user-form"
          style={{ maxWidth: '800px', margin: 'auto' }}
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
                name="attendance"
                label="Attendance"
                rules={[{ required: true, message: 'Please input Attendance!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="english"
                label="English"
                rules={[{ required: true, message: 'Please input English marks!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="math"
                label="Math"
                rules={[{ required: true, message: 'Please input Math marks!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="science"
                label="Science"
                rules={[{ required: true, message: 'Please input Science marks!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="social_science"
                label="Social Science"
                rules={[{ required: true, message: 'Please input Social Science marks!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="art_culture"
                label="Art & Culture"
                rules={[{ required: true, message: 'Please input Art & Culture marks!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="mother_education"
                label="Mother's Education"
                rules={[{ required: true, message: 'Please select Mother\'s education!' }]}
              >
                <Select placeholder="Select value">
                  <Option value="SSC">SSC</Option>
                  <Option value="Hons">Hons</Option>
                  <Option value="HSC">HSC</Option>
                  <Option value="Masters">Masters</Option>
                  <Option value="Honors">Honors</Option>
                  <Option value="Under_SSC">Under SSC</Option>
                  <Option value="Diploma">Diploma</Option>
                  <Option value="Non_Educated">Non Educated</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="father_education"
                label="Father's Education"
                rules={[{ required: true, message: 'Please select Father\'s education!' }]}
              >
                <Select placeholder="Select value">
                  <Option value="SSC">SSC</Option>
                  <Option value="Hons">Hons</Option>
                  <Option value="HSC">HSC</Option>
                  <Option value="Masters">Masters</Option>
                  <Option value="Honors">Honors</Option>
                  <Option value="Under_SSC">Under SSC</Option>
                  <Option value="Diploma">Diploma</Option>
                  <Option value="Non_Educated">Non Educated</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please select Location!' }]}
              >
                <Select placeholder="Select value">
                  <Option value="Rural">Rural</Option>
                  <Option value="Urban">Urban</Option>
                  <Option value="City">City</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="studytime"
                label="Study Time"
                rules={[{ required: true, message: 'Please input Study Time!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="school_type"
                label="School Type"
                rules={[{ required: true, message: 'Please select School Type!' }]}
              >
                <Select placeholder="Select value">
                  <Option value="Govt">Govt</Option>
                  <Option value="Semi_Govt">Semi Govt</Option>
                  <Option value="Private">Private</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="primary" htmlType="submit" style={{ width: '150px' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>

        {result && (
          <Typography.Title level={4} style={{ textAlign: 'center', color: '#1890ff', marginTop: '20px' }}>
            {result}
          </Typography.Title>
        )}
      </Card>
    </div>
  );
};

export default App;
