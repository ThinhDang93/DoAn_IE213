import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayDanhSachCumRapAPI,
  LayDanhSachHeThongRapAPI,
} from "../../API/CinemaAPI";

const CinemaListPage = () => {
  const [systems, setSystems] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [systemList, complexList] = await Promise.all([
        LayDanhSachHeThongRapAPI(),
        LayDanhSachCumRapAPI(),
      ]);
      setSystems(systemList);
      setComplexes(complexList);
      setLoading(false);
    };
    load();
  }, []);

  const soCumRapCua = (maHeThongRap) =>
    complexes.filter((c) => c.maHeThongRap === maHeThongRap).length;

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6 pt-24">Đang tải...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <h2 className="text-2xl font-bold mb-2">Hệ thống rạp</h2>
      <p className="text-gray-500 mb-6">
        Chọn một hệ thống rạp để xem danh sách cụm rạp và địa chỉ chi tiết.
      </p>

      {systems.length === 0 && (
        <p className="text-gray-500">Chưa có hệ thống rạp nào.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => {
          const previewImage =
            system.danhSachHinhAnh?.[0] || system.logo || "";
          const soCumRap = soCumRapCua(system.maHeThongRap);

          return (
            <NavLink
              key={system.maHeThongRap}
              to={`/rap/${system.maHeThongRap}`}
              className="group border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white flex flex-col"
            >
              <div className="aspect-video bg-gray-100 overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={system.tenHeThongRap}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Chưa có hình ảnh
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <img
                    src={system.logo}
                    alt=""
                    className="w-8 h-8 object-contain rounded border shrink-0"
                  />
                  <h3 className="text-lg font-semibold group-hover:text-blue-700 transition">
                    {system.tenHeThongRap}
                  </h3>
                </div>

                {system.gioiThieu && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {system.gioiThieu}
                  </p>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                  {system.namThanhLap ? (
                    <span>Thành lập {system.namThanhLap}</span>
                  ) : (
                    <span />
                  )}
                  <span className="font-medium text-blue-700">
                    {soCumRap} cụm rạp
                  </span>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default CinemaListPage;
