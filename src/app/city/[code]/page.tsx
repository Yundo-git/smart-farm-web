"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { regionCodes } from '@/utils/regionCodes';

export default function CityPage() {
  const params = useParams();
  const router = useRouter();
  const [regionData, setRegionData] = useState<{
    fullName: string;
    city: string;
    district: string;
    code: string;
  } | null>(null);

  useEffect(() => {
    // Extract city code from URL
    const cityCode = Array.isArray(params.code) ? params.code[0] : params.code || '';
    
    // Find the city data in regionCodes
    const region = regionCodes.find(region => 
      region.code.startsWith(cityCode)
    );

    if (region) {
      const [city, ...districtParts] = region.name.split(' ');
      const district = districtParts.join(' ');
      
      setRegionData({
        fullName: region.name,
        city,
        district,
        code: region.code
      });
    } else {
      // Redirect to home if city not found
      router.push('/');
    }
  }, [params.code, router]);

  if (!regionData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          지도로 돌아가기
        </button>
        <h1 className="text-3xl font-bold">{regionData.fullName}</h1>
        <p className="text-gray-600">스마트팜 현황</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">지역 정보</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700">기본 정보</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">시/도</p>
                <p className="font-medium">{regionData.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">시/군/구</p>
                <p className="font-medium">{regionData.district}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">전체 지역명</p>
                <p className="font-medium">{regionData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">지역 코드</p>
                <p className="font-mono">{regionData.code}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700">스마트팜 현황</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">총 스마트팜 수</p>
                  <p className="text-sm text-gray-500">등록된 스마트팜 시설</p>
                </div>
                <span className="text-2xl font-bold">-</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">최근 업데이트</p>
                  <p className="text-sm text-gray-500">마지막 데이터 수집 일시</p>
                </div>
                <span className="text-gray-600">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>  
        {/* Placeholder for future content */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">지역별 상세 정보</h3>
          <p className="text-gray-600">{regionData.fullName}의 상세한 스마트팜 정보가 제공될 예정입니다.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">작물 현황</h4>
              <p className="text-sm text-gray-500 mt-1">주요 재배 작물 정보</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">시설 현황</h4>
              <p className="text-sm text-gray-500 mt-1">스마트팜 시설 정보</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">데이터 분석</h4>
              <p className="text-sm text-gray-500 mt-1">생산성 분석</p>
            </div>
          </div>
        </div>
    </div>
  );
}