// types/podcast.types.ts
export interface Podcast {
  id: string;
  title: string;
  description: string;
  author: string;
  image?: string;
  feedUrl?: string;
  category?: string;
  episodeCount?: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishDate: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  selected: boolean;
  confidence?: number;
  keywords?: string[];
}

export interface SearchResult {
  success: boolean;
  podcasts: Podcast[];
  error?: string;
}

export interface EpisodeResult {
  success: boolean;
  episodes: Episode[];
  error?: string;
}

export interface TopicResult {
  success: boolean;
  topics: Topic[];
  transcriptId?: string;
  error?: string;
}