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
    height: 400px;

    @media (max-width: 768px) {
      height: 350px;
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

  // 가로 막대 차트 데이터 (상위/하위 비교)
  const getTopBottomRegionsData = () => {
    // 1. "전국" 데이터를 필터링하여 순위 비교에서 제외
    const filteredRegions = regionData.filter(
      (region) => region.region_name !== "전국"
    );

    // 2. 정착률 기준으로 내림차순 정렬 (높은 순)
    const sortedRegions = [...filteredRegions].sort(
      (a, b) => b.settlement_rate - a.settlement_rate
    );

    // 데이터가 최소 5개 미만이면 차트 표시 불가
    if (sortedRegions.length < 5) {
        return {
            labels: sortedRegions.map(r => r.region_name),
            datasets: [{
                label: "정착률 (%)",
                data: sortedRegions.map(r => r.settlement_rate),
                backgroundColor: "#66BB6A",
                borderColor: "#fff",
                borderWidth: 2,
            }]
        };
    }

    // 3. 상위 5개와 하위 5개 선택
    const topRegions = sortedRegions.slice(0, 5);
    
    let bottomRegions = [];
    if (sortedRegions.length >= 10) {
        // 데이터가 충분하면 하위 5개 선택 및 오름차순으로 역순 배열
        bottomRegions = sortedRegions.slice(-5).reverse();
    } else {
        // 5개 이상 10개 미만인 경우, 상위 5개를 제외한 나머지를 하위 지역으로 간주하고 역순 배열
        bottomRegions = sortedRegions.slice(5).reverse();
    }
    
    // 4. 합치기 (상위 5개 + 하위 (최대) 5개)
    const combinedRegions = [...topRegions, ...bottomRegions];

    return {
      labels: combinedRegions.map((region) => region.region_name),
      datasets: [
        {
          label: "정착률 (%)",
          data: combinedRegions.map((region) => region.settlement_rate),
          backgroundColor: combinedRegions.map((region, index) => {
            // 상위 그룹 (topRegions.length)까지는 초록색 계열
            if (index < topRegions.length) {
              if (region.settlement_rate >= 87) return "#2E7D32"; // 진한 초록
              if (region.settlement_rate >= 85) return "#4CAF50"; // 초록
              return "#66BB6A"; // 연한 초록
            }
            // 하위 그룹 (빨강/주황 계열)
            else {
              if (region.settlement_rate < 30) return "#D32F2F"; // 정착률이 매우 낮은 지역은 진한 빨강
              if (region.settlement_rate < 40) return "#F44336"; // 빨강
              return "#FF9800"; // 주황
            }
          }),
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  };

  // 가로 막대 차트 옵션
  const horizontalBarOptions = {
    indexAxis: "y", // 가로 방향으로 변경
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#667eea",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `정착률: ${context.parsed.x.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: false,
        // *** 수정된 부분: X축 최소값을 65에서 10으로 변경하여 낮은 값도 보이게 함 ***
        min: 10, 
        max: 100, // 최대값을 100%로 설정
        title: {
          display: true,
          text: "정착률 (%)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // 성공 요인 중요도 차트 데이터
  const getFeatureImportanceData = () => {
    if (!modelInfo || !modelInfo.feature_importance) return null;

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
            <h3>🏆 정착률 비교: 상위 5개 지역 vs 하위 5개 지역</h3>
            <div className="chart-wrapper">
              <Bar
                data={getTopBottomRegionsData()}
                options={horizontalBarOptions}
              />
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