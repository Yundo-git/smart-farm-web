# 청년 귀농 정착률 분석 대시보드 (React 버전) 🌾⚛️

청년 귀농인들의 정착률을 높이기 위한 정책 개선을 목표로 하는 **React 기반** 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 개발 환경 설정

1. **Node.js 설치 확인**
   ```bash
   node --version  # v16.0.0 이상 권장
   npm --version   # v8.0.0 이상 권장
   ```

2. **의존성 설치**
   ```bash
   cd youth-farming-dashboard-react
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm start
   ```
   - 자동으로 브라우저에서 `http://localhost:3000` 열림
   - 코드 변경 시 자동 새로고침 (Hot Reload)

### 프로덕션 빌드

```bash
npm run build
```
- `build/` 폴더에 최적화된 정적 파일 생성
- 웹서버에 배포 가능한 형태로 빌드

### 기타 명령어

```bash
npm test        # 테스트 실행
npm run lint    # 코드 린팅
npm run format  # 코드 포맷팅 (Prettier)
```

## 📁 프로젝트 구조

```
youth-farming-dashboard-react/
├── public/
│   ├── index.html                           # HTML 템플릿
│   ├── region_settlement_data.json          # 지역별 정착률 데이터
│   └── settlement_prediction_model.json     # 예측 모델 정보
├── src/
│   ├── components/                          # React 컴포넌트
│   │   ├── Dashboard.js                     # 메인 대시보드 레이아웃
│   │   ├── MapComponent.js                  # Leaflet 지도 컴포넌트
│   │   ├── ChartComponent.js                # Chart.js 차트 컴포넌트
│   │   ├── PredictionSimulator.js           # 정착률 예측 시뮬레이터
│   │   └── StatsOverview.js                 # 통계 개요 컴포넌트
│   ├── hooks/
│   │   └── useData.js                       # 데이터 로드 커스텀 훅
│   ├── utils/
│   │   └── regionCoordinates.js             # 지역 좌표 유틸리티
│   ├── styles/
│   │   └── index.css                        # 글로벌 CSS
│   ├── App.js                               # 메인 앱 컴포넌트
│   └── index.js                             # React DOM 렌더링
├── package.json                             # 프로젝트 설정 및 의존성
└── README.md                               # 이 파일
```

## 🎯 주요 기능

### 1. 📍 인터랙티브 지도 (React Leaflet)
- **68개 지역** 정착률 시각화
- **색상 구분**: 🟢우수(80%+) 🟡보통(70-80%) 🔴개선필요(70%-)
- **팝업 정보**: 지역별 상세 데이터, 성공/위험요인

### 2. 📊 동적 차트 (React Chart.js)
- **탭 방식** 차트 전환
- **정착률 순위**: 상위 10개 지역 바차트
- **성공요인 중요도**: 도넛차트
- **실패요인 분석**: 도넛차트
- **연도별 추이**: 라인차트

### 3. 🎛️ 정착률 예측 시뮬레이터
- **실시간 슬라이더** 조작
- **7개 핵심 변수** 제어
- **Random Forest 모델** 기반 예측
- **즉시 피드백** 및 해석

### 4. 📱 완전 반응형 디자인
- **Mobile First** 접근방식
- **Styled Components** 활용
- **Grid Layout** 자동 조정

## 💻 기술 스택

### Core Framework
- **React 18.2** - 최신 React 기능 활용
- **React Hooks** - 함수형 컴포넌트 상태 관리
- **React Scripts** - Create React App 기반

### UI & Styling
- **Styled Components 6.1** - CSS-in-JS 스타일링
- **반응형 디자인** - Mobile/Tablet/Desktop 지원
- **CSS Grid & Flexbox** - 현대적 레이아웃

### Data Visualization
- **React Leaflet 4.2** - 인터랙티브 지도
- **React Chart.js 5.2** - 동적 차트
- **Chart.js 4.4** - 차트 라이브러리
- **Leaflet 1.9** - 지도 엔진

### Data Management
- **Axios** - HTTP 요청 처리
- **Custom Hooks** - 데이터 로직 분리
- **Error Boundary** - 에러 처리

### Development Tools
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **React Developer Tools** 호환

## 🔧 React 컴포넌트 구조

### 1. App.js (루트 컴포넌트)
- **Error Boundary** 포함
- **글로벌 스타일** 적용
- **데이터 로드** 관리

### 2. Dashboard.js (메인 레이아웃)
- **Grid 레이아웃** 관리
- **로딩/에러 상태** 처리
- **반응형 카드** 컴포넌트

### 3. MapComponent.js (지도)
- **React Leaflet** 통합
- **커스텀 마커** 생성
- **팝업 콘텐츠** 동적 생성

### 4. ChartComponent.js (차트)
- **탭 기반** 차트 전환
- **Chart.js** React 통합
- **반응형 차트** 크기

### 5. PredictionSimulator.js (시뮬레이터)
- **실시간 상태 업데이트**
- **슬라이더 제어**
- **예측 모델** 구현

## 📊 데이터 관리

### useData Hook
```javascript
const { regionData, modelInfo, loading, error } = useData();
```
- **비동기 데이터 로드**
- **에러 처리** 및 백업 데이터
- **로딩 상태** 관리

### 데이터 소스
- `public/region_settlement_data.json` - 68개 지역 정착률 데이터
- `public/settlement_prediction_model.json` - ML 모델 메타데이터

## 🎨 스타일링 시스템

### Styled Components 활용
```javascript
const StyledCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;
```

### 반응형 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px - 1200px  
- **Desktop**: > 1200px

## 🚀 배포 방법

### 1. Netlify (권장)
```bash
npm run build
# build/ 폴더를 Netlify에 드래그 앤 드롭
```

### 2. Vercel
```bash
npm run build
vercel --prod
```

### 3. GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

### 4. 일반 웹서버
```bash
npm run build
# build/ 폴더 내용을 웹서버에 업로드
```

## 🔧 개발자 가이드

### 새로운 컴포넌트 추가
1. `src/components/` 에서 새 파일 생성
2. Styled Components로 스타일링
3. PropTypes로 타입 검증 (선택사항)
4. Dashboard.js에서 import 및 사용

### 차트 추가
1. ChartComponent.js의 `renderChart()` 함수 수정
2. 새 탭 버튼 추가
3. Chart.js 설정 추가

### 지도 기능 확장
1. MapComponent.js 수정
2. regionCoordinates.js에 새 좌표 추가
3. 새 마커 스타일 정의

## 🐛 문제 해결

### 자주 발생하는 문제

**1. 지도가 표시되지 않는 경우**
```bash
npm install leaflet react-leaflet
# Leaflet CSS가 index.html에 포함되어있는지 확인
```

**2. 차트가 표시되지 않는 경우**
```bash
npm install chart.js react-chartjs-2
# Chart.js 버전 호환성 확인
```

**3. 스타일이 깨지는 경우**
```bash
npm install styled-components
# GlobalStyle이 App.js에 적용되어있는지 확인
```

**4. 데이터 로드 실패**
- 브라우저 개발자 도구 Network 탭 확인
- JSON 파일이 public/ 폴더에 있는지 확인
- CORS 에러 시 서버 설정 확인

### 개발 도구

**React Developer Tools**
- 브라우저 확장 프로그램 설치
- 컴포넌트 트리 및 상태 디버깅

**Redux DevTools** (상태관리 확장시)
- Redux Toolkit 사용 권장
- 상태 변화 추적

## 📈 성능 최적화

### 이미 적용된 최적화
- **React.memo()** - 불필요한 리렌더링 방지
- **useCallback()** - 함수 메모이제이션
- **useMemo()** - 계산 결과 캐싱
- **Code Splitting** - 동적 import 준비

### 추가 최적화 권장사항
- **React.lazy()** - 컴포넌트 지연 로딩
- **Service Worker** - 캐싱 전략
- **Image Optimization** - WebP 포맷 사용

## 🤝 기여 방법

1. 이 저장소를 Fork
2. 새 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 📞 지원

- **Issues**: GitHub Issues 탭에서 버그 리포트 또는 기능 요청
- **Discussions**: 일반적인 질문 및 토론
- **Email**: 프로젝트 관련 문의

---

**개발자**: AI Assistant | **React 버전**: 1.0.0 | **최근 업데이트**: 2024-10-13

🎉 **React로 완전히 새롭게 구현된 현대적 웹 대시보드입니다!**