export interface Track {
  id: string;
  title: string;
  album: string;
  artist: string;
  imageUrl: string;
  fileUrl: string;
  metadata: {
    size: number;
    format: string;
    bitrate: number;
    duration: number;
  };
  statistics: {
    playbacks: number;
    downloads: number;
  };
}
