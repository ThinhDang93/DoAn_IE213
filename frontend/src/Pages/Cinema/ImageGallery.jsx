import React, { useState } from "react";

// Gallery anh don gian: 1 anh lon dang xem + dai thumbnail cuon ngang ben
// duoi, dung chung cho ca trang danh sach he thong rap va trang chi tiet
// cum rap.
const ImageGallery = ({ images = [], alt = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
        Chưa có hình ảnh
      </div>
    );
  }

  return (
    <div>
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
        <img
          src={images[activeIndex]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                idx === activeIndex ? "border-blue-600" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt={`${alt} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
