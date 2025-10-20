// import React, { useEffect, useRef } from "react";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import styled from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 500px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const ChartSection = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.2rem;
    text-align: center;
  }

  .chart-wrapper {
    position: relative;
    height: 300px;

    @media (max-width: 768px) {
      height: 250px;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: ${(props) => (props.$active ? "#667eea" : "#e9ecef")};
  color: ${(props) => (props.$active ? "white" : "#666")};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${(props) => (props.$active ? "#5a6fd8" : "#dee2e6")};
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;

const ChartComponent = ({ regionData, modelInfo }) => {
  const [activeTab, setActiveTab] = React.useState("settlement");

  // 차트 옵션 공통 설정
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#667eea",
        borderWidth: 1,
      },
    },
  };

  // 정착률 상위 10개 지역 차트 데이터
  const getTopRegionsData = () => {
    const topRegions = [...regionData]
      .sort((a, b) => b.settlement_rate - a.settlement_rate)
      .slice(0, 10);

    return {
      labels: topRegions.map((region) => region.region_name),
      datasets: [
        {
          label: "정착률 (%)",
          data: topRegions.map((region) => region.settlement_rate),
          backgroundColor: topRegions.map((region) => {
            if (region.settlement_rate >= 85) return "#4CAF50";
            if (region.settlement_rate >= 80) return "#8BC34A";
            if (region.settlement_rate >= 75) return "#FFC107";
            return "#FF9800";
          }),
          borderColor: "#333",
          borderWidth: 1,
        },
      ],
    };
  };

  // 성공 요인 중요도 차트 데이터
  const getFeatureImportanceData = () => {
    if (!modelInfo.feature_importance) return null;

    const features = modelInfo.feature_importance.slice(0, 6);

    return {
      labels: features.map((f) =>
        f.feature.replace(/_/g, " ").replace("귀농청년수", "청년수")
      ),
      datasets: [
        {
          label: "중요도",
          data: features.map((f) => (f.importance * 100).toFixed(1)),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  };

  // 실패 요인 분석 데이터 (더미 데이터)
  const getFailureFactorsData = () => {
    return {
      labels: [
        "소득 부족",
        "농업기술 부족",
        "농지 확보 어려움",
        "정보 부족",
        "자금 부족",
        "기타",
      ],
      datasets: [
        {
          label: "실패 비율 (%)",
          data: [37.8, 39.0, 30.8, 22.5, 28.3, 15.2],
          backgroundColor: [
            "#ff6b6b",
            "#ee5a52",
            "#ff8a80",
            "#ffab91",
            "#ffcc02",
            "#a8a8a8",
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  };

  // 연도별 트렌드 데이터 (더미 데이터)
  const getTrendData = () => {
    return {
      labels: ["2019", "2020", "2021", "2022", "2023"],
      datasets: [
        {
          label: "전국 평균 정착률 (%)",
          data: [72.3, 74.8, 76.2, 78.5, 79.8],
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "청년 농업인 수 (천명)",
          data: [8.2, 9.1, 10.3, 11.8, 13.2],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true,
          yAxisID: "y1",
        },
      ],
    };
  };

  const trendOptions = {
    ...commonOptions,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "정착률 (%)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "청년 농업인 수 (천명)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const renderChart = () => {
    switch (activeTab) {
      case "settlement":
        return (
          <ChartSection>
            <h3>🏆 정착률 상위 10개 지역</h3>
            <div className="chart-wrapper">
              <Bar data={getTopRegionsData()} options={commonOptions} />
            </div>
          </ChartSection>
        );

      case "importance":
        const importanceData = getFeatureImportanceData();
        if (!importanceData) return <div>모델 정보를 로드하는 중...</div>;

        return (
          <ChartSection>
            <h3>🎯 성공 요인 중요도</h3>
            <div className="chart-wrapper">
              <Doughnut data={importanceData} options={commonOptions} />
            </div>
          </ChartSection>
        );

      case "failure":
        return (
          <ChartSection>
            <h3>⚠️ 귀농 실패 요인 분석</h3>
            <div className="chart-wrapper">
              <Doughnut
                data={getFailureFactorsData()}
                options={commonOptions}
              />
            </div>
          </ChartSection>
        );

      case "trend":
        return (
          <ChartSection>
            <h3>📈 정착률 및 청년농업인 수 추이</h3>
            <div className="chart-wrapper">
              <Line data={getTrendData()} options={trendOptions} />
            </div>
          </ChartSection>
        );

      default:
        return null;
    }
  };

  if (!regionData || regionData.length === 0) {
    return (
      <ChartContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            color: "#666",
          }}
        >
          차트 데이터를 로드하는 중...
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <TabContainer>
        <TabButton
          $active={activeTab === "settlement"}
          onClick={() => setActiveTab("settlement")}
        >
          정착률 순위
        </TabButton>
        <TabButton
          $active={activeTab === "importance"}
          onClick={() => setActiveTab("importance")}
        >
          성공 요인
        </TabButton>
        <TabButton
          $active={activeTab === "failure"}
          onClick={() => setActiveTab("failure")}
        >
          실패 요인
        </TabButton>
        <TabButton
          $active={activeTab === "trend"}
          onClick={() => setActiveTab("trend")}
        >
          추이 분석
        </TabButton>
      </TabContainer>

      {renderChart()}
    </ChartContainer>
  );
};

export default ChartComponent;
