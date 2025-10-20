import React from 'react';
import styled from 'styled-components';

const OverviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.$bgColor || '#667eea'} 0%, ${props => props.$bgColorEnd || '#764ba2'} 100%);
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

const StatsOverview = ({ onCardClick }) => {

  const cardData = [
    {
      id: 1,
      title: '60세 이상 농가인구 현황',
      icon: '👵',
      value: '63.5%',
      description: '60세 이상 농가인구 (2024년)',
      subText: '2020년 대비 22.6% 증가',
      bgColor: '#667eea',
      bgColorEnd: '#764ba2',
      chartData: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: '60세 이상 농가인구 비율 (%)',
            data: [51.8, 54.2, 57.6, 60.8, 63.5],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.3
          }
        ]
      }
    },
    {
      id: 2,
      title: '40세 미만 농가인구 현황',
      icon: '👨‍🌾',
      value: '10.0%',
      description: '40세 미만 농가인구 (2024년)',
      subText: '2020년 대비 43.8% 감소',
      bgColor: '#4CAF50',
      bgColorEnd: '#45a049',
      chartData: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: '40세 미만 농가인구 비율 (%)',
            data: [17.8, 15.5, 13.2, 11.4, 10.0],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3
          }
        ]
      }
    },
    {
      id: 3,
      title: '청년 농업인 수 추이',
      icon: '📉',
      value: '20만명',
      description: '청년 농업인 수 (2024년)',
      subText: '2020년 411,700명 대비 51.4% 감소',
      bgColor: '#FF9800',
      bgColorEnd: '#F57C00',
      chartData: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: '청년 농업인 수 (천명)',
            data: [411.7, 357.2, 302.8, 248.3, 200.0],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3
          }
        ]
      }
    },
    {
      id: 4,
      title: '귀농 가구 수 추이',
      icon: '🏡',
      value: '8,243가구',
      description: '귀농 가구 (2024년)',
      subText: '2021년 대비 42.5% 감소',
      bgColor: '#9C27B0',
      bgColorEnd: '#7B1FA2',
      chartData: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: '귀농 가구 수 (가구)',
            data: [13500, 14347, 12450, 9800, 8243],
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            tension: 0.3
          }
        ]
      }
    },
    {
      id: 5,
      title: '총 농지면적 추이',
      icon: '🌾',
      value: '1,512.1천ha',
      description: '총 농지면적 (2023년)',
      subText: '2018년 대비 5.2% 감소',
      bgColor: '#2196F3',
      bgColorEnd: '#1976D2',
      chartData: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [
          {
            label: '총 농지면적 (천ha)',
            data: [1595.6, 1580.2, 1564.8, 1549.4, 1530.8, 1512.1],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3
          }
        ]
      }
    },
    {
      id: 6,
      title: '휴경농지 비율 추이',
      icon: '🔄',
      value: '5.1%',
      description: '휴경농지 비율 (2023년)',
      subText: '2018년 대비 1.3%p 증가',
      bgColor: '#FF5722',
      bgColorEnd: '#D84315',
      chartData: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [
          {
            label: '휴경농지 비율 (%)',
            data: [3.8, 4.0, 4.3, 4.6, 4.9, 5.1],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.3
          }
        ]
      }
    }
  ];

  const handleCardClick = (card) => {
    if (onCardClick) {
      onCardClick(card);
    }
  };

  return (
    <div>
      <SectionTitle>📈 전체 현황 요약 (2020-2024)</SectionTitle>
      
      <OverviewContainer>
        {cardData.map((card) => (
          <StatCard 
            key={card.id}
            $bgColor={card.bgColor}
            $bgColorEnd={card.bgColorEnd}
            onClick={() => handleCardClick(card)}
            style={{ cursor: 'pointer' }}
          >
            <div className="icon">{card.icon}</div>
            <h3>{card.value}</h3>
            <p>{card.description}</p>
            <small>{card.subText}</small>
          </StatCard>
        ))}
      </OverviewContainer>

    </div>
  );
};

export default StatsOverview;