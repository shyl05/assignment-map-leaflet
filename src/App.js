import './App.css';
import { Layout, Tabs } from 'antd';
import MapOne from './Components/MapOne';
import MapTwo from './Components/MapTwo';

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
};

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle = {
  minHeight: 300,
  color: '#fff',
  paddingInline: 20,
};

const { Header, Content } = Layout;
function App() {
  const items = [
    {
      key: '1',
      label: 'Map 1',
      children: <MapOne/>,
    },
    {
      key: '2',
      label: 'Map 2',
      children: <MapTwo/>,
    },
  ];

  return (
    <div className="App">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>Map Assignment</Header>
        <Content style={contentStyle}>
          <Tabs defaultActiveKey="1" items={items} />
        </Content>
      </Layout>
    </div>
  );
}

export default App;
