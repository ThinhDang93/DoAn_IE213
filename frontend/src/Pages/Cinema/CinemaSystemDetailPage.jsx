import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  LayDanhSachCumRapAPI,
  LayThongTinHeThongRapByIdAPI,
} from "../../API/CinemaAPI";
import ImageGallery from "./ImageGallery";

const googleMapsEmbedSrc = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const CinemaSystemDetailPage = () => {
  const { maHeThongRap } = useParams();
  const [system, setSystem] = useState(null);
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [systemData, complexList] = await Promise.all([
        LayThongTinHeThongRapByIdAPI(maHeThongRap),
        LayDanhSachCumRapAPI(maHeThongRap),
      ]);
      setSystem(systemData);
      setComplexes(complexList);
      setLoading(false);
    };
    load();
  }, [maHeThongRap]);

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6 pt-24">Đang tải...</div>;
  }

  if (!system) {
    return (
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <p className="text-gray-500">Không tìm thấy hệ thống rạp này.</p>
        <NavLink to="/rap" className="text-blue-600 hover:underline">
          &larr; Quay lại danh sách hệ thống rạp
        </NavLink>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <NavLink
        to="/rap"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Tất cả hệ thống rạp
      </NavLink>

      <div className="flex items-center gap-3 mb-2">
        <img
          src={system.logo}
          alt={system.tenHeThongRap}
          className="w-12 h-12 object-contain rounded border"
        />
        <h2 className="text-2xl font-bold">{system.tenHeThongRap}</h2>
      </div>

      {system.namThanhLap && (
        <p className="text-gray-500 mb-4">Thành lập năm {system.namThanhLap}</p>
      )}

      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2">
          <ImageGallery
            images={system.danhSachHinhAnh}
            alt={system.tenHeThongRap}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Giới thiệu</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {system.gioiThieu || "Chưa có thông tin giới thiệu."}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">
        Cụm rạp ({complexes.length})
      </h3>

      {complexes.length === 0 ? (
        <p className="text-gray-500">
          Hệ thống rạp này chưa có cụm rạp nào.
        </p>
      ) : (
        <div className="space-y-8">
          {complexes.map((complex) => (
            <div
              key={complex.maCumRap}
              className="border border-gray-200 rounded-2xl p-4 grid md:grid-cols-2 gap-4"
            >
              <div>
                <ImageGallery
                  images={
                    complex.danhSachHinhAnh?.length
                      ? complex.danhSachHinhAnh
                      : complex.hinhAnh
                      ? [complex.hinhAnh]
                      : []
                  }
                  alt={complex.tenCumRap}
                />
                <h4 className="font-semibold text-lg mt-3">
                  {complex.tenCumRap}
                </h4>
                <p className="text-gray-600 text-sm">{complex.diaChi}</p>
              </div>
              <div className="rounded-lg overflow-hidden border min-h-[220px]">
                <iframe
                  title={`Bản đồ ${complex.tenCumRap}`}
                  src={googleMapsEmbedSrc(complex.diaChi)}
                  className="w-full h-full min-h-[220px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CinemaSystemDetailPage;
