import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Dashboard from './components/Dashboard';
import { useData } from './hooks/useData';

// 글로벌 스타일
const GlobalStyle = createGlobalStyle`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  /* Leaflet 오버라이드 */
  .leaflet-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
  }
  
  .leaflet-popup-content {
    margin: 12px 16px;
    line-height: 1.4;
  }
  
  /* Chart.js 오버라이드 */
  .chartjs-render-monitor {
    border-radius: 8px;
  }

  /* 커스텀 스크롤바 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ErrorBoundaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  color: white;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 30px;
    max-width: 600px;
    line-height: 1.6;
  }
  
  button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
    
    &:hover {
      background: #45a049;
    }
  }
`;

// 에러 바운더리 컴포넌트
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryContainer>
          <h1>🚨 앱 오류 발생</h1>
          <p>
            대시보드를 실행하는 중 예상치 못한 오류가 발생했습니다.
            페이지를 새로고침하거나 브라우저를 다시 시작해보세요.
          </p>
          <button onClick={() => window.location.reload()}>
            🔄 페이지 새로고침
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>개발자 정보 (클릭하여 펼치기)</summary>
              <pre style={{ 
                background: 'rgba(0,0,0,0.2)', 
                padding: '10px', 
                borderRadius: '5px',
                fontSize: '0.8rem',
                overflow: 'auto',
                maxWidth: '800px'
              }}>
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
          )}
        </ErrorBoundaryContainer>
      );
    }

    return this.props.children;
  }
}

// 메인 앱 컴포넌트
function App() {
  const { regionData, modelInfo, loading, error } = useData();

  return (
    <ErrorBoundary>
      <GlobalStyle />
      <AppContainer>
        <Dashboard 
          regionData={regionData}
          modelInfo={modelInfo}
          loading={loading}
          error={error}
        />
      </AppContainer>
    </ErrorBoundary>
  );
}

export default App;