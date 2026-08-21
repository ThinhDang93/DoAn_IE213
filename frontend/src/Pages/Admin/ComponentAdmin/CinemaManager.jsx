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

const emptySystemForm = {
  tenHeThongRap: "",
  logo: "",
  gioiThieu: "",
  namThanhLap: "",
};
const emptyComplexForm = { tenCumRap: "", diaChi: "", hinhAnh: "", maHeThongRap: "" };
const emptyRoomForm = { tenRap: "", maCumRap: "", soLuongGhe: "" };

const btnPrimary =
  "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
const btnGreen =
  "text-green-700 hover:text-white border-2 border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5";
const btnRed =
  "text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5";

const getPreviewUrl = (value) => {
  if (!value) return "";
  if (value instanceof File) return URL.createObjectURL(value);
  return value;
};

const CinemaManager = () => {
  const [systems, setSystems] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [systemForm, setSystemForm] = useState(emptySystemForm);
  const [editingSystem, setEditingSystem] = useState(null);
  const [systemGalleryFiles, setSystemGalleryFiles] = useState([]);
  const [systemExistingGallery, setSystemExistingGallery] = useState([]);

  const [complexForm, setComplexForm] = useState(emptyComplexForm);
  const [editingComplex, setEditingComplex] = useState(null);
  const [complexGalleryFiles, setComplexGalleryFiles] = useState([]);
  const [complexExistingGallery, setComplexExistingGallery] = useState([]);

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
      const payload = { ...systemForm, galleryFiles: systemGalleryFiles };
      if (editingSystem) {
        payload.keptGalleryUrls = systemExistingGallery;
        await CapNhatHeThongRapAPI(editingSystem, payload);
      } else {
        await ThemHeThongRapAPI(payload);
      }
      setSystemForm(emptySystemForm);
      setSystemGalleryFiles([]);
      setSystemExistingGallery([]);
      setEditingSystem(null);
      await loadAll();
    } catch (error) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const editSystem = (s) => {
    setEditingSystem(s.maHeThongRap);
    setSystemForm({
      tenHeThongRap: s.tenHeThongRap,
      logo: s.logo,
      gioiThieu: s.gioiThieu || "",
      namThanhLap: s.namThanhLap || "",
    });
    setSystemGalleryFiles([]);
    setSystemExistingGallery(s.danhSachHinhAnh || []);
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
      const payload = { ...complexForm, galleryFiles: complexGalleryFiles };
      if (editingComplex) {
        payload.keptGalleryUrls = complexExistingGallery;
        await CapNhatCumRapAPI(editingComplex, payload);
      } else {
        await ThemCumRapAPI(payload);
      }
      setComplexForm(emptyComplexForm);
      setComplexGalleryFiles([]);
      setComplexExistingGallery([]);
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
    setComplexGalleryFiles([]);
    setComplexExistingGallery(c.danhSachHinhAnh || []);
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
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSystemForm({ ...systemForm, logo: e.target.files[0] })
              }
              className="border rounded-lg p-2 flex-1"
              required={!editingSystem}
            />
            {systemForm.logo && (
              <img
                src={getPreviewUrl(systemForm.logo)}
                alt="preview"
                className="w-10 h-10 object-contain border rounded shrink-0"
              />
            )}
          </div>
          <textarea
            placeholder="Giới thiệu hệ thống rạp"
            value={systemForm.gioiThieu}
            onChange={(e) =>
              setSystemForm({ ...systemForm, gioiThieu: e.target.value })
            }
            className="border rounded-lg p-2 w-full min-w-64"
            rows={2}
          />
          <input
            placeholder="Năm thành lập"
            type="number"
            value={systemForm.namThanhLap}
            onChange={(e) =>
              setSystemForm({ ...systemForm, namThanhLap: e.target.value })
            }
            className="border rounded-lg p-2 w-40"
          />
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Ảnh gallery (chọn nhiều)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setSystemGalleryFiles(Array.from(e.target.files))
              }
              className="border rounded-lg p-2 w-full"
            />
            {(systemExistingGallery.length > 0 ||
              systemGalleryFiles.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {systemExistingGallery.map((url, idx) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="w-16 h-16 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSystemExistingGallery(
                          systemExistingGallery.filter((_, i) => i !== idx)
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs leading-5"
                      title="Xoá ảnh này"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {systemGalleryFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={getPreviewUrl(file)}
                    alt=""
                    className="w-16 h-16 object-cover border-2 border-blue-400 rounded"
                  />
                ))}
              </div>
            )}
          </div>
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
                setSystemGalleryFiles([]);
                setSystemExistingGallery([]);
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
          <div className="flex items-center gap-2 flex-1 min-w-40">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setComplexForm({ ...complexForm, hinhAnh: e.target.files[0] })
              }
              className="border rounded-lg p-2 flex-1"
            />
            {complexForm.hinhAnh && (
              <img
                src={getPreviewUrl(complexForm.hinhAnh)}
                alt="preview"
                className="w-10 h-10 object-contain border rounded shrink-0"
              />
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Ảnh gallery (chọn nhiều)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setComplexGalleryFiles(Array.from(e.target.files))
              }
              className="border rounded-lg p-2 w-full"
            />
            {(complexExistingGallery.length > 0 ||
              complexGalleryFiles.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {complexExistingGallery.map((url, idx) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="w-16 h-16 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setComplexExistingGallery(
                          complexExistingGallery.filter((_, i) => i !== idx)
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs leading-5"
                      title="Xoá ảnh này"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {complexGalleryFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={getPreviewUrl(file)}
                    alt=""
                    className="w-16 h-16 object-cover border-2 border-blue-400 rounded"
                  />
                ))}
              </div>
            )}
          </div>
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
                setComplexGalleryFiles([]);
                setComplexExistingGallery([]);
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
