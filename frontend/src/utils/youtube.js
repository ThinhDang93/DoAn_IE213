// Lay YouTube video ID tu cac dang URL pho bien:
// https://www.youtube.com/watch?v=XXXXXXXXXXX
// https://youtu.be/XXXXXXXXXXX
// https://www.youtube.com/embed/XXXXXXXXXXX
export const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

export const getYoutubeEmbedUrl = (url) => {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";
};
