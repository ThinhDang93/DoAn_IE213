import React, { useEffect, useState } from "react";
import {
  CapNhatCumRapAPI,
  CapNhatHeThongRapAPI,
  CapNhatRapAPI,
  LayDanhSachCumRapAPI,
  LayDanhSachHeThongRapAPI,
  LayDanhSachRapAPI,
  ThemCumRapAPI,
  ThemHeThongRapAPI,
  ThemRapAPI,
  XoaCumRapAPI,
  XoaHeThongRapAPI,
  XoaRapAPI,
} from "../../../API/CinemaAPI";

const emptySystemForm = { tenHeThongRap: "", logo: "" };
const emptyComplexForm = { tenCumRap: "", diaChi: "", hinhAnh: "", maHeThongRap: "" };
const emptyRoomForm = { tenRap: "", maCumRap: "", soLuongGhe: "" };

const btnPrimary =
  "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
const btnGreen =
  "text-green-700 hover:text-white border-2 border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5";
const btnRed =
  "text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5";

const CinemaManager = () => {
  const [systems, setSystems] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [systemForm, setSystemForm] = useState(emptySystemForm);
  const [editingSystem, setEditingSystem] = useState(null);

  const [complexForm, setComplexForm] = useState(emptyComplexForm);
  const [editingComplex, setEditingComplex] = useState(null);

  const [roomForm, setRoomForm] = useState(emptyRoomForm);
  const [editingRoom, setEditingRoom] = useState(null);

  const loadAll = async () => {
    const [s, c, r] = await Promise.all([
      LayDanhSachHeThongRapAPI(),
      LayDanhSachCumRapAPI(),
      LayDanhSachRapAPI(),
    ]);
    setSystems(s);
    setComplexes(c);
    setRooms(r);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // --- He thong rap ---
  const submitSystem = async (e) => {
    e.preventDefault();
    try {
      if (editingSystem) {
        await CapNhatHeThongRapAPI(editingSystem, systemForm);
      } else {
        await ThemHeThongRapAPI(systemForm);
      }
      setSystemForm(emptySystemForm);
      setEditingSystem(null);
      await loadAll();
    } catch (error) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const editSystem = (s) => {
    setEditingSystem(s.maHeThongRap);
    setSystemForm({ tenHeThongRap: s.tenHeThongRap, logo: s.logo });
  };

  const deleteSystem = async (maHeThongRap) => {
    if (!window.confirm("Xoá hệ thống rạp này?")) return;
    try {
      await XoaHeThongRapAPI(maHeThongRap);
      await loadAll();
    } catch (error) {
      alert(error?.response?.data?.message || "Không thể xoá");
    }
  };

  // --- Cum rap ---
  const submitComplex = async (e) => {
    e.preventDefault();
    try {
      if (editingComplex) {
        await CapNhatCumRapAPI(editingComplex, complexForm);
      } else {
        await ThemCumRapAPI(complexForm);
      }
      setComplexForm(emptyComplexForm);
      setEditingComplex(null);
      await loadAll();
    } catch (error) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const editComplex = (c) => {
    setEditingComplex(c.maCumRap);
    setComplexForm({
      tenCumRap: c.tenCumRap,
      diaChi: c.diaChi,
      hinhAnh: c.hinhAnh,
      maHeThongRap: c.maHeThongRap,
    });
  };

  const deleteComplex = async (maCumRap) => {
    if (!window.confirm("Xoá cụm rạp này?")) return;
    try {
      await XoaCumRapAPI(maCumRap);
      await loadAll();
    } catch (error) {
      alert(error?.response?.data?.message || "Không thể xoá");
    }
  };

  // --- Rap (phong chieu) ---
  const submitRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...roomForm, soLuongGhe: Number(roomForm.soLuongGhe) };
      if (editingRoom) {
        await CapNhatRapAPI(editingRoom, payload);
      } else {
        await ThemRapAPI(payload);
      }
      setRoomForm(emptyRoomForm);
      setEditingRoom(null);
      await loadAll();
    } catch (error) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const editRoom = (r) => {
    setEditingRoom(r.maRap);
    setRoomForm({
      tenRap: r.tenRap,
      maCumRap: r.maCumRap,
      soLuongGhe: r.soLuongGhe,
    });
  };

  const deleteRoom = async (maRap) => {
    if (!window.confirm("Xoá phòng chiếu này?")) return;
    try {
      await XoaRapAPI(maRap);
      await loadAll();
    } catch (error) {
      alert(error?.response?.data?.message || "Không thể xoá");
    }
  };

  const tenHeThongRapOf = (maHeThongRap) =>
    systems.find((s) => s.maHeThongRap === maHeThongRap)?.tenHeThongRap || "";
  const tenCumRapOf = (maCumRap) =>
    complexes.find((c) => c.maCumRap === maCumRap)?.tenCumRap || "";

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold">Quản lý rạp chiếu</h2>

      {/* HE THONG RAP */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Hệ thống rạp</h3>
        <form onSubmit={submitSystem} className="flex flex-wrap gap-2 mb-4">
          <input
            placeholder="Tên hệ thống rạp"
            value={systemForm.tenHeThongRap}
            onChange={(e) =>
              setSystemForm({ ...systemForm, tenHeThongRap: e.target.value })
            }
            className="border rounded-lg p-2 flex-1 min-w-48"
            required
          />
          <input
            placeholder="URL logo"
            value={systemForm.logo}
            onChange={(e) =>
              setSystemForm({ ...systemForm, logo: e.target.value })
            }
            className="border rounded-lg p-2 flex-1 min-w-48"
            required
          />
          <button type="submit" className={btnPrimary}>
            {editingSystem ? "Cập nhật" : "+ Thêm"}
          </button>
          {editingSystem && (
            <button
              type="button"
              className="text-gray-600 underline"
              onClick={() => {
                setEditingSystem(null);
                setSystemForm(emptySystemForm);
              }}
            >
              Huỷ sửa
            </button>
          )}
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border rounded-lg">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Logo</th>
                <th className="px-4 py-2">Tên hệ thống rạp</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((s) => (
                <tr key={s.maHeThongRap} className="border-b">
                  <td className="px-4 py-2">
                    <img src={s.logo} alt={s.tenHeThongRap} className="w-10 h-10 object-contain" />
                  </td>
                  <td className="px-4 py-2">{s.tenHeThongRap}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className={btnGreen} onClick={() => editSystem(s)}>
                      Sửa
                    </button>
                    <button
                      className={btnRed}
                      onClick={() => deleteSystem(s.maHeThongRap)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CUM RAP */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Cụm rạp</h3>
        <form onSubmit={submitComplex} className="flex flex-wrap gap-2 mb-4">
          <input
            placeholder="Tên cụm rạp"
            value={complexForm.tenCumRap}
            onChange={(e) =>
              setComplexForm({ ...complexForm, tenCumRap: e.target.value })
            }
            className="border rounded-lg p-2 flex-1 min-w-40"
            required
          />
          <input
            placeholder="Địa chỉ"
            value={complexForm.diaChi}
            onChange={(e) =>
              setComplexForm({ ...complexForm, diaChi: e.target.value })
            }
            className="border rounded-lg p-2 flex-1 min-w-40"
            required
          />
          <input
            placeholder="URL hình ảnh"
            value={complexForm.hinhAnh}
            onChange={(e) =>
              setComplexForm({ ...complexForm, hinhAnh: e.target.value })
            }
            className="border rounded-lg p-2 flex-1 min-w-40"
          />
          <select
            value={complexForm.maHeThongRap}
            onChange={(e) =>
              setComplexForm({ ...complexForm, maHeThongRap: e.target.value })
            }
            className="border rounded-lg p-2"
            required
          >
            <option value="">-- Hệ thống rạp --</option>
            {systems.map((s) => (
              <option key={s.maHeThongRap} value={s.maHeThongRap}>
                {s.tenHeThongRap}
              </option>
            ))}
          </select>
          <button type="submit" className={btnPrimary}>
            {editingComplex ? "Cập nhật" : "+ Thêm"}
          </button>
          {editingComplex && (
            <button
              type="button"
              className="text-gray-600 underline"
              onClick={() => {
                setEditingComplex(null);
                setComplexForm(emptyComplexForm);
              }}
            >
              Huỷ sửa
            </button>
          )}
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border rounded-lg">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Tên cụm rạp</th>
                <th className="px-4 py-2">Địa chỉ</th>
                <th className="px-4 py-2">Hệ thống rạp</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {complexes.map((c) => (
                <tr key={c.maCumRap} className="border-b">
                  <td className="px-4 py-2">{c.tenCumRap}</td>
                  <td className="px-4 py-2">{c.diaChi}</td>
                  <td className="px-4 py-2">{tenHeThongRapOf(c.maHeThongRap)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className={btnGreen} onClick={() => editComplex(c)}>
                      Sửa
                    </button>
                    <button
                      className={btnRed}
                      onClick={() => deleteComplex(c.maCumRap)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PHONG CHIEU */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Phòng chiếu</h3>
        <form onSubmit={submitRoom} className="flex flex-wrap gap-2 mb-4">
          <input
            placeholder="Tên phòng chiếu"
            value={roomForm.tenRap}
            onChange={(e) => setRoomForm({ ...roomForm, tenRap: e.target.value })}
            className="border rounded-lg p-2 flex-1 min-w-40"
            required
          />
          <select
            value={roomForm.maCumRap}
            onChange={(e) =>
              setRoomForm({ ...roomForm, maCumRap: e.target.value })
            }
            className="border rounded-lg p-2"
            required
          >
            <option value="">-- Cụm rạp --</option>
            {complexes.map((c) => (
              <option key={c.maCumRap} value={c.maCumRap}>
                {c.tenCumRap}
              </option>
            ))}
          </select>
          <input
            placeholder="Số lượng ghế"
            type="number"
            min="1"
            value={roomForm.soLuongGhe}
            onChange={(e) =>
              setRoomForm({ ...roomForm, soLuongGhe: e.target.value })
            }
            className="border rounded-lg p-2 w-40"
            required
          />
          <button type="submit" className={btnPrimary}>
            {editingRoom ? "Cập nhật" : "+ Thêm"}
          </button>
          {editingRoom && (
            <button
              type="button"
              className="text-gray-600 underline"
              onClick={() => {
                setEditingRoom(null);
                setRoomForm(emptyRoomForm);
              }}
            >
              Huỷ sửa
            </button>
          )}
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border rounded-lg">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Tên phòng chiếu</th>
                <th className="px-4 py-2">Cụm rạp</th>
                <th className="px-4 py-2">Số lượng ghế</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.maRap} className="border-b">
                  <td className="px-4 py-2">{r.tenRap}</td>
                  <td className="px-4 py-2">{tenCumRapOf(r.maCumRap)}</td>
                  <td className="px-4 py-2">{r.soLuongGhe}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className={btnGreen} onClick={() => editRoom(r)}>
                      Sửa
                    </button>
                    <button className={btnRed} onClick={() => deleteRoom(r.maRap)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CinemaManager;
