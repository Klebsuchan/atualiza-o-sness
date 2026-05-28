export interface Game {
  id: string;
  title: string;
  category: string;
  description: string;
  rating: number;
  system?: string;
  imageUrl: string;
  bannerUrl: string;
  playUrl?: string;
};