// src/components/KoreaMap.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { zoom, zoomIdentity, ZoomBehavior, D3ZoomEvent } from "d3-zoom";
import { select, Selection } from "d3-selection";
import "d3-transition";

type D3Zoom = ZoomBehavior<SVGSVGElement, unknown>;
// Import region codes and types
import {
  RegionCode,
  getRegionBysvgId,
  regionCodes,
} from "../utils/regionCodes";

// Get unique cities from region codes
const getUniqueCities = () => {
  const cities = new Set<string>();
  regionCodes.forEach((region: RegionCode) => {
    const city = region.name.split(" ")[0]; // Extract city name (first part)
    cities.add(city);
  });
  return Array.from(cities).sort();
};

const KoreaMap: React.FC = () => {
  // --- Hooks 1-11: useState, useRef ---
  const [hoveredRegion, setHoveredRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [scale, setScale] = useState<number>(1);
  const [cities, setCities] = useState<string[]>([]);

  // Initialize cities from region codes
  useEffect(() => {
    setCities(getUniqueCities());
  }, []);
  const zoomBehaviorRef = useRef<D3Zoom | null>(null);

  // --- Hook 12: SVG 로드 로직 ---
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(
          "/Administrative_divisions_map_of_South_Korea.svg"
        );
        if (!response.ok) {
          throw new Error(
            `SVG 파일을 불러오는데 실패했습니다: ${response.statusText}`
          );
        }
        let svgText = await response.text();
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

  // --- Hook 13: 호버/클릭 이벤트 바인딩 및 SVG 삽입 로직 ---
  useEffect(() => {
    if (isLoading || !svgContent || !svgContainerRef.current) return;

    const container = svgContainerRef.current;
    if (!container) return;

    // Clear the container
    container.innerHTML = "";

    // 2. Parse the SVG string to DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    if (!svgElement || svgElement.tagName.toLowerCase() !== "svg") {
      console.error("Parsed content is not a valid SVG element.");
      return;
    }

    // 3. Create a new SVG element with proper attributes
    const newSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    // Copy attributes from the original SVG
    Array.from(svgElement.attributes).forEach((attr) => {
      newSvg.setAttribute(attr.name, attr.value);
    });

    // Ensure viewBox is set
    if (!newSvg.getAttribute("viewBox")) {
      newSvg.setAttribute("viewBox", "0 0 1000 1200");
    }

    // Set necessary attributes
    newSvg.setAttribute("width", "100%");
    newSvg.setAttribute("height", "100%");
    newSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Create a group for the map content
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.classList.add("map-container");

    // 3. CSS 스타일 태그 생성 및 삽입
    const styleId = "korea-map-styles";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    // 광역자치단체 경계를 굵게 강조하도록 stroke-width를 3px로 수정
    styleTag.textContent = `
      /* 모든 path/polygon에 기본 스타일 적용 */
      path, polygon {
        fill: #e5e7eb;                /* 기본색: 연한 회색 */
        stroke: #9ca3af;              /* 기본 경계선 색상 (시/군/구 경계) */
        stroke-width: 0.5;            /* 시/군/구 경계 두께 */
        transition: all 0.2s ease;
        transform-origin: center;
        cursor: default;
        vector-effect: non-scaling-stroke;
      }
      
      /* 특별시/광역시/도/특별자치도 경계선 스타일 (대분류 강조) */
      path[data-province="true"], polygon[data-province="true"] {
        stroke: #1f2937 !important;    /* 진한 회색 경계선 */
        stroke-width: 3px !important;  /* **굵게 설정 (강조)** */
        stroke-linejoin: round;        
        stroke-linecap: round;         
        vector-effect: non-scaling-stroke; 
        z-index: 5; 
      }
      
      /* 호버 효과를 위한 클래스 */
      .region-path {
        cursor: pointer;
        fill: #e5e7eb;
        position: relative;
      }

      .region-path:hover {
        fill: #9ca3af !important;
        filter: drop-shadow(0 0 3px rgba(0,0,0,0.2));
        transform: scale(1.02);
        z-index: 10;
      }
      
      /* 툴팁 스타일 */
      .region-path::after {
        content: attr(data-name);
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      
      .region-path:hover::after {
        opacity: 1;
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

    // 5. Process and move all child elements to the group
    while (svgElement.firstChild) {
      const child = svgElement.firstChild as Element;

      // Check if this is a path or polygon element with an ID
      if (
        (child.tagName === "path" || child.tagName === "polygon") &&
        child.id
      ) {
        // Get the region data
        const region = getRegionBysvgId(child.id);
        if (region) {
          // **수정된 광역자치단체 목록 (도 및 특별자치도 추가)**
          const majorAdministrativeUnits = [
            "서울특별시",
            "부산광역시",
            "대구광역시",
            "인천광역시",
            "광주광역시",
            "대전광역시",
            "울산광역시",
            "세종특별자치시",
            "제주특별자치도",
            "경기도",
            "강원특별자치도",
            "충청북도",
            "충청남도",
            "전북특별자치도",
            "전라남도",
            "경상북도",
            "경상남도",
          ];

          // Check if this is a major administrative unit
          if (majorAdministrativeUnits.includes(region.name)) {
            child.setAttribute("data-province", "true");
          } else {
            child.setAttribute("data-province", "false");
          }
        }
      }

      g.appendChild(child);
    }

    // 6. Append group to SVG and SVG to container
    newSvg.appendChild(g);
    container.appendChild(newSvg);

    // 7. Set the ref to the new SVG element
    if (svgRef.current === null) {
      // @ts-ignore
      svgRef.current = newSvg;
    }

    // 8. Now that the SVG is in the DOM, set up event listeners
    const elementsToProcess =
      g.querySelectorAll<SVGGraphicsElement>("path, polygon, g");
    const cleanupFunctions: (() => void)[] = [];

    let currentHoveredElement: HTMLElement | null = null;

    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const regionName = target.getAttribute("data-name");
      if (regionName) {
        setHoveredRegion(regionName);
        target.style.zIndex = "10";
        currentHoveredElement = target;
      }
    };

    const handleMouseLeave = () => {
      if (currentHoveredElement) {
        currentHoveredElement.style.zIndex = "";
        currentHoveredElement = null;
      }
      setHoveredRegion("");
    };

    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      const regionId = target.id;
      if (!regionId) return;

      const region = getRegionBysvgId(regionId);
      if (!region) return;

      const cityCode = region.code.substring(0, 2);
      window.location.href = `/city/${cityCode}`;
    };

    elementsToProcess.forEach((element) => {
      const id = element.id;
      if (!id) return;

      const region = getRegionBysvgId(id);
      if (!region) return;

      // Add class and data attributes to valid regions
      element.classList.add("region-path");
      element.setAttribute("data-name", region.name);
      element.style.cursor = "pointer";

      // Add event listeners
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      element.addEventListener("click", handleClick);

      // Store cleanup function
      cleanupFunctions.push(() => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
        element.removeEventListener("click", handleClick);
      });
    });

    return () => {
      cleanupFunctions.forEach((func) => func());
      if (styleTag && styleTag.parentNode) {
        styleTag.parentNode.removeChild(styleTag);
      }
      if (svgElement.parentNode) {
        svgElement.parentNode.removeChild(svgElement);
      }
    };
  }, [isLoading, svgContent]);

  // --- Hook 14: useCallback (zoomToCity) - 조건부 렌더링 위로 이동 ---
  const zoomToCity = useCallback(
    (cityName: string) => {
      if (
        !svgRef.current ||
        !svgContainerRef.current ||
        !zoomBehaviorRef.current
      )
        return;

      const svgElement = svgRef.current;
      const container = svgContainerRef.current;
      const targetElement = Array.from(
        svgElement.querySelectorAll<SVGGraphicsElement>("path, polygon, g")
      ).find((el) => {
        const regionName = el.getAttribute("data-name");
        return regionName && regionName.includes(cityName);
      });

      if (!targetElement) return;

      const svg = select<SVGSVGElement, unknown>(svgRef.current);
      const g = svg.select<SVGGElement>("g.map-container");

      const bbox = targetElement.getBBox();
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scale = Math.min(
        (containerWidth * 0.8) / bbox.width,
        (containerHeight * 0.8) / bbox.height,
        5
      );

      const x = containerWidth / 2 - (bbox.x + bbox.width / 2) * scale;
      const y = containerHeight / 2 - (bbox.y + bbox.height / 2) * scale;

      const transform = zoomIdentity.translate(x, y).scale(scale);

      // @ts-ignore - D3 transition requires type assertion
      svg
        .transition()
        .duration(750)
        .call(zoomBehaviorRef.current!.transform, transform);
    },
    [svgRef, svgContainerRef]
  );

  // Handle city selection change (Hook이 아니므로 위치는 자유)
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) {
      zoomToCity(city);
    }
  };

  // --- Hook 15: Zoom and pan functionality - 조건부 렌더링 위로 이동 ---
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select<SVGSVGElement, unknown>(svgRef.current);
    const g = svg.select<SVGGElement>("g.map-container");

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { transform } = event;
        setScale(transform.k);
        g.attr(
          "transform",
          `translate(${transform.x},${transform.y})scale(${transform.k})`
        );
      });

    zoomBehaviorRef.current = zoomBehavior;

    // @ts-ignore - D3 call requires type assertion
    svg.call(zoomBehavior as any);
    // @ts-ignore - D3 call requires type assertion
    svg.call(zoomBehavior.transform as any, zoomIdentity);

    // Disable double-click zoom
    svg.on("dblclick.zoom", null);

    return () => {
      if (svgRef.current) {
        select(svgRef.current).on(".zoom", null);
      }
    };
  }, [svgContent]);

  // -------------------------------------------------------------------
  // --- 조건부 렌더링 (Hooks는 이 위에서 모두 호출되어야 함) ---
  // -------------------------------------------------------------------

  if (isLoading) {
    return <div className="text-center p-8">지도 로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div style={{ height: "600px" }}>
      <div className="w-full max-w-4xl mb-4 px-4">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">전체 보기</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {hoveredRegion && (
        <div className="bg-white p-2 rounded shadow-lg mb-2">
          {hoveredRegion}
        </div>
      )}

      <div
        className="bg-white w-full h-full max-w-4xl relative overflow-hidden"
        style={{ height: "100%" }}
      >
        <div
          ref={svgContainerRef}
          className="w-full h-full cursor-move"
          style={{ height: "100%", minHeight: "500px" }}
        />
      </div>
    </div>
  );
};

export default KoreaMap;
