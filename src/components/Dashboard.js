import React, { useState } from "react";
import styled from "styled-components";
import MapComponent from "./MapComponent";
import ChartComponent from "./ChartComponent";
import PredictionSimulator from "./PredictionSimulator";
import StatsOverview from "./StatsOverview";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
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

// const MainGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 30px;
//   margin-bottom: 30px;

//   @media (max-width: 1200px) {
//     grid-template-columns: 1fr;
//     gap: 20px;
//   }
// `;

const SecondaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.8rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.8rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

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
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  if (loading) {
    return (
      <DashboardContainer>
        <Header>
          <h1>🌾 청년 귀농 정착률 분석 대시보드</h1>
          <p>데이터를 로드하는 중입니다...</p>
        </Header>
        <LoadingCard>
          <div>
            <div
              className="spinner"
              style={{
                width: "50px",
                height: "50px",
                border: "5px solid rgba(102, 126, 234, 0.3)",
                borderTop: "5px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            ></div>
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
      </Header>

      {/* 통계 개요 */}
      <Card>
        <StatsOverview
          regionData={regionData}
          modelInfo={modelInfo}
          onCardClick={handleCardClick}
        />
      </Card>

      {selectedCard && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "10px",
              width: "80%",
              maxWidth: "800px",
              position: "relative",
              zIndex: 10000,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <h2 style={{ marginTop: 0 }}>{selectedCard.title}</h2>
            <div style={{ height: "400px", marginTop: "1rem" }}>
              <Line data={selectedCard.chartData} options={chartOptions} />
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.2rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                fontWeight: 600,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {selectedCard.id === 1 && (
                <span>
                  • <strong>고령화 가속화</strong>: 60세 이상 농가인구 비율이 2020년 51.8% → 2024년 63.5%로 22.6% 증가, 40세 미만은 17.8% → 10.0%로 감소
                </span>
              )}
              {selectedCard.id === 2 && (
                <span>
                  • <strong>청년층 감소 심화</strong>: 40세 미만 농가인구 비율이 2020년 17.8% → 2024년 10.0%로 43.8% 급감, 농촌의 미래 인력 기반 약화
                </span>
              )}
              {selectedCard.id === 3 && (
                <span>
                  • <strong>청년 농업인 급감</strong>: 2020년 411.7천명 → 2024년 200천명으로 51.4% 감소, 연평균 12.9%씩 감소하는 심각한 상황
                </span>
              )}
              {selectedCard.id === 4 && (
                <span>
                  • <strong>귀농 감소 추세</strong>: 2021년 14,347가구 → 2024년 8,243가구로 42.5% 감소, 코로나19 이후 귀농 열기 급속히 냉각
                </span>
              )}
              {selectedCard.id === 5 && (
                <span>
                  • <strong>농지 감소 가속화</strong>: 2018년 1,595.6천ha → 2023년 1,512.1천ha로 5.2% 감소, 연평균 1.0%씩 감소하는 추세
                </span>
              )}
              {selectedCard.id === 6 && (
                <span>
                  • <strong>휴경지 지속 증가</strong>: 2018년 3.8% → 2023년 5.1%로 1.3%p 증가, 2023년 기준 77.1천ha의 농지가 방치
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 메인 그리드: 지도 + 차트 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.8rem",
          width: "100%",
        }}
      >
        <Card style={{ margin: 0 }}>
          <h2>📍 지역별 정착률 지도</h2>
          <MapComponent regionData={regionData} />
        </Card>

        <Card style={{ margin: 0 }}>
          <h2>📊 정착률 분석 차트</h2>
          <ChartComponent regionData={regionData} modelInfo={modelInfo} />
        </Card>
      </div>

      {/* 보조 그리드: 예측 시뮬레이터 */}
      <SecondaryGrid>
        <Card style={{ gridColumn: "1 / -1" }}>
          <h2>🎛️ 정착률 예측 시뮬레이터</h2>
          <PredictionSimulator modelInfo={modelInfo} />
        </Card>
      </SecondaryGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
