// src/components/KoreaMap.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
// RegionCode, getRegionBysvgId가 실제 프로젝트에 존재한다고 가정
import { RegionCode, getRegionBysvgId } from "../utils/regionCodes";

const KoreaMap: React.FC = () => {
  const [hoveredRegion, setHoveredRegion] = useState<string>("");
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // 1. SVG 로드 로직 (변경 없음)
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(
          // 실제 경로로 변경
          "/Administrative_divisions_map_of_South_Korea.svg"
        );
        if (!response.ok) {
          throw new Error(
            `SVG 파일을 불러오는데 실패했습니다: ${response.statusText}`
          );
        }
        let svgText = await response.text();

        // **핵심 수정:** SVG 문자열에서 'class'를 'className'으로 변경 (React 표준 준수)
        svgText = svgText.replace(/class=["']/g, 'className="');

        setSvgContent(svgText);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading SVG:", error);
        setError(
          "지도를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요."
        );
        setIsLoading(false);
      }
    };
    loadSvg();
  }, []);

  // 2. 호버 이벤트 바인딩 및 SVG 삽입 로직 (핵심 수정 부분)
  useEffect(() => {
    if (isLoading || !svgContent || !svgContainerRef.current) return;

    const container = svgContainerRef.current;

    // 이전 SVG 내용을 비웁니다.
    container.innerHTML = "";

    // 1. SVG 문자열을 파싱하여 DOM 요소로 변환합니다.
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    if (!svgElement || svgElement.tagName.toLowerCase() !== "svg") {
      console.error("Parsed content is not a valid SVG element.");
      return;
    }

    // 2. 파싱된 SVG 요소를 컨테이너에 직접 삽입합니다.
    container.appendChild(svgElement);

    // 3. CSS 스타일 태그 생성 및 삽입 (이전과 동일)
    const styleId = "korea-map-styles";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      /* 모든 path/polygon에 기본 스타일 적용 */
      path, polygon {
        fill: #e5e7eb;                /* 기본색: 연한 회색 */
        stroke: #9ca3af;              /* 경계선 */
        stroke-width: 0.5;
        transition: all 0.2s ease;
        transform-origin: center;
        cursor: default;
        vector-effect: non-scaling-stroke;
      }
      
      /* 호버 효과를 위한 클래스 */
      .region-path {
        cursor: pointer;
        fill: #e5e7eb;
      }

      .region-path {
        transform-origin: center;
        transition: transform 0.2s ease, fill 0.2s ease;
      }

      .region-path:hover {
        fill: #9ca3af !important;     /* 호버 시 약간 더 진한 회색 */
        filter: drop-shadow(0 0 3px rgba(0,0,0,0.2));
        transform: scale(1.02);       /* 2% 확대 효과 */
        z-index: 10;
        position: relative;
      }
  
      /* g 태그 스타일 */
      g {
        fill: none;
      }
    `;

    // 4. SVG 기본 설정 (이전과 동일)
    svgElement.style.width = "100%";
    svgElement.style.height = "auto";
    svgElement.style.display = "block";
    svgElement.style.overflow = "visible";
    if (!svgElement.getAttribute("viewBox")) {
      svgElement.setAttribute("viewBox", "0 0 509 716.1");
    }

    // 5. 이벤트 바인딩 로직
    const elementsToProcess = svgElement.querySelectorAll<
      SVGPathElement | SVGPolygonElement | SVGGElement
    >("path, polygon, g");

    const cleanupFunctions: (() => void)[] = [];

    elementsToProcess.forEach((element) => {
      const id = element.id;
      if (!id) return;

      const region = getRegionBysvgId(id);
      if (!region) return;

      // 유효한 지역에만 클래스를 추가
      element.classList.add("region-path");

      const onMouseEnter = () => {
        setHoveredRegion(region.name);
      };

      const onMouseLeave = () => {
        setHoveredRegion("");
      };

      const onClick = () => {
        console.log(`지역 코드: ${region.code}, 지역명: ${region.name}`);
      };

      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mouseleave", onMouseLeave);
      element.addEventListener("click", onClick);

      cleanupFunctions.push(() => {
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
        element.removeEventListener("click", onClick);
        // 클래스는 컨테이너가 비워지면서 자동 제거됨
      });
    });

    // 6. 클린업 함수: 이벤트 리스너 제거 및 DOM 비우기
    return () => {
      cleanupFunctions.forEach((func) => func());
      if (styleTag && styleTag.parentNode) {
        styleTag.parentNode.removeChild(styleTag);
      }
      // SVG 요소를 DOM에서 제거하여 메모리 누수를 방지합니다.
      if (svgElement.parentNode) {
        svgElement.parentNode.removeChild(svgElement);
      }
    };
  }, [isLoading, svgContent]); // svgContent가 변경될 때마다 다시 실행

  if (isLoading) {
    // ... (로딩 컴포넌트)
  }

  if (error) {
    // ... (에러 컴포넌트)
  }

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full max-w-4xl">
        {/* dangerouslySetInnerHTML 대신, svgContainerRef를 사용하여 직접 DOM 조작 */}
        <div ref={svgContainerRef} className="w-full h-auto min-h-[500px]" />
      </div>
    </div>
  );
};

export default KoreaMap;
