import React, { useEffect, useState } from "react";
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

  if (loading) {
    return <div className="max-w-5xl mx-auto p-6 pt-24">Đang tải...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pt-24">
      <h2 className="text-2xl font-bold mb-6">Hệ thống rạp</h2>

      {systems.length === 0 && (
        <p className="text-gray-500">Chưa có hệ thống rạp nào.</p>
      )}

      <div className="space-y-8">
        {systems.map((system) => {
          const cumRapCuaHeThong = complexes.filter(
            (c) => c.maHeThongRap === system.maHeThongRap
          );

          return (
            <div key={system.maHeThongRap} className="border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={system.logo}
                  alt={system.tenHeThongRap}
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-xl font-semibold">
                  {system.tenHeThongRap}
                </h3>
              </div>

              {cumRapCuaHeThong.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Chưa có cụm rạp nào.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cumRapCuaHeThong.map((complex) => (
                    <div
                      key={complex.maCumRap}
                      className="flex gap-3 border rounded-lg p-3"
                    >
                      {complex.hinhAnh && (
                        <img
                          src={complex.hinhAnh}
                          alt={complex.tenCumRap}
                          className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-medium">{complex.tenCumRap}</p>
                        <p className="text-sm text-gray-600">
                          {complex.diaChi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CinemaListPage;
