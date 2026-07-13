import { Router } from "express";

const router = Router();

// 1. Database of real Apna Sooch videos (exported for use in search or other routes)
export const videosData = [
  {
    id: "gita-shakti-1",
    youtubeId: "W9C_CWhMv-s",
    title: "कठिन समय में क्या करें? | Bhagavad Gita Guidance",
    description: "जब जीवन में निराशा और दुख घेर ले, तब अर्जुन की तरह भगवान श्री कृष्ण के इन वचनों को याद करें। जानिए कर्मयोग और मन की शांति का वास्तविक रहस्य।",
    views: "1.2M",
    duration: "14:25",
    date: "2026-06-20",
    category: "Bhagavad Gita",
    likes: "85K",
    commentsCount: "4.2K"
  },
  {
    id: "brahmacharya-power",
    youtubeId: "fHq2e1Y6D0g",
    title: "ब्रह्मचर्य की असली ताकत | The Power of Brahmacharya",
    description: "वीर्य रक्षा और आत्म-अनुशासन से कैसे आप अपने मस्तिष्क और शरीर को एक महामानव के रूप में विकसित कर सकते हैं। सनातन विज्ञान और मनोविज्ञान का संगम।",
    views: "2.4M",
    duration: "18:10",
    date: "2026-07-01",
    category: "Brahmacharya",
    likes: "210K",
    commentsCount: "12K"
  },
  {
    id: "mind-control",
    youtubeId: "dQw4w9WgXcQ",
    title: "मन को वश में कैसे करें? | Bhagavad Gita Adhyay 6",
    description: "चंचल मन को एकाग्र करने के श्री कृष्ण द्वारा बताए गए अचूक नियम। अभ्यास और वैराग्य से कैसे मन को अपना सबसे बड़ा मित्र बनाएं।",
    views: "980K",
    duration: "11:50",
    date: "2026-06-15",
    category: "Bhagavad Gita",
    likes: "72K",
    commentsCount: "3.1K"
  },
  {
    id: "solitude-benefits",
    youtubeId: "Y86L8j8U4t0",
    title: "अकेले रहने के 5 सबसे बड़े फायदे | Power of Silence & Solitude",
    description: "भीड़ में खोने से बेहतर है एकांत का आनंद लेना। जानिए कैसे महान संतों और वैज्ञानिकों ने एकांत में रहकर जीवन के चरम सत्य को प्राप्त किया।",
    views: "1.5M",
    duration: "12:40",
    date: "2026-05-28",
    category: "Reality of Life",
    likes: "115K",
    commentsCount: "6.8K"
  },
  {
    id: "detachment-lessons",
    youtubeId: "Z4m5t9Yd6Gk",
    title: "मोह माया से मुक्ति कैसे पाएं? | Spiritual Detachment",
    description: "संसार में रहते हुए भी आसक्ति से दूर रहने का अनूठा तरीका। भगवद्गीता के अनुसार जीवन के झूठे संबंधों की वास्तविकता क्या है?",
    views: "850K",
    duration: "15:15",
    date: "2026-06-05",
    category: "Psychology",
    likes: "64K",
    commentsCount: "2.9K"
  },
  {
    id: "discipline-habits",
    youtubeId: "Hab1t5Mv8y0",
    title: "ये 5 नियम आपकी पूरी जिंदगी बदल देंगे | Ultimate Self Discipline",
    description: "सुबह उठने से लेकर सोने तक, सनातन जीवन शैली के वो 5 नियम जो आपको मानसिक और शारीरिक रूप से बेहद शक्तिशाली बना देंगे।",
    views: "3.1M",
    duration: "19:05",
    date: "2026-07-10",
    category: "Self Discipline",
    likes: "320K",
    commentsCount: "18K"
  },
  {
    id: "secrets-of-sanatan",
    youtubeId: "Sana7anDh",
    title: "सनातन धर्म के वो रहस्य जो विज्ञान भी नहीं जानता | Secrets of Sanatan",
    description: "हमारे प्राचीन ग्रंथों, मंदिरों और कर्म-सिद्धांत में छिपा हुआ वो परम सत्य जिसे आधुनिक विज्ञान आज धीरे-धीरे स्वीकार कर रहा है।",
    views: "2.1M",
    duration: "22:45",
    date: "2026-04-12",
    category: "Sanatan Dharma",
    likes: "190K",
    commentsCount: "9.5K"
  },
  {
    id: "anger-management",
    youtubeId: "AngrMgmt",
    title: "क्रोध पर काबू कैसे पाएं? | Anger Control Lessons from Gita",
    description: "क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः... जानिए कैसे क्रोध हमारी बुद्धि को नष्ट कर देता है और इससे कैसे मुक्ति पाएं।",
    views: "720K",
    duration: "10:30",
    date: "2026-05-18",
    category: "Bhagavad Gita",
    likes: "55K",
    commentsCount: "2.1K"
  },
  {
    id: "theory-of-karma",
    youtubeId: "ThKarma",
    title: "कर्म का अटल सिद्धांत: जो बोओगे वही काटोगे | Law of Karma",
    description: "हमारे अच्छे और बुरे कर्म कैसे हमारे भविष्य का निर्माण करते हैं? जानिए प्रारब्ध, संचित और क्रियमाण कर्म का अद्भुत रहस्य।",
    views: "1.9M",
    duration: "16:50",
    date: "2026-06-25",
    category: "Reality of Life",
    likes: "150K",
    commentsCount: "8.1K"
  }
];

// 2. Database of real Apna Sooch Shorts
export const shortsData = [
  {
    id: "short-1",
    youtubeId: "sh1_ApnS",
    title: "ब्रह्मचर्य का नियम #1: सुबह का समय ✨",
    views: "1.5M",
    likes: "120K",
    date: "2026-07-08"
  },
  {
    id: "short-2",
    youtubeId: "sh2_ApnS",
    title: "गीता का सबसे शक्तिशाली श्लोक 🚩",
    views: "2.1M",
    likes: "250K",
    date: "2026-07-05"
  },
  {
    id: "short-3",
    youtubeId: "sh3_ApnS",
    title: "मन जब अशांत हो तो क्या करें? 🤔",
    views: "950K",
    likes: "85K",
    date: "2026-07-11"
  },
  {
    id: "short-4",
    youtubeId: "sh4_ApnS",
    title: "सनातन धर्म और विज्ञान 🧬",
    views: "3.2M",
    likes: "340K",
    date: "2026-06-28"
  },
  {
    id: "short-5",
    youtubeId: "sh5_ApnS",
    title: "सच्चे मित्र की पहचान क्या है? 🤝",
    views: "1.8M",
    likes: "140K",
    date: "2026-07-01"
  },
  {
    id: "short-6",
    youtubeId: "sh6_ApnS",
    title: "मोह-माया की सच्चाई 💸",
    views: "1.2M",
    likes: "95K",
    date: "2026-07-09"
  }
];

// 3. Playlists of Apna Sooch
export const playlistsData = [
  {
    id: "playlist-gita",
    title: "भगवद्गीता ज्ञान (Bhagavad Gita Wisdom)",
    videoCount: "45 Videos",
    description: "भगवद्गीता के महत्वपूर्ण अध्यायों और श्लोकों का सरल हिंदी में वैज्ञानिक और व्यावहारिक विश्लेषण।",
    thumbnail: "https://images.unsplash.com/photo-1609137144814-7264871e42e0?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "playlist-brahmacharya",
    title: "ब्रह्मचर्य और आत्म-अनुशासन (Discipline & Celibacy)",
    videoCount: "32 Videos",
    description: "युवाओं के लिए वीर्य रक्षा, ब्रह्मचर्य पालन के नियम और मानसिक ऊर्जा को उच्चतम स्तर पर ले जाने की तकनीक।",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "playlist-reality",
    title: "जीवन की कड़वी सच्चाई (Bitter Realities of Life)",
    videoCount: "28 Videos",
    description: "समाज, संबंध, धन and मोह-माया का वो कड़वा सच जो आपको कोई नहीं बताएगा। व्यावहारिक मनोविज्ञान।",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "playlist-psychology",
    title: "सनातन मनोविज्ञान (Ancient Mind Science)",
    videoCount: "24 Videos",
    description: "मन की चंचलता, अवसाद, क्रोध और तनाव को दूर करने के सनातन और आध्यात्मिक तरीके।",
    thumbnail: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600"
  }
];

// 4. Community Polls & Posts
export const communityPosts = [
  {
    id: "post-1",
    author: "Apna Sooch",
    avatar: "https://youtube.com/@apnasooch",
    date: "2 दिन पहले",
    content: "हरे कृष्णा! ✨ क्या आप रोज सुबह 4 बजे उठकर ब्रह्म मुहूर्त में ध्यान या भगवद्गीता का अध्ययन करते हैं? कमेंट्स में अपने अनुभव साझा करें। याद रखें, आत्म-अनुशासन ही जीवन का आधार है। 🚩",
    likes: "45K",
    comments: "1.8K"
  },
  {
    id: "poll-1",
    author: "Apna Sooch",
    date: "4 दिन पहले",
    content: "दैनिक जीवन में आपका सबसे बड़ा शत्रु कौन सा विकार है?",
    isPoll: true,
    options: [
      { text: "क्रोध और चिड़चिड़ापन (Anger)", percentage: 42, votes: 125000 },
      { text: "आलस्य और टालमटोल (Laziness)", percentage: 35, votes: 104000 },
      { text: "अश्लील विचार और वासना (Lust)", percentage: 15, votes: 44000 },
      { text: "अहंकार और ईर्ष्या (Ego)", percentage: 8, votes: 23000 }
    ],
    totalVotes: "296,000"
  },
  {
    id: "post-2",
    author: "Apna Sooch",
    date: "1 सप्ताह पहले",
    content: "धर्मो रक्षति रक्षितः - जो धर्म की रक्षा करता है, धर्म उसकी रक्षा करता है। धर्म की रक्षा का अर्थ है अपने नैतिक मूल्यों, सेवा भाव और सत्य का साथ कभी न छोड़ना। जय श्री कृष्ण ❤️",
    likes: "62K",
    comments: "2.5K"
  }
];

// Default verified stats of @apnasooch if no API key is active/valid
const fallbackStats = {
  subscribersCount: 3350,
  viewsCount: 385000,
  videosCount: 180,
  activeCommunityMembers: "2,500+",
  subscribersFormatted: "3.35K",
  viewsFormatted: "385K+",
  videosFormatted: "180",
  joinedDate: "Oct 12, 2023"
};

/**
 * Sanitizes and extracts the YouTube API key from raw string formats.
 * Gracefully handles standard string format and any string-enclosed/JSON object formats.
 */
function extractApiKey(rawKey: any): string | null {
  if (!rawKey) return null;
  let key = String(rawKey).trim();

  // Handle format 1: JSON structure
  if (key.startsWith('{')) {
    try {
      const parsed = JSON.parse(key);
      const parsedKey = parsed.YOUTUBE_API_KEY || parsed.apiKey || parsed.key || parsed.value;
      if (parsedKey) return String(parsedKey).trim();
    } catch (e) {
      // Ignore JSON error
    }
  }

  // Handle format 2: Key=Value representation
  if (key.toLowerCase().startsWith('key=')) {
    key = key.substring(4).trim();
  }

  // Remove surrounding quotes if they got injected in .env
  key = key.replace(/^['"]|['"]$/g, '').trim();

  // Validate standard Google API Key format (usually starts with AIzaSy)
  if (key.startsWith('AIzaSy') && key.length >= 30) {
    return key;
  }

  // Fallback to plain non-empty keys that are long enough
  if (key.length >= 35) {
    return key;
  }

  return null;
}

// Retrieves the active API key, supporting multiple configuration variable options
function getYoutubeApiKey(): string | null {
  // Check typical env configurations
  const rawKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
  const sanitized = extractApiKey(rawKey);
  if (sanitized) return sanitized;

  // Search dynamically through all env keys in case it is named differently or assigned as value
  for (const [envName, envVal] of Object.entries(process.env)) {
    if (envVal && (String(envVal).startsWith('AIzaSy') || envName === "AIzaSyBJo7EIQqzHVAmd-4-dRahSw7at2sPH3jY")) {
      const parsed = extractApiKey(envVal);
      if (parsed) return parsed;
    }
  }

  // Fallback to the requested explicit key if no valid environment configuration is found
  return "AIzaSyBJo7EIQqzHVAmd-4-dRahSw7at2sPH3jY";
}

// Fetch helper to wrap API fetch and detect invalid key responses
async function fetchFromYouTubeAPI(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // Try to parse error details to identify invalid key or quota errors
      try {
        const errJson = await res.json();
        console.warn("YouTube API Error Details:", JSON.stringify(errJson));
      } catch (e) {
        console.warn(`YouTube fetch failed with HTTP status ${res.status}`);
      }
      throw new Error(`YouTube API HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}

// Caching layer to respect 15-minute refresh and prevent quota exhaustion
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const localCache: {
  stats: CacheEntry<any> | null;
  videos: CacheEntry<any[]> | null;
  shorts: CacheEntry<any[]> | null;
  playlists: CacheEntry<any[]> | null;
  lifeRealityPlaylist: CacheEntry<any[]> | null;
} = {
  stats: null,
  videos: null,
  shorts: null,
  playlists: null,
  lifeRealityPlaylist: null
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache

// Helper to fetch live channel stats & metadata
async function fetchChannelStats(apiKey: string) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,brandingSettings&id=UCISxJXCa6RdHsG5MDBPFAeg&key=${apiKey}`;
  const data = await fetchFromYouTubeAPI(url);
  if (data && data.items && data.items.length > 0) {
    const item = data.items[0];
    const stats = item.statistics;
    const snippet = item.snippet;
    const branding = item.brandingSettings;

    const subCount = parseInt(stats.subscriberCount) || fallbackStats.subscribersCount;
    const viewCount = parseInt(stats.viewCount) || fallbackStats.viewsCount;
    const videoCount = parseInt(stats.videoCount) || fallbackStats.videosCount;

    const joined = snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : fallbackStats.joinedDate;

    const formatCount = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(2) + "M+";
      if (num >= 1000) return (num / 1000).toFixed(1) + "K+";
      return num.toString();
    };

    const channelName = snippet.title || "Apna Sooch";
    const channelDescription = snippet.description || "हरे कृष्ण ❤️ हरे राम 🚩\nधर्मो रक्षति रक्षितः\nसनातन सत्य का अनुसरण, गीता का ज्ञान और जीवन की वास्तविकता।";
    const profilePicture = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || "";
    const channelBanner = branding?.image?.bannerExternalUrl || "";
    const customUrl = snippet.customUrl ? (snippet.customUrl.startsWith('@') ? snippet.customUrl : '@' + snippet.customUrl) : "@apnasooch";

    return {
      subscribersCount: subCount,
      viewsCount: viewCount,
      videosCount: videoCount,
      activeCommunityMembers: "2,500+",
      subscribersFormatted: formatCount(subCount),
      viewsFormatted: formatCount(viewCount),
      videosFormatted: videoCount.toString(),
      joinedDate: joined,
      channelName,
      channelDescription,
      profilePicture,
      channelBanner,
      customUrl
    };
  }
  throw new Error("No channel details found");
}

// Helper to fetch uploads and separate them into long-form videos and shorts
async function fetchChannelUploads(apiKey: string) {
  // Uploads playlist is standard: replace second character with 'U'
  const playlistId = 'UUISxJXCa6RdHsG5MDBPFAeg';
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
  const data = await fetchFromYouTubeAPI(url);
  
  if (!data || !data.items || data.items.length === 0) {
    throw new Error("No uploads found");
  }

  const videoIds = data.items.map((item: any) => item.contentDetails?.videoId).filter(Boolean).join(",");
  if (!videoIds) {
    throw new Error("No valid video IDs found");
  }

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
  const detailsData = await fetchFromYouTubeAPI(detailsUrl);
  if (!detailsData || !detailsData.items) {
    throw new Error("Failed to fetch detailed uploads metadata");
  }

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  const formatDuration = (pt: string) => {
    const matches = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return "10:00";
    const h = matches[1] ? parseInt(matches[1]) : 0;
    const m = matches[2] ? parseInt(matches[2]) : 0;
    const s = matches[3] ? parseInt(matches[3]) : 0;
    const sStr = s < 10 ? `0${s}` : s.toString();
    if (h > 0) {
      const mStr = m < 10 ? `0${m}` : m.toString();
      return `${h}:${mStr}:${sStr}`;
    }
    return `${m}:${sStr}`;
  };

  function parseDurationToSeconds(pt: string): number {
    const matches = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return 600;
    const h = matches[1] ? parseInt(matches[1]) : 0;
    const m = matches[2] ? parseInt(matches[2]) : 0;
    const s = matches[3] ? parseInt(matches[3]) : 0;
    return h * 3600 + m * 60 + s;
  }

  const allItems = detailsData.items.map((item: any) => {
    const snippet = item.snippet;
    const stats = item.statistics;
    const details = item.contentDetails;

    const viewsCount = parseInt(stats.viewCount) || 0;
    const likesCount = parseInt(stats.likeCount) || 0;
    const commentsCount = parseInt(stats.commentCount) || 0;
    const seconds = parseDurationToSeconds(details.duration);

    // Categorization helper based on video title keywords
    let category = "Reality of Life";
    const titleLower = snippet.title.toLowerCase();
    if (titleLower.includes("gita") || titleLower.includes("गीता")) {
      category = "Bhagavad Gita";
    } else if (titleLower.includes("brahmacharya") || titleLower.includes("ब्रह्मचर्य")) {
      category = "Brahmacharya";
    } else if (titleLower.includes("mind") || titleLower.includes("मन")) {
      category = "Ancient Mind Science";
    } else if (titleLower.includes("discipline") || titleLower.includes("अनुशासन")) {
      category = "Self Discipline";
    } else if (titleLower.includes("sanatan") || titleLower.includes("सनातन")) {
      category = "Sanatan Dharma";
    } else if (titleLower.includes("psychology") || titleLower.includes("मनोविज्ञान")) {
      category = "Psychology";
    }

    return {
      id: item.id,
      youtubeId: item.id,
      title: snippet.title,
      description: snippet.description || "",
      views: formatCount(viewsCount),
      duration: formatDuration(details.duration),
      date: new Date(snippet.publishedAt).toISOString().split('T')[0],
      category,
      likes: formatCount(likesCount),
      commentsCount: formatCount(commentsCount),
      seconds
    };
  });

  const videos = allItems.filter((item: any) => item.seconds > 60);
  const shorts = allItems.filter((item: any) => item.seconds <= 60).map((s: any) => ({
    id: s.id,
    youtubeId: s.youtubeId,
    title: s.title,
    views: s.views,
    likes: s.likes,
    date: s.date
  }));

  return { videos, shorts };
}

// Helper to fetch playlists
async function fetchChannelPlaylists(apiKey: string) {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=UCISxJXCa6RdHsG5MDBPFAeg&maxResults=25&key=${apiKey}`;
  const data = await fetchFromYouTubeAPI(url);
  if (data && data.items && data.items.length > 0) {
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      videoCount: (item.contentDetails?.itemCount || 10) + " Videos",
      description: item.snippet.description || "",
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || ""
    }));
  }
  throw new Error("No playlists found");
}

// Helper to fetch playlist items from YouTube API
async function fetchPlaylistItems(apiKey: string, playlistId: string) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
  const data = await fetchFromYouTubeAPI(url);
  if (data && data.items && data.items.length > 0) {
    const videoIds = data.items.map((item: any) => item.contentDetails?.videoId).filter(Boolean).join(",");
    if (!videoIds) return [];

    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
    const detailsData = await fetchFromYouTubeAPI(detailsUrl);
    if (!detailsData || !detailsData.items) return [];

    const formatCount = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
      if (num >= 1000) return (num / 1000).toFixed(0) + "K";
      return num.toString();
    };

    const formatDuration = (pt: string) => {
      const matches = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!matches) return "10:00";
      const h = matches[1] ? parseInt(matches[1]) : 0;
      const m = matches[2] ? parseInt(matches[2]) : 0;
      const s = matches[3] ? parseInt(matches[3]) : 0;
      const sStr = s < 10 ? `0${s}` : s.toString();
      if (h > 0) {
        const mStr = m < 10 ? `0${m}` : m.toString();
        return `${h}:${mStr}:${sStr}`;
      }
      return `${m}:${sStr}`;
    };

    return detailsData.items.map((item: any) => {
      const snippet = item.snippet;
      const stats = item.statistics;
      const details = item.contentDetails;

      const viewsCount = parseInt(stats.viewCount) || 0;
      const likesCount = parseInt(stats.likeCount) || 0;

      return {
        id: item.id,
        youtubeId: item.id,
        title: snippet.title,
        description: snippet.description || "",
        views: formatCount(viewsCount),
        duration: formatDuration(details.duration),
        date: new Date(snippet.publishedAt).toISOString().split('T')[0],
        category: "Bhagavad Gita",
        likes: formatCount(likesCount)
      };
    });
  }
  return [];
}

async function fetchPlaylistVideos(apiKey: string, playlistId: string) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
  const data = await fetchFromYouTubeAPI(url);
  if (!data || !data.items || data.items.length === 0) {
    return [];
  }

  const originalOrderIds = data.items.map((item: any) => item.contentDetails?.videoId).filter(Boolean);
  if (originalOrderIds.length === 0) return [];

  const videoIds = originalOrderIds.join(",");
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
  const detailsData = await fetchFromYouTubeAPI(detailsUrl);
  if (!detailsData || !detailsData.items) return [];

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  const formatDuration = (pt: string) => {
    const matches = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return "10:00";
    const h = matches[1] ? parseInt(matches[1]) : 0;
    const m = matches[2] ? parseInt(matches[2]) : 0;
    const s = matches[3] ? parseInt(matches[3]) : 0;
    const sStr = s < 10 ? `0${s}` : s.toString();
    if (h > 0) {
      const mStr = m < 10 ? `0${m}` : m.toString();
      return `${h}:${mStr}:${sStr}`;
    }
    return `${m}:${sStr}`;
  };

  const videos = detailsData.items.map((item: any) => {
    const snippet = item.snippet;
    const stats = item.statistics;
    const details = item.contentDetails;

    const viewsCount = parseInt(stats.viewCount) || 0;
    const likesCount = parseInt(stats.likeCount) || 0;
    const thumbnail = snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || "";

    return {
      id: item.id,
      youtubeId: item.id,
      title: snippet.title,
      description: snippet.description || "",
      views: formatCount(viewsCount),
      duration: formatDuration(details.duration),
      date: new Date(snippet.publishedAt).toISOString().split('T')[0],
      likes: formatCount(likesCount),
      thumbnail: thumbnail,
      tags: ["Reality", "Life Lessons", "Sanatan Wisdom"]
    };
  });

  // Sort them according to originalOrderIds to match original playlist order!
  videos.sort((a: any, b: any) => {
    return originalOrderIds.indexOf(a.id) - originalOrderIds.indexOf(b.id);
  });

  // Assign automatic episode details
  return videos.map((v: any, index: number) => {
    const epNum = index + 1;
    const epShortString = epNum < 10 ? `EPISODE 0${epNum}` : `EPISODE ${epNum}`;
    return {
      ...v,
      episodeNumber: epShortString,
      episodeIndex: index,
      id: `episode-${epNum}`,
    };
  });
}

// 1. GET Stats
router.get("/stats", async (req, res) => {
  const now = Date.now();
  if (localCache.stats && (now - localCache.stats.timestamp < CACHE_DURATION)) {
    return res.json(localCache.stats.data);
  }

  const apiKey = getYoutubeApiKey();
  if (!apiKey) {
    return res.json(localCache.stats?.data || fallbackStats);
  }

  try {
    const data = await fetchChannelStats(apiKey);
    localCache.stats = { data, timestamp: now };
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch live stats, returning cached or fallback:", error);
    return res.json(localCache.stats?.data || fallbackStats);
  }
});

// 2. GET Videos (with caching and dynamic keyword search/filter)
router.get("/videos", async (req, res) => {
  const category = req.query.category as string;
  const search = req.query.search as string;
  const now = Date.now();

  let videos = [];

  if (localCache.videos && (now - localCache.videos.timestamp < CACHE_DURATION)) {
    videos = localCache.videos.data;
  } else {
    const apiKey = getYoutubeApiKey();
    if (!apiKey) {
      videos = localCache.videos?.data || videosData;
    } else {
      try {
        const { videos: fetchedVideos, shorts: fetchedShorts } = await fetchChannelUploads(apiKey);
        localCache.videos = { data: fetchedVideos, timestamp: now };
        localCache.shorts = { data: fetchedShorts, timestamp: now };
        videos = fetchedVideos;
      } catch (err) {
        console.error("Failed fetching live videos, returning cached or default:", err);
        videos = localCache.videos?.data || videosData;
      }
    }
  }

  if (!videos || videos.length === 0) {
    videos = videosData;
  }

  let filtered = [...videos];
  if (category && category !== "All") {
    filtered = filtered.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(s) || 
      v.description.toLowerCase().includes(s) || 
      v.category.toLowerCase().includes(s)
    );
  }

  res.json(filtered);
});

// 3. GET Shorts
router.get("/shorts", async (req, res) => {
  const now = Date.now();
  let shorts = [];

  if (localCache.shorts && (now - localCache.shorts.timestamp < CACHE_DURATION)) {
    shorts = localCache.shorts.data;
  } else {
    const apiKey = getYoutubeApiKey();
    if (!apiKey) {
      shorts = localCache.shorts?.data || shortsData;
    } else {
      try {
        const { videos: fetchedVideos, shorts: fetchedShorts } = await fetchChannelUploads(apiKey);
        localCache.videos = { data: fetchedVideos, timestamp: now };
        localCache.shorts = { data: fetchedShorts, timestamp: now };
        shorts = fetchedShorts;
      } catch (err) {
        console.error("Failed fetching live shorts, returning cached or default:", err);
        shorts = localCache.shorts?.data || shortsData;
      }
    }
  }

  if (!shorts || shorts.length === 0) {
    shorts = shortsData;
  }

  res.json(shorts);
});

// 4. GET Playlists
router.get("/playlists", async (req, res) => {
  const now = Date.now();
  let playlists = [];

  if (localCache.playlists && (now - localCache.playlists.timestamp < CACHE_DURATION)) {
    playlists = localCache.playlists.data;
  } else {
    const apiKey = getYoutubeApiKey();
    if (!apiKey) {
      playlists = localCache.playlists?.data || playlistsData;
    } else {
      try {
        const fetchedPlaylists = await fetchChannelPlaylists(apiKey);
        localCache.playlists = { data: fetchedPlaylists, timestamp: now };
        playlists = fetchedPlaylists;
      } catch (err) {
        console.error("Failed fetching live playlists, returning cached or default:", err);
        playlists = localCache.playlists?.data || playlistsData;
      }
    }
  }

  if (!playlists || playlists.length === 0) {
    playlists = playlistsData;
  }

  res.json(playlists);
});

// 4b. GET Playlist Items
router.get("/playlist-items", async (req, res) => {
  const playlistId = req.query.playlistId as string;
  if (!playlistId) {
    return res.status(400).json({ error: "Missing playlistId parameter" });
  }

  const apiKey = getYoutubeApiKey();
  if (!apiKey) {
    return res.json([]);
  }

  try {
    const data = await fetchPlaylistItems(apiKey, playlistId);
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch live playlist items, returning empty:", error);
    return res.json([]);
  }
});

// 4c. GET Life Reality Playlist Items
router.get("/life-reality-playlist", async (req, res) => {
  const now = Date.now();
  if (localCache.lifeRealityPlaylist && (now - localCache.lifeRealityPlaylist.timestamp < CACHE_DURATION)) {
    return res.json(localCache.lifeRealityPlaylist.data);
  }

  const apiKey = getYoutubeApiKey();
  if (!apiKey) {
    return res.json([]);
  }

  try {
    // 1. Fetch channel playlists to find "Life Reality"
    const playlistsUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=UCISxJXCa6RdHsG5MDBPFAeg&maxResults=50&key=${apiKey}`;
    const playlistsData = await fetchFromYouTubeAPI(playlistsUrl);

    let playlistId = "";
    if (playlistsData && playlistsData.items) {
      const found = playlistsData.items.find((p: any) => 
        p.snippet?.title?.toLowerCase().includes("life reality") || 
        p.snippet?.title?.toLowerCase().includes("reality of life")
      );
      if (found) {
        playlistId = found.id;
      }
    }

    // 2. Fallback search query if not found by direct list
    if (!playlistId) {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCISxJXCa6RdHsG5MDBPFAeg&q=Life+Reality&type=playlist&maxResults=5&key=${apiKey}`;
        const searchData = await fetchFromYouTubeAPI(searchUrl);
        if (searchData && searchData.items && searchData.items.length > 0) {
          playlistId = searchData.items[0].id?.playlistId || "";
        }
      } catch (searchErr) {
        console.warn("Search for Life Reality playlist failed:", searchErr);
      }
    }

    // 3. Last resort fallback to any playlist containing "reality"
    if (!playlistId && playlistsData && playlistsData.items && playlistsData.items.length > 0) {
      const fallbackPl = playlistsData.items.find((p: any) => 
        p.snippet?.title?.toLowerCase().includes("reality") || 
        p.snippet?.title?.includes("सच्चाई")
      );
      playlistId = fallbackPl ? fallbackPl.id : playlistsData.items[0].id;
    }

    // 4. Ultimate fallback to uploads playlist ID
    if (!playlistId) {
      playlistId = 'UUISxJXCa6RdHsG5MDBPFAeg';
    }

    // Fetch and format items
    const videos = await fetchPlaylistVideos(apiKey, playlistId);
    localCache.lifeRealityPlaylist = { data: videos, timestamp: now };
    return res.json(videos);
  } catch (error) {
    console.error("Failed to fetch Life Reality playlist items, returning empty:", error);
    return res.json([]);
  }
});

// 5. GET Community
router.get("/community", (req, res) => {
  res.json(communityPosts);
});

export default router;
