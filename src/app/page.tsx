"use client";

import KoreaMap from "@/components/KoreaMap";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">스마트팜 통합 대시보드</h1>
      <div className="bg-white h-[80dvh] rounded-lg shadow-lg overflow-y-auto">
        <KoreaMap />
      </div>
    </div>
  );
}
