"use client";

import { useState } from "react";
import KoreaMap from "@/components/KoreaMap";

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<string>("");

  // 주요 도시 목록
  const cities = [
    { id: "11", name: "서울특별시" },
    { id: "26", name: "부산광역시" },
    { id: "27", name: "대구광역시" },
    { id: "28", name: "인천광역시" },
    { id: "29", name: "광주광역시" },
    { id: "30", name: "대전광역시" },
    { id: "31", name: "울산광역시" },
    { id: "36", name: "세종특별자치시" },
    { id: "41", name: "경기도" },
    { id: "42", name: "강원도" },
    { id: "43", name: "충청북도" },
    { id: "44", name: "충청남도" },
    { id: "45", name: "전라북도" },
    { id: "46", name: "전라남도" },
    { id: "47", name: "경상북도" },
    { id: "48", name: "경상남도" },
    { id: "50", name: "제주특별자치도" },
  ];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">스마트팜 통합 대시보드</h1>
      
      <div className="mb-6">
        <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
          시/도 선택
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">전체 보기</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <KoreaMap selectedCity={selectedCity} />
      </div>
    </div>
  );
}
