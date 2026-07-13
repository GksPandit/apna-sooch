export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  views: string;
  duration: string;
  date: string;
  category: string;
  likes?: string;
  commentsCount?: string;
  thumbnail?: string;
}

export interface Short {
  id: string;
  youtubeId: string;
  title: string;
  views: string;
  likes: string;
  date: string;
}

export interface Playlist {
  id: string;
  title: string;
  videoCount: string;
  description: string;
  thumbnail: string;
}

export interface Quote {
  text: string;
  author: string;
  isAiGenerated?: boolean;
}

export interface GitaVerse {
  chapter: number;
  verse: number;
  sanskrit: string;
  hindiMeaning: string;
  englishMeaning: string;
  context: string;
  aiExplanation?: string;
  isAiGenerated?: boolean;
}

export interface ChannelStats {
  subscribersCount: number;
  viewsCount: number;
  videosCount: number;
  activeCommunityMembers: string;
  subscribersFormatted: string;
  viewsFormatted: string;
  videosFormatted: string;
  joinedDate: string;
  channelName?: string;
  profilePicture?: string;
  channelBanner?: string;
  channelDescription?: string;
  customUrl?: string;
}

export interface PollOption {
  text: string;
  percentage: number;
  votes: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  date: string;
  content: string;
  likes?: string;
  comments?: string;
  isPoll?: boolean;
  options?: PollOption[];
  totalVotes?: string;
}
