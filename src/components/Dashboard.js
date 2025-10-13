import React from 'react';
import styled from 'styled-components';
import MapComponent from './MapComponent';
import ChartComponent from './ChartComponent';
import PredictionSimulator from './PredictionSimulator';
import StatsOverview from './StatsOverview';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  color: white;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SecondaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
  }
  
  h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.5rem;
    border-bottom: 2px solid #667eea;
    padding-bottom: 10px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 15px;
    
    h2 {
      font-size: 1.3rem;
    }
  }
`;

const LoadingCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #666;
  font-size: 1.2rem;
`;

const ErrorCard = styled(Card)`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #d63031;
  text-align: center;
  
  h3 {
    color: #d63031;
    margin-bottom: 10px;
  }
`;

const Dashboard = ({ regionData, modelInfo, loading, error }) => {
  if (loading) {
    return (
      <DashboardContainer>
        <Header>
          <h1>🌾 청년 귀농 정착률 분석 대시보드</h1>
          <p>데이터를 로드하는 중입니다...</p>
        </Header>
        <LoadingCard>
          <div>
            <div className="spinner" style={{
              width: '50px',
              height: '50px',
              border: '5px solid rgba(102, 126, 234, 0.3)',
              borderTop: '5px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            데이터 로딩 중...
          </div>
        </LoadingCard>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <h1>🌾 청년 귀농 정착률 분석 대시보드</h1>
          <p>데이터 로드 중 오류가 발생했습니다.</p>
        </Header>
        <ErrorCard>
          <h3>⚠️ 데이터 로드 오류</h3>
          <p>서버에서 데이터를 가져오는 중 문제가 발생했습니다.</p>
          <p>백업 데이터로 대시보드를 표시합니다.</p>
          <small>오류 내용: {error}</small>
        </ErrorCard>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>🌾 청년 귀농 정착률 분석 대시보드</h1>
        <p>정책 개선을 위한 데이터 기반 분석 도구</p>
      </Header>

      {/* 통계 개요 */}
      <Card>
        <StatsOverview regionData={regionData} modelInfo={modelInfo} />
      </Card>

      {/* 메인 그리드: 지도 + 차트 */}
      <MainGrid>
        <Card>
          <h2>📍 지역별 정착률 지도</h2>
          <MapComponent regionData={regionData} />
        </Card>
        
        <Card>
          <h2>📊 정착률 분석 차트</h2>
          <ChartComponent regionData={regionData} modelInfo={modelInfo} />
        </Card>
      </MainGrid>

      {/* 보조 그리드: 예측 시뮬레이터 */}
      <SecondaryGrid>
        <Card style={{ gridColumn: '1 / -1' }}>
          <h2>🎛️ 정착률 예측 시뮬레이터</h2>
          <PredictionSimulator modelInfo={modelInfo} />
        </Card>
      </SecondaryGrid>
    </DashboardContainer>
  );
};

export default Dashboard;