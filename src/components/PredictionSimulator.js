//ai로 생성된 코드 지금 데이터 들어가있는거 다 임시 데이터임 우리가 분석한거로 수정 필요

import  { useState, useEffect, useMemo } from 'react';
import '../styles/prediction.css';

// =========================================================================
// MOCK DATA (region_settlement_data_updated.json 파일 대체)
// region_name: "시/도 시군구" 형식
// policy_satisfaction: '높음', '중간', '낮음'을 가정
// =========================================================================
const MOCK_REGIONS = [
  //top 5지역 리스트 넣기기
  { region_name: '강원도 양구군', settlement_rate: 95.8, youth_farmers_2023: 120, living_condition_score: 9.2, policy_satisfaction: '높음', region_type: '시군구' },
  { region_name: '전라남도 해남군', settlement_rate: 93.1, youth_farmers_2023: 150, living_condition_score: 8.9, policy_satisfaction: '높음', region_type: '시군구' },
  { region_name: '경상북도 상주시', settlement_rate: 91.5, youth_farmers_2023: 135, living_condition_score: 8.5, policy_satisfaction: '높음', region_type: '시군구' },
  { region_name: '충청남도 부여군', settlement_rate: 90.2, youth_farmers_2023: 115, living_condition_score: 8.0, policy_satisfaction: '중간', region_type: '시군구' },
  { region_name: '경기도 이천시', settlement_rate: 89.9, youth_farmers_2023: 105, living_condition_score: 8.3, policy_satisfaction: '높음', region_type: '시군구' },

  //bottom 5지역 리스트 넣기
  { region_name: '경기도 수원시', settlement_rate: 78.5, youth_farmers_2023: 90, living_condition_score: 7.5, policy_satisfaction: '중간', region_type: '시군구' },
  { region_name: '경기도 용인시', settlement_rate: 75.0, youth_farmers_2023: 80, living_condition_score: 7.0, policy_satisfaction: '중간', region_type: '시군구' },
  { region_name: '제주특별자치도 제주시', settlement_rate: 82.1, youth_farmers_2023: 75, living_condition_score: 7.8, policy_satisfaction: '중간', region_type: '시군구' },
  { region_name: '서울특별시 강동구', settlement_rate: 60.5, youth_farmers_2023: 50, living_condition_score: 5.5, policy_satisfaction: '낮음', region_type: '시군구' },
  { region_name: '경상남도 창원시', settlement_rate: 72.3, youth_farmers_2023: 60, living_condition_score: 6.8, policy_satisfaction: '중간', region_type: '시군구' },
  { region_name: '충청남도 홍성군', settlement_rate: 65.3, youth_farmers_2023: 55, living_condition_score: 6.1, policy_satisfaction: '낮음', region_type: '시군구' },
];

// =========================================================================
// EMOJI ICONS (사용자 코드 유지)
// =========================================================================
const BarChart3 = () => <span>📊</span>;
const CheckCircle = () => <span>✅</span>;
const TrendingUp = () => <span>📈</span>;
const Target = () => <span>🎯</span>;
const MapPin = () => <span>📍</span>; // MapPin 추가

// =========================================================================
// UI Components
// =========================================================================

const LevelFilterDropdown = ({ label, value, options, onSelect, disabled = false }) => {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <select
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        className="filter-select"
        disabled={disabled}
      >
        <option value="">{`전체 ${label}`}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const ComparisonCard = ({ title, currentValue, benchmarkValue, unit, icon: Icon }) => {
  // 사용자의 로직 유지: 점수형 지표는 10점 만점 기준으로, 나머지는 벤치마크 값에 여유를 둔 기준으로
  const isScore = title.includes('점');
  const maxValue = isScore ? 10 : Math.max(currentValue, benchmarkValue) * 1.2;
  
  // 현재 값이 벤치마크의 80% 미만이면 낮은 것으로 판단 (시각적 경고)
  const isLow = currentValue < benchmarkValue * 0.8;
  const progressFillClass = isLow ? 'progress-fill current low' : 'progress-fill current';

  return (
    <div className="comparison-card">
      <div className="card-header">
        <div className="card-title">
          <Icon />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <div className="card-body">
        <div className="metric-row">
          <span className="metric-label">선택 지역</span>
          <span className="metric-value">
            {isScore ? currentValue.toFixed(1) : currentValue.toLocaleString()}{unit}
          </span>
          <div className="progress-bar">
            <div 
              className={progressFillClass}
              style={{ width: `${(currentValue / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="metric-row">
          <span className="metric-label benchmark-label">선도 지역</span>
          <span className="metric-value benchmark">
            {isScore ? benchmarkValue.toFixed(1) : benchmarkValue.toLocaleString()}{unit}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill benchmark" 
              style={{ width: `${(benchmarkValue / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// Main App Component (renamed from PredictionSimulator)
// =========================================================================

const App = () => {
  const regions = MOCK_REGIONS;
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigungu, setSelectedSigungu] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);

  // 1. Get unique Sido options
  const sidoOptions = useMemo(() => {
    // region_name의 첫 번째 단어 (예: '강원도', '경기도')를 추출
    const sidos = new Set(regions.map(region => region.region_name.split(' ')[0]));
    return Array.from(sidos).sort();
  }, [regions]);

  // 2. Get Sigungu options based on selected Sido
  const sigunguOptions = useMemo(() => {
    if (!selectedSido) return [];
    
    // 선택된 시/도로 시작하는 지역의 두 번째 단어 (시군구)를 추출
    return regions
      .filter(region => region.region_name.startsWith(selectedSido))
      .map(region => {
        const parts = region.region_name.split(' ');
        return parts.length > 1 ? parts[1] : ''; // 두 번째 단어가 시군구
      })
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .sort();
  }, [selectedSido, regions]);

  // 3. Get top 5 regions by settlement rate (선도 지역 그룹)
  const topRegions = useMemo(() => {
    return [...regions]
      .sort((a, b) => b.settlement_rate - a.settlement_rate)
      .slice(0, 5);
  }, [regions]);

  // 4. Set selected region when Sido and Sigungu are selected
  useEffect(() => {
    if (selectedSido && selectedSigungu) {
      // 선택된 시/도 + 시군구 이름을 가진 지역을 찾음
      const foundRegion = regions.find(
        region => 
          region.region_name === `${selectedSido} ${selectedSigungu}` &&
          region.region_type === '시군구'
      );
      setSelectedRegion(foundRegion || null);
    } else {
      setSelectedRegion(null);
    }
  }, [selectedSido, selectedSigungu, regions]);

  // 5. Calculate benchmark values (average of top 5)
  const benchmarkValues = useMemo(() => {
    if (topRegions.length === 0) return null;
    
    // 정책 만족도 문자열을 숫자로 변환하는 사용자 정의 로직 유지
    const scoreMap = { '높음': 9, '중간': 7, '낮음': 5 };

    return {
      settlement_rate: topRegions.reduce((sum, r) => sum + r.settlement_rate, 0) / topRegions.length,
      youth_farmers_2023: topRegions.reduce((sum, r) => sum + (r.youth_farmers_2023 || 0), 0) / topRegions.length,
      living_condition_score: topRegions.reduce((sum, r) => sum + (r.living_condition_score || 0), 0) / topRegions.length,
      policy_satisfaction: topRegions.reduce((sum, r) => {
        const score = scoreMap[r.policy_satisfaction] || 5; // 점수 변환
        return sum + score;
      }, 0) / topRegions.length
    };
  }, [topRegions]);
  
  const selectedPolicyScore = useMemo(() => {
    const scoreMap = { '높음': 9, '중간': 7, '낮음': 5 };
    if (!selectedRegion) return 0;
    return scoreMap[selectedRegion.policy_satisfaction] || 5;
  }, [selectedRegion]);


  if (regions.length === 0) {
    return <div className="loading">데이터 로딩 오류: 지역 데이터가 없습니다.</div>;
  }

  return (
    <>
    
      
      {/* ========================================================================= */}
      {/* React Component JSX */}
      {/* ========================================================================= */}

      <div className="prediction-container">
        <header className="header">
          <h1>청년 귀농 정착률 분석 대시보드</h1>
          <p>지역별 정착률과 핵심 지표를 비교 분석하고, 선도 지역의 평균값을 벤치마킹합니다.</p>
        </header>

        <div className="filter-section">
          <LevelFilterDropdown
            label="시/도 선택"
            value={selectedSido}
            options={sidoOptions}
            onSelect={(value) => {
              setSelectedSido(value);
              setSelectedSigungu(''); // 시/도 변경 시 시군구 초기화
            }}
          />
          <LevelFilterDropdown
            label="시군구 선택"
            value={selectedSigungu}
            options={sigunguOptions}
            onSelect={setSelectedSigungu}
            disabled={!selectedSido}
          />
        </div>

        {selectedRegion && benchmarkValues ? (
          <div className="dashboard">
            <div className="region-info">
              <div className="selected-region">
                <h2>선택 지역: {selectedRegion.region_name}</h2>
                <div className="settlement-rate">
                  <span className="rate-value">{selectedRegion.settlement_rate.toFixed(1)}%</span>
                  <span className="rate-label">예측 정착률</span>
                  <MapPin />
                </div>
              </div>
              <div className="top-regions">
                <h3>정착률 TOP 5 지역 (선도 지역 평균)</h3>
                <ul>
                  {topRegions.map((region, index) => (
                    <li key={region.region_name} className={region.region_name === selectedRegion.region_name ? 'active' : ''}>
                      {index + 1}. {region.region_name} ({region.settlement_rate.toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="metrics-grid">
              <ComparisonCard
                title="예측 정착률"
                currentValue={selectedRegion.settlement_rate}
                benchmarkValue={benchmarkValues.settlement_rate}
                unit="%"
                icon={Target}
              />
              <ComparisonCard
                title="청년 농업인 수 (2023)"
                currentValue={selectedRegion.youth_farmers_2023 || 0}
                benchmarkValue={Math.round(benchmarkValues.youth_farmers_2023)}
                unit="명"
                icon={BarChart3}
              />
              <ComparisonCard
                title="정주여건 점수"
                currentValue={selectedRegion.living_condition_score || 0}
                benchmarkValue={benchmarkValues.living_condition_score}
                unit="점"
                icon={CheckCircle}
              />
              <ComparisonCard
                title="정책 만족도"
                currentValue={selectedPolicyScore}
                benchmarkValue={benchmarkValues.policy_satisfaction}
                unit="점"
                icon={TrendingUp}
              />
            </div>
          </div>
        ) : selectedSido ? (
          <div className="no-region-selected">
            <p>시군구를 선택하여 해당 지역의 상세 분석 정보를 확인하세요.</p>
          </div>
        ) : (
          <div className="select-sido-prompt">
            <p>시/도를 선택하여 지역별 정착률 분석을 시작하세요.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
