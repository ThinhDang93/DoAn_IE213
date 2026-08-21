import React from "react";

// Danh sach tin tuc tinh - chua co backend rieng cho phan nay (quyet dinh
// giu don gian vi link that se duoc cung cap sau). Khi co link/anh/tieu de
// that, chi can sua truc tiep mang duoi day roi deploy lai, khong can doi
// component hay them API.
const TIN_TUC = [
  {
    id: 1,
    tieuDe: "Lịch khởi chiếu phim bom tấn tháng này",
    moTa: "Tổng hợp các phim đáng chú ý sắp ra rạp, cập nhật liên tục.",
    hinhAnh: "https://placehold.co/640x360/png?text=Tin+tuc+1",
    link: "#",
  },
  {
    id: 2,
    tieuDe: "Ưu đãi thành viên tháng này",
    moTa: "Các chương trình khuyến mãi, giảm giá vé và bắp nước dành riêng cho thành viên.",
    hinhAnh: "https://placehold.co/640x360/png?text=Tin+tuc+2",
    link: "#",
  },
  {
    id: 3,
    tieuDe: "Hậu trường sản xuất phim nổi bật",
    moTa: "Góc nhìn phía sau cánh gà của những bộ phim đang gây sốt phòng vé.",
    hinhAnh: "https://placehold.co/640x360/png?text=Tin+tuc+3",
    link: "#",
  },
];

const NewsPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <h2 className="text-2xl font-bold mb-2">Tin tức</h2>
      <p className="text-gray-500 mb-6">
        Những tin tức điện ảnh nổi bật, cập nhật thường xuyên.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TIN_TUC.map((tin) => (
          <a
            key={tin.id}
            href={tin.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white flex flex-col"
          >
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={tin.hinhAnh}
                alt={tin.tieuDe}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="font-semibold text-lg group-hover:text-blue-700 transition line-clamp-2">
                {tin.tieuDe}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">{tin.moTa}</p>
              <span className="mt-auto text-sm font-medium text-blue-700">
                Xem thêm &rarr;
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
