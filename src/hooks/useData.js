import { useState, useEffect } from "react";
import axios from "axios";

// 커스텀 훅: 데이터 로드 및 상태 관리
export const useData = () => {
  const [regionData, setRegionData] = useState([]);
  const [modelInfo, setModelInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Set base URL for data files
        // In development, use the public directory
        // In production, use the root path
        const baseUrl = process.env.PUBLIC_URL || '';
        console.log('Base URL:', baseUrl);

        // 캐시 방지용 타임스탬프
        const timestamp = new Date().getTime();

        try {
          // 지역 정착률 데이터 로드
          const regionResponse = await axios.get(
            `${baseUrl}/region_settlement_data.json?t=${timestamp}`,
            {
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
            }
          );
          var regionResult = regionResponse.data;
          console.log(
            "지역 데이터 로드 성공:",
            regionResult.length > 0 ? "데이터 있음" : "빈 데이터"
          );
        } catch (regionError) {
          console.error("지역 데이터 로드 실패:", regionError);
          regionResult = getDummyData();
          console.log("더미 데이터로 대체");
        }

        try {
          // 모델 정보 로드
          const modelResponse = await axios.get(
            `${baseUrl}/settlement_prediction_model.json?t=${timestamp}`,
            {
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",

                Expires: "0",
              },
            }
          );
          var modelResult = modelResponse.data;
          console.log(
            "모델 데이터 로드 성공:",
            Object.keys(modelResult).length > 0 ? "데이터 있음" : "빈 데이터"
          );
        } catch (modelError) {
          console.error("모델 데이터 로드 실패:", modelError);
          modelResult = getDummyModelInfo();
          console.log("더미 모델 데이터로 대체");
        }

        setRegionData(regionResult);
        setModelInfo(modelResult);

        console.log(`${regionResult.length}개 지역 데이터 로드 완료`);
        console.log("모델 정보 로드 완료:", modelResult);
      } catch (err) {
        console.error("데이터 로드 오류:", err);
        setError(err.message);

        // 백업용 더미 데이터
        setRegionData(getDummyData());
        setModelInfo(getDummyModelInfo());

        console.log("백업 더미 데이터 사용");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { regionData, modelInfo, loading, error };
};

// 백업용 더미 데이터
const getDummyData = () => [
  {
    region_code: "11",
    region_name: "서울",
    region_type: "특별시",
    settlement_rate: 75.2,
    dropout_rate: 24.8,
    youth_farmers_2023: 20,
    cumulative_selected: 570,
    success_factors: "도시농업혁신_스마트팜",
    risk_factors: "농지부족_높은임대료",
    specialized_agriculture: "도시농업_스마트팜",
    policy_support_level: "높음",
    level: "sido",
  },
  {
    region_code: "48",
    region_name: "제주",
    region_type: "특별자치도",
    settlement_rate: 87.2,
    dropout_rate: 12.8,
    youth_farmers_2023: 85,
    cumulative_selected: 240,
    success_factors: "관광농업_친환경농업_지역브랜드",
    risk_factors: "높은생활비_제한적농지",
    specialized_agriculture: "감귤_관광농업",
    policy_support_level: "우수",
    level: "sido",
  },
  {
    region_code: "46",
    region_name: "전남",
    region_type: "도",
    settlement_rate: 85.1,
    dropout_rate: 14.9,
    youth_farmers_2023: 120,
    cumulative_selected: 450,
    success_factors: "넓은농지_정부지원_농업인프라",
    risk_factors: "고령화_교통불편",
    specialized_agriculture: "쌀_원예_축산",
    policy_support_level: "우수",
    level: "sido",
  },
];

// 백업용 더미 모델 정보
const getDummyModelInfo = () => ({
  feature_names: [
    "2021_귀농청년수",
    "2022_귀농청년수",
    "2023_귀농청년수",
    "영농정착지원사업참여자_2023",
    "인프라수준_숫자",
    "정주여건점수_숫자",
    "정책지원만족도_숫자",
  ],
  feature_importance: [
    { feature: "영농정착지원사업참여자_2023", importance: 0.272 },
    { feature: "2023_귀농청년수", importance: 0.205 },
    { feature: "정책지원만족도_숫자", importance: 0.189 },
    { feature: "정주여건점수_숫자", importance: 0.156 },
    { feature: "2022_귀농청년수", importance: 0.089 },
    { feature: "2021_귀농청년수", importance: 0.056 },
    { feature: "인프라수준_숫자", importance: 0.033 },
  ],
  model_performance: {
    r2_score: 0.965,
    mae: 0.34,
    rmse: 0.52,
  },
});
