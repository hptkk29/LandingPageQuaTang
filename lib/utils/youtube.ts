export function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  if (!id) return "";
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    autoplay: "0",
    controls: "1",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
