// import React, { useEffect, useRef } from "react";
import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";
import { getRegionCoordinates } from "../utils/regionCoordinates";

// Leaflet 아이콘 수정 (Create React App의 webpack 이슈 해결)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapContainerStyled = styled.div`
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: 0; // 그리드 내에서 잘리지 않도록 설정

  .leaflet-container {
    height: 100%;
    width: 100%;
  }

  @media (max-width: 1200px) {
    height: 450px;
  }
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const PopupContent = styled.div`
  min-width: 200px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  .region-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    border-bottom: 2px solid #667eea;
    padding-bottom: 5px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    padding: 3px 0;

    .label {
      color: #666;
      font-weight: 500;
    }

    .value {
      color: #333;
      font-weight: bold;

      &.high {
        color: #4caf50;
      }

      &.medium {
        color: #ff9800;
      }

      &.low {
        color: #f44336;
      }
    }
  }

  .factors {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;

    .factor-title {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .factor-content {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.4;
    }
  }
`;

const MapComponent = ({ regionData }) => {
  const mapRef = useRef();

  // 정착률에 따른 마커 색상 결정
  const getMarkerColor = (settlementRate) => {
    if (settlementRate >= 80) return "#4CAF50"; // 초록
    if (settlementRate >= 70) return "#FF9800"; // 주황
    return "#f44336"; // 빨강
  };

  // 정착률 클래스 결정
  const getSettlementClass = (rate) => {
    if (rate >= 80) return "high";
    if (rate >= 70) return "medium";
    return "low";
  };

  // 커스텀 마커 아이콘 생성
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // 성공/위험 요인 포맷팅
  const formatFactors = (factors) => {
    if (!factors) return "정보 없음";
    return factors.replace(/_/g, ", ").replace(/,\s*/g, " • ");
  };

  if (!regionData || regionData.length === 0) {
    return (
      <MapContainerStyled>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "#666",
            fontSize: "1.1rem",
          }}
        >
          지도 데이터를 로드하는 중...
        </div>
      </MapContainerStyled>
    );
  }

  // 한국 경계 좌표 (위도, 경도)
  const southWest = L.latLng(32.0, 124.0);
  const northEast = L.latLng(39.0, 132.0);
  const bounds = L.latLngBounds(southWest, northEast);
  const maxBounds = L.latLngBounds(
    L.latLng(32.0, 124.0),
    L.latLng(39.0, 132.0)
  );

  return (
    <MapContainerStyled>
      <MapContainer
        center={[36.5, 127.8]}
        zoom={7}
        minZoom={7}
        maxZoom={12}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
        worldCopyJump={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          bounds={bounds}
          noWrap={true}
        />

        {regionData.map((region, index) => {
          const coordinates = getRegionCoordinates(region.region_name);
          const markerColor = getMarkerColor(region.settlement_rate);
          const customIcon = createCustomIcon(markerColor);

          return (
            <Marker
              key={region.region_code || index}
              position={coordinates}
              icon={customIcon}
            >
              <Popup maxWidth={300}>
                <PopupContent>
                  <div className="region-title">
                    {region.region_name} ({region.region_type})
                  </div>

                  <div className="stat-item">
                    <span className="label">정착률:</span>
                    <span
                      className={`value ${getSettlementClass(region.settlement_rate)}`}
                    >
                      {region.settlement_rate}%
                    </span>
                  </div>

                  <div className="stat-item">
                    <span className="label">중도포기율:</span>
                    <span className="value">{region.dropout_rate}%</span>
                  </div>

                  <div className="stat-item">
                    <span className="label">2023년 청년농업인:</span>
                    <span className="value">{region.youth_farmers_2023}명</span>
                  </div>

                  <div className="stat-item">
                    <span className="label">누적 선정자:</span>
                    <span className="value">
                      {region.cumulative_selected}명
                    </span>
                  </div>

                  {region.success_factors && (
                    <div className="factors">
                      <div className="factor-title">✅ 성공 요인:</div>
                      <div className="factor-content">
                        {formatFactors(region.success_factors)}
                      </div>
                    </div>
                  )}

                  {region.risk_factors && (
                    <div className="factors">
                      <div className="factor-title">⚠️ 위험 요인:</div>
                      <div className="factor-content">
                        {formatFactors(region.risk_factors)}
                      </div>
                    </div>
                  )}

                  {region.specialized_agriculture && (
                    <div className="factors">
                      <div className="factor-title">🌾 특화 농업:</div>
                      <div className="factor-content">
                        {formatFactors(region.specialized_agriculture)}
                      </div>
                    </div>
                  )}
                </PopupContent>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </MapContainerStyled>
  );
};

export default MapComponent;
