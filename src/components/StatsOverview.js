import React from 'react';
import styled from 'styled-components';

const OverviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.bgColor || '#667eea'} 0%, ${props => props.bgColorEnd || '#764ba2'} 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  h3 {
    font-size: 2rem;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0;
  }
  
  .icon {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;



const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
`;

const StatsOverview = () => {
  // 통계 계산

  
  
  


  return (
    <div>
      <SectionTitle>📈 전체 현황 요약 (2020-2024)</SectionTitle>
      
      <OverviewContainer>
        <StatCard bgColor="#667eea" bgColorEnd="#764ba2">
          <div className="icon">👵</div>
          <h3>63.5%</h3>
          <p>60세 이상 농가인구 (2024년)</p>
          <small>2020년 대비 22.6% 증가</small>
        </StatCard>
        
        <StatCard bgColor="#4CAF50" bgColorEnd="#45a049">
          <div className="icon">👨‍🌾</div>
          <h3>10.0%</h3>
          <p>40세 미만 농가인구 (2024년)</p>
          <small>2020년 대비 43.8% 감소</small>
        </StatCard>
        
        <StatCard bgColor="#FF9800" bgColorEnd="#F57C00">
          <div className="icon">📉</div>
          <h3>20만명</h3>
          <p>청년 농업인 수 (2024년)</p>
          <small>2020년 411,700명 대비 51.4% 감소</small>
        </StatCard>
        
        <StatCard bgColor="#9C27B0" bgColorEnd="#7B1FA2">
          <div className="icon">🏡</div>
          <h3>8,243가구</h3>
          <p>귀농 가구 (2024년)</p>
          <small>2021년 대비 42.5% 감소</small>
        </StatCard>
        
        <StatCard bgColor="#2196F3" bgColorEnd="#1976D2">
          <div className="icon">🌾</div>
          <h3>1,512.1천ha</h3>
          <p>총 농지면적 (2023년)</p>
          <small>2018년 대비 5.2% 감소</small>
        </StatCard>
        
        <StatCard bgColor="#FF5722" bgColorEnd="#D84315">
          <div className="icon">🔄</div>
          <h3>5.1%</h3>
          <p>휴경농지 비율 (2023년)</p>
          <small>2018년 대비 1.3%p 증가</small>
        </StatCard>
      </OverviewContainer>
    </div>
  );
};

export default StatsOverview;