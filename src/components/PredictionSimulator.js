import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SimulatorContainer = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ControlGroup = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  .label {
    display: block;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    font-size: 0.95rem;
  }

  .value-display {
    text-align: center;
    font-size: 1.1rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 10px;
  }

  .slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #667eea;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #667eea;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  }

  .range-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #666;
    margin-top: 5px;
  }
`;

const ResultPanel = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  .title {
    font-size: 1.3rem;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .prediction {
    font-size: 3rem;
    font-weight: bold;
    margin: 15px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .confidence {
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 10px;
  }

  .interpretation {
    font-size: 0.9rem;
    opacity: 0.8;
    line-height: 1.4;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const ResetButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
  margin-top: 15px;

  &:hover {
    background: #45a049;
  }
`;

const PredictionSimulator = ({ modelInfo }) => {
  // 시뮬레이터 변수들
  const [variables, setVariables] = useState({
    youth_farmers_2021: 50,
    youth_farmers_2022: 60,
    youth_farmers_2023: 70,
    farming_support_participants: 30,
    infrastructure_level: 7,
    living_condition_score: 7,
    policy_satisfaction: 7,
  });

  const [predictedRate, setPredictedRate] = useState(75.0);

  // 변수 범위 정의
  const variableRanges = {
    farming_support_participants: {
      min: 0,
      max: 100,
      step: 1,
      unit: "명",
      label: "영농정착지원사업 참여자",
    },
    infrastructure_level: {
      min: 1,
      max: 10,
      step: 0.1,
      unit: "점",
      label: "인프라 수준",
    },
    living_condition_score: {
      min: 1,
      max: 10,
      step: 0.1,
      unit: "점",
      label: "정주여건 점수",
    },
    policy_satisfaction: {
      min: 1,
      max: 10,
      step: 0.1,
      unit: "점",
      label: "정책지원 만족도",
    },
  };

  // 예측 모델 (간단한 가중합 방식)
  const calculatePrediction = (vars) => {
    // 모델 정보에서 중요도 가져오기
    const importanceMap = {};
    if (modelInfo.feature_importance) {
      modelInfo.feature_importance.forEach((item) => {
        importanceMap[item.feature] = item.importance;
      });
    }

    // 기본 가중치 (feature_importance가 없을 경우)
    const weights = {
      youth_farmers_2021: importanceMap["2021_귀농청년수"] || 0.056,
      youth_farmers_2022: importanceMap["2022_귀농청년수"] || 0.089,
      youth_farmers_2023: importanceMap["2023_귀농청년수"] || 0.205,
      farming_support_participants:
        importanceMap["영농정착지원사업참여자_2023"] || 0.272,
      infrastructure_level: importanceMap["인프라수준_숫자"] || 0.033,
      living_condition_score: importanceMap["정주여건점수_숫자"] || 0.156,
      policy_satisfaction: importanceMap["정책지원만족도_숫자"] || 0.189,
    };

    // 정규화된 값들 계산
    const normalizedValues = {
      youth_farmers_2021: Math.min(vars.youth_farmers_2021 / 100, 1),
      youth_farmers_2022: Math.min(vars.youth_farmers_2022 / 100, 1),
      youth_farmers_2023: Math.min(vars.youth_farmers_2023 / 100, 1),
      farming_support_participants: Math.min(
        vars.farming_support_participants / 50,
        1
      ),
      infrastructure_level: vars.infrastructure_level / 10,
      living_condition_score: vars.living_condition_score / 10,
      policy_satisfaction: vars.policy_satisfaction / 10,
    };

    // 가중합 계산
    let prediction = 60; // 기본값
    Object.keys(weights).forEach((key) => {
      prediction += normalizedValues[key] * weights[key] * 40; // 스케일링
    });

    return Math.max(30, Math.min(95, prediction)); // 30-95% 범위로 제한
  };

  // 변수 변경 핸들러
  const handleVariableChange = (variable, value) => {
    const newVariables = { ...variables, [variable]: parseFloat(value) };
    setVariables(newVariables);
    setPredictedRate(calculatePrediction(newVariables));
  };

  // 초기값으로 리셋
  const resetToDefaults = () => {
    const defaultVars = {
      youth_farmers_2021: 50,
      youth_farmers_2022: 60,
      youth_farmers_2023: 70,
      farming_support_participants: 30,
      infrastructure_level: 7,
      living_condition_score: 7,
      policy_satisfaction: 7,
    };
    setVariables(defaultVars);
    setPredictedRate(calculatePrediction(defaultVars));
  };

  // 예측값에 따른 해석
  const getInterpretation = (rate) => {
    if (rate >= 85)
      return "🌟 매우 우수한 정착률입니다. 현재 정책을 유지하고 확대하는 것이 좋습니다.";
    if (rate >= 80)
      return "✅ 우수한 정착률입니다. 추가적인 개선을 통해 더 나은 결과를 기대할 수 있습니다.";
    if (rate >= 75)
      return "📈 양호한 정착률입니다. 핵심 요인들을 강화하면 더 좋은 성과를 낼 수 있습니다.";
    if (rate >= 70) return "⚠️ 평균적인 정착률입니다. 정책 개선이 필요합니다.";
    return "🚨 정착률이 낮습니다. 종합적인 정책 개선과 지원 확대가 시급합니다.";
  };

  // useEffect(() => {
  //   setPredictedRate(calculatePrediction(variables));
  // }, [modelInfo]);

  useEffect(() => {
    setPredictedRate(calculatePrediction(variables));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelInfo]);

  return (
    <SimulatorContainer>
      <ControlsGrid>
        {Object.entries(variableRanges).map(([key, config]) => (
          <ControlGroup key={key}>
            <label className="label">{config.label}</label>
            <div className="value-display">
              {variables[key]} {config.unit}
            </div>
            <input
              type="range"
              className="slider"
              min={config.min}
              max={config.max}
              step={config.step}
              value={variables[key]}
              onChange={(e) => handleVariableChange(key, e.target.value)}
            />
            <div className="range-info">
              <span>
                {config.min}
                {config.unit}
              </span>
              <span>
                {config.max}
                {config.unit}
              </span>
            </div>
          </ControlGroup>
        ))}
      </ControlsGrid>

      <ResultPanel>
        <div className="title">🎯 예측된 정착률</div>
        <div className="prediction">{predictedRate.toFixed(1)}%</div>
        <div className="confidence">
          모델 정확도:{" "}
          {modelInfo.model_performance
            ? (modelInfo.model_performance.r2_score * 100).toFixed(1)
            : "96.5"}
          %
        </div>
        <div className="interpretation">{getInterpretation(predictedRate)}</div>
        <ResetButton onClick={resetToDefaults}>🔄 기본값으로 리셋</ResetButton>
      </ResultPanel>
    </SimulatorContainer>
  );
};

export default PredictionSimulator;
