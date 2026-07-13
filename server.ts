import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import youtubeRouter, { videosData, shortsData } from "./src/api/youtube/index.ts";
import { REALITY_EPISODES } from "./src/data/realityEpisodes.ts";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini if key exists
let ai: GoogleGenAI | null = null;
let geminiBackoffUntil = 0;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

app.use(express.json());

// videosData is imported from ./src/api/youtube/index.ts

// shortsData is imported from ./src/api/youtube/index.ts

// Playlists of Apna Sooch
const playlistsData = [
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
    description: "समाज, संबंध, धन और मोह-माया का वो कड़वा सच जो आपको कोई नहीं बताएगा। व्यावहारिक मनोविज्ञान।",
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

// Bhagavad Gita Verses DB
const gitaVerses = [
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    hindiMeaning: "तुम्हारा अधिकार केवल कर्म करने पर है, उसके फलों पर कभी नहीं। इसलिए कर्मों के फल की इच्छा मत करो और न ही कभी अकर्मण्यता (कर्म न करने) के प्रति आसक्त हो।",
    englishMeaning: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inactive duty.",
    context: "कर्मयोग (Karma Yoga) - भगवान श्री कृष्ण अर्जुन को फल की चिंता किए बिना अपना कर्तव्य निभाने का उपदेश देते हैं।"
  },
  {
    chapter: 2,
    verse: 62,
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥",
    hindiMeaning: "विषयों का ध्यान (चिन्तन) करने वाले मनुष्य की उन विषयों में आसक्ति हो जाती है। आसक्ति से इच्छा (कामना) उत्पन्न होती है और कामना में विघ्न पड़ने पर क्रोध उत्पन्न होता है।",
    englishMeaning: "While contemplating on the objects of the senses, a person develops attachment for them. From attachment desire arises, and from desire anger is born.",
    context: "मनोविज्ञान (Psychology of Mind) - वासना और क्रोध की उत्पत्ति का वैज्ञानिक चक्र।"
  },
  {
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    hindiMeaning: "मनुष्य को चाहिए कि वह अपने मन के द्वारा स्वयं का उद्धार करे, खुद को पतन की ओर न धकेले। क्योंकि यह मन ही आत्मा का परम मित्र है और मन ही आत्मा का सबसे बड़ा शत्रु है।",
    englishMeaning: "Elevate yourself through your own mind, and do not degrade yourself. For the mind is the friend of the soul, and the mind is also the enemy of the soul.",
    context: "आत्म-अनुशासन (Self Discipline) - खुद की मानसिक शक्ति पर नियंत्रण रखने का सर्वोच्च उपदेश।"
  },
  {
    chapter: 4,
    verse: 7,
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    hindiMeaning: "हे भारत (अर्जुन)! जब-जब धर्म की हानि होती है और अधर्म का उत्थान होता है, तब-तब मैं धर्म की पुनर्स्थापना के लिए स्वयं को प्रकट करता हूँ।",
    englishMeaning: "Whenever there is a decline in righteousness and an increase in unrighteousness, O Bharata, at that time I manifest myself on earth.",
    context: "सनातन धर्म (Eternal Duty) - ईश्वरीय अवतार और धर्म की सनातन शक्ति का सिद्धांत।"
  },
  {
    chapter: 3,
    verse: 19,
    sanskrit: "तस्मादसक्तः सततं कार्यं कर्म समाचर।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥",
    hindiMeaning: "इसलिए, कर्मफल के प्रति आसक्ति के बिना, निरंतर कर्तव्य मानकर कर्म करो। क्योंकि आसक्तिरहित होकर कर्म करने से मनुष्य परम सत्य (मोक्ष) को प्राप्त कर लेता है।",
    englishMeaning: "Therefore, without attachment, constantly perform your duties as a matter of obligation. By working without attachment, a person attains the Supreme.",
    context: "कर्मयोग (Duty without attachment) - संसार में रहते हुए अनासक्त भाव से श्रेष्ठ कर्म करना।"
  }
];

// Rich set of daily Hindi spiritual quotes
const spiritualQuotes = [
  {
    text: "सत्य हमेशा कड़वा होता है और जो व्यक्ति उस कड़वाहट को पचा लेता है, उसे जीवन में कोई भी मोह विचलित नहीं कर सकता।",
    author: "Apna Sooch"
  },
  {
    text: "ब्रह्मचर्य केवल शारीरिक वीर्य रक्षा नहीं है, यह मन के स्तर पर गंदे विचारों का विनाश और आत्म-नियंत्रण का शिखर है।",
    author: "Apna Sooch"
  },
  {
    text: "दुनिया आपके बारे में क्या सोचती है, यह उनका दृष्टिकोण है। आप स्वयं के बारे में क्या सोचते हैं, यह आपका वास्तविक चरित्र है।",
    author: "Apna Sooch"
  },
  {
    text: "चिंता आपको भूतकाल की गलतियों और भविष्य की काल्पनिक समस्याओं में फंसाए रखती है। केवल वर्तमान क्षण में ही जीवन की वास्तविकता है।",
    author: "Apna Sooch"
  },
  {
    text: "जो व्यक्ति अपने चंचल मन को अपना दास नहीं बना सकता, उसका मन ही उसका सबसे बड़ा शत्रु बनकर उसकी बुद्धि को नष्ट कर देता है।",
    author: "Apna Sooch"
  },
  {
    text: "धर्म केवल पूजा-पाठ नहीं है, धर्म अपने कर्तव्यों का सत्यनिष्ठा से पालन करना, समाज की सेवा करना और अपनी इंद्रियों पर विजय पाना है।",
    author: "Apna Sooch"
  },
  {
    text: "मोह हमें कमजोर बनाता है, जबकि कर्तव्य हमें शक्तिशाली बनाता है। अपने संबंधों में स्नेह रखें, लेकिन आसक्ति और मोह से बचें।",
    author: "Apna Sooch"
  }
];

// Community Polls & Posts
const communityPosts = [
  {
    id: "post-1",
    author: "Apna Sooch",
    avatar: "https://youtube.com/@apnasooch", // Handled nicely in client as Logo
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

// API Routes
app.use("/api/youtube", youtubeRouter);

// Pre-generated high-quality fallback answers for the 8 default questions of Apna Sooch
const fallbackAnswers: Record<string, any> = {
  "why am i always unhappy?": {
    category: "life",
    shortAnswer: "आप हमेशा दुखी इसलिए हैं क्योंकि आप जीवन की वास्तविकता को स्वीकार करने के बजाय, अपनी काल्पनिक अपेक्षाओं (expectations) को सच मान रहे हैं।",
    deepExplanation: "जब हम जीवन को अपनी शर्तों पर चलाना चाहते हैं, तो दुख पैदा होता है। उदाहरण के लिए, यदि आप एक नदी के बहाव के विपरीत तैरने की कोशिश करेंगे, तो आप थकेंगे भी और परेशान भी होंगे। खुश रहना कोई मंजिल नहीं है, बल्कि यह वर्तमान परिस्थिति को बिना किसी शिकायत के स्वीकार करने का भाव है। हमारा मन लगातार 'अगर-मगर' के चक्र में फंसा रहता है कि 'अगर ये हो जाता तो मैं खुश होता'—यही हमारे दुख की मुख्य जड़ है।",
    psychology: "मनोवैज्ञानिक रूप से, मानव मस्तिष्क सुख की तुलना में नकारात्मकता और कमियों (Negativity Bias) पर अधिक ध्यान केंद्रित करता है। जब हम खुद की तुलना दूसरों के सोशल मीडिया प्रोफाइल से करते हैं, तो हमारे मस्तिष्क में डोपामाइन का स्तर गिर जाता है और अपूर्णता का अहसास होता है।",
    reality: "सच्चाई यह है कि यह संसार केवल सुख देने के लिए नहीं बना है। भगवद्गीता में इस जगत को 'दुःखालयम' कहा गया है। जब तक आप बाहरी वस्तुओं और लोगों में अपनी खुशी ढूंढेंगे, तब तक आप परिस्थितियों के गुलाम रहेंगे और दुखी ही रहेंगे।",
    actionSteps: [
      "हर दिन सुबह उठकर उन 3 चीजों की सूची बनाएं जिसके लिए आप आभारी (grateful) हैं।",
      "अपनी सुख की परिभाषा को बाहरी भौतिक वस्तुओं से हटाकर आंतरिक शांति पर केंद्रित करें।",
      "दूसरों के जीवन की दिखावटी दुनिया से खुद की तुलना करना तुरंत बंद करें।"
    ],
    dailyPractice: "रात को सोने से पहले 5 मिनट शांत बैठें और दिन भर में हुई किसी एक अच्छी बात का स्मरण करें।",
    commonMistakes: [
      "यह सोचना कि कोई नया व्यक्ति या नई वस्तु आने से मेरा जीवन हमेशा के लिए सुखी हो जाएगा।",
      "दुख के पलों में खुद को पीड़ित (victim) समझना और परिस्थितियों को कोसना।"
    ],
    quote: "संसार में जिसे हम सुख कहते हैं, वह केवल दो दुखों के बीच का एक छोटा सा विराम है।",
    finalLesson: "शांति परिस्थितियों को बदलने में नहीं, बल्कि अपने दृष्टिकोण को बदलने में है।"
  },
  "how to stop overthinking?": {
    category: "mind",
    shortAnswer: "ओवरथिंकिंग को रोकने का एकमात्र तरीका अपने विचारों से खुद को अलग करके 'साक्षी भाव' (observer) में आना है।",
    deepExplanation: "ओवरथिंकिंग तब होती है जब आप अपने ही मन के चंचल विचारों के साथ पूरी तरह बह जाते हैं। उदाहरण के लिए, आकाश में बादल तैरते हैं, लेकिन आकाश बादलों में खो नहीं जाता। आपका मन विचारों का बादल है और आप अनंत आकाश हैं। जब आप विचारों का विश्लेषण करना बंद कर देते हैं और उन्हें केवल देखने लगते हैं, तो वे स्वतः शांत हो जाते हैं।",
    psychology: "हमारा मन सुरक्षा के चक्रव्यूह में जीता है। भविष्य की किसी अनहोनी से बचने के लिए, मस्तिष्क लगातार काल्पनिक परिस्थितियां (scenarios) बनाता है, जिसे वैज्ञानिक भाषा में 'अति-सजगता' (hyper-vigilance) कहते हैं।",
    reality: "सच्चाई यह है कि जिन 95% काल्पनिक समस्याओं के बारे में आप रात-दिन सोचते रहते हैं, वे कभी वास्तविक जीवन में घटित ही नहीं होतीं। यह केवल मन का एक भ्रम जाल है।",
    actionSteps: [
      "जब भी विचारों का तूफ़ान उठे, तुरंत अपनी सांसों की गति पर ध्यान केंद्रित करें।",
      "अपने विचारों को एक डायरी में लिख लें ताकि वे मस्तिष्क से बाहर निकल सकें।",
      "वर्तमान क्षण में किसी भी शारीरिक गतिविधि (जैसे टहलना, कसरत) में खुद को व्यस्त करें।"
    ],
    dailyPractice: "प्रतिदिन सुबह 10 मिनट 'आनापानसती' (सांसों के आने-जाने पर ध्यान) का अभ्यास करें।",
    commonMistakes: [
      "विचारों को दबाने या उनसे लड़ने की कोशिश करना, जिससे वे और अधिक शक्तिशाली हो जाते हैं।",
      "अपने विचारों को ही अपना अंतिम सच मान लेना और उन्हीं के अनुसार प्रतिक्रिया देना।"
    ],
    quote: "चिंता आपको भूतकाल की गलतियों और भविष्य की काल्पनिक समस्याओं में फंसाए रखती है।",
    finalLesson: "आप अपने विचार नहीं हैं, बल्कि आप वह चेतना हैं जो विचारों को देख रही है।"
  },
  "why do people leave?": {
    category: "relationships",
    shortAnswer: "लोग साथ इसलिए छोड़ देते हैं क्योंकि इस संसार में कोई भी संबंध स्थायी नहीं है, हर संबंध किसी न किस प्रयोजन (purpose) या समय सीमा से बंधा होता है।",
    deepExplanation: "जब किसी पेड़ की पत्तियां सूख जाती हैं, तो वे गिर जाती हैं। यह प्रकृति का नियम है। इसी तरह, जब लोगों का आपके जीवन में पाठ (lesson) या प्रयोजन समाप्त हो जाता है, तो उनका प्रस्थान तय होता है। इसे व्यक्तिगत रूप से लेकर विलाप करना खुद को व्यर्थ पीड़ा देना है।",
    psychology: "मानव स्वभाव निरंतर बदलाव और आत्म-हित (self-interest) से संचालित होता है। जब किसी व्यक्ति की मानसिक या भावनात्मक आवश्यकताएं किसी संबंध से पूरी नहीं होतीं, तो वह दूरी बनाने लगता है।",
    reality: "सत्य यह है कि आप इस संसार में अकेले आए थे और अकेले ही जाएंगे। माता-पिता, मित्र, जीवनसाथी—सभी केवल इस यात्रा के सहयात्री हैं, अंतिम मंजिल नहीं।",
    actionSteps: [
      "किसी भी व्यक्ति पर अपनी मानसिक और भावनात्मक खुशी के लिए 100% निर्भर न रहें।",
      "जाने वाले व्यक्ति के प्रति कोई ईर्ष्या या क्रोध न रखें, उन्हें उनके मार्ग पर आगे बढ़ने दें।",
      "अपने आत्म-सम्मान और अपने जीवन के मुख्य उद्देश्य पर अपना ध्यान केंद्रित करें।"
    ],
    dailyPractice: "प्रतिदिन स्वयं के साथ कम से कम 15 मिनट एकांत में बैठें और अपनी आंतरिक शक्ति को महसूस करें।",
    commonMistakes: [
      "जाने वाले व्यक्ति को रोकने के लिए अपनी गरिमा और आत्म-सम्मान से समझौता करना।",
      "यह सोचना कि उनके बिना आपका जीवन निरर्थक और समाप्त हो गया है।"
    ],
    quote: "मोह हमें कमजोर बनाता है, जबकि कर्तव्य हमें शक्तिशाली बनाता है। अपने संबंधों में स्नेह रखें, लेकिन आसक्ति से बचें।",
    finalLesson: "संसार का सबसे बड़ा सत्य केवल आप खुद हैं; बाकी सब समय के साथ बदलता रहेगा।"
  },
  "how to become disciplined?": {
    category: "discipline",
    shortAnswer: "अनुशासन का अर्थ मन के क्षणिक सुखों (instant gratification) को छोड़कर दूरगामी लक्ष्यों के लिए खुद को तैयार करना है।",
    deepExplanation: "अनुशासन कोई पिंजरा नहीं है, बल्कि यह स्वतंत्रता की सीढ़ी है। जब आपके पास अनुशासन नहीं होता, तो आप अपने आलस्य और चंचल मन के गुलाम बन जाते हैं। जैसे एक बहती नदी पर बांध बनाकर उसकी ऊर्जा का सही उपयोग किया जाता है, वैसे ही अनुशासन के द्वारा हम अपनी मानसिक ऊर्जा को बिखराव से रोकते हैं।",
    psychology: "मस्तिष्क हमेशा कम ऊर्जा वाले और आसान सुखों (जैसे रील देखना, सोना) की ओर भागता है क्योंकि इसमें तुरंत डोपामाइन रिलीज होता है। अनुशासन के लिए इस डोपामाइन लूप को तोड़ना पड़ता है।",
    reality: "बिना अनुशासन के असाधारण जीवन की कल्पना करना केवल एक मूर्खतापूर्ण सपना है। इतिहास गवाह है कि केवल अत्यंत अनुशासित लोगों ने ही संसार में कुछ बड़ा किया है।",
    actionSteps: [
      "एक बार में केवल एक छोटी सी अच्छी आदत (जैसे सुबह 5 बजे उठना) विकसित करें।",
      "अपने काम करने का एक निश्चित समय तय करें और बिना किसी बहाने के उस पर टिके रहें।",
      "सस्ते डोपामाइन के स्रोतों (सोशल मीडिया, जंक फूड) से दूरी बनाएं।"
    ],
    dailyPractice: "हर सुबह उठते ही अपने बिस्तर को व्यवस्थित करें—यह दिन की पहली अनुशासित क्रिया होगी।",
    commonMistakes: [
      "एक ही दिन में पूरी जीवनशैली बदलने की कोशिश करना, जिससे थकान और असफलता मिलती. है।",
      "प्रेरणा (motivation) का इंतजार करना; अनुशासन प्रेरणा से नहीं, बल्कि कर्म करने से आता है।"
    ],
    quote: "जो व्यक्ति अपने चंचल मन को अपना दास नहीं बना सकता, उसका मन ही उसका सबसे बड़ा शत्रु बन जाता है।",
    finalLesson: "अनुशासन की शुरुआत बहुत कठिन होती है, लेकिन इसका परिणाम अत्यंत मधुर और शक्तिशाली होता है।"
  },
  "why do i compare myself?": {
    category: "psychology",
    shortAnswer: "तुलना का मुख्य कारण अपने भीतर की अपूर्णता और अज्ञानता है, जहाँ आप दूसरों के बाहरी प्रदर्शन (display) को अपनी आंतरिक वास्तविकता से आंकते हैं।",
    deepExplanation: "हर फूल की अपनी सुगंध और अपना समय होता है। गुलाब कभी कमल बनने की कोशिश नहीं करता। यदि गुलाब कमल बनने की कोशिश करेगा, तो वह अपना अस्तित्व ही खो देगा। इसी तरह, आपकी यात्रा अनूठी है। जब आप तुलना करते हैं, तो आप ईश्वर द्वारा बनाए गए अपने अनूठे स्वरूप का अपमान करते हैं।",
    psychology: "मनुष्य एक सामाजिक प्राणी है और मस्तिष्क दूसरों की सामाजिक स्थिति को समझकर अपनी सुरक्षा का आकलन करता है। इसे 'सोशल कंपैरिजन थ्योरी' कहा जाता है।",
    reality: "लोग केवल अपने जीवन के सबसे अच्छे और चमकीले क्षणों को ही दुनिया के सामने प्रदर्शित करते हैं। उनके पर्दे के पीछे के संघर्ष और आंसुओं को कोई नहीं दिखाता।",
    actionSteps: [
      "सोशल मीडिया के अत्यधिक उपयोग से बचें, जहाँ हर कोई अपने जीवन को बेहतरीन दिखाता है।",
      "अपनी तुलना केवल कल के खुद के स्वरूप से करें—क्या आप कल से बेहतर बने हैं?",
      "दूसरों की सफलता पर ईर्ष्या करने के बजाय उनके पुरुषार्थ का सम्मान करें।"
    ],
    dailyPractice: "प्रतिदिन अपनी डायरी में अपनी 3 छोटी-छोटी जीतों या उपलब्धियों को लिखें।",
    commonMistakes: [
      "दूसरों के बाहरी वैभव को देखकर यह मान लेना कि वे अंदर से भी पूरी तरह खुश और शांत हैं।",
      "अपनी ताकत की तुलना दूसरों की कमजोरी से करना, या इसके विपरीत।"
    ],
    quote: "दुनिया आपके बारे में क्या सोचती है, यह उनका दृष्टिकोण है। आप स्वयं के बारे में क्या सोचते हैं, यह आपका वास्तविक चरित्र है।",
    finalLesson: "आप इस ब्रह्मांड की एक अनूठी रचना हैं, आपकी तुलना किसी से भी संभव नहीं है।"
  },
  "why am i afraid of failure?": {
    category: "failure",
    shortAnswer: "असफलता का डर वास्तव में असफलता का नहीं, बल्कि समाज के सामने अपनी प्रतिष्ठा खोने और अहंकार के टूटने का डर है।",
    deepExplanation: "एक छोटा बच्चा जब चलना सीखता है, तो वह सैकड़ों बार गिरता है। वह गिरने को असफलता नहीं मानता, बल्कि इसे चलने की प्रक्रिया का हिस्सा समझता है। लेकिन जैसे-जैसे हम बड़े होते हैं, समाज हमारे भीतर यह डर बिठा देता है कि असफल होना एक पाप है। असफलता केवल यह दर्शाती है कि सफलता का प्रयास पूरे मन से नहीं किया गया।",
    psychology: "मस्तिष्क में 'लॉस एवर्जन' (loss aversion) होता, जहाँ खोने का डर पाने की खुशी से कहीं अधिक शक्तिशाली होता है। इसलिए हम नया कदम उठाने से कतराते हैं।",
    reality: "बिना असफल हुए कोई भी व्यक्ति कभी महान नहीं बन सका। असफलता ही वह भट्टी है जो आपकी बुद्धि और चरित्र को परिपक्व बनाती है।",
    actionSteps: [
      "असफलता को अपनी पहचान मत बनने दें; यह केवल एक घटना (event) है, आप स्वयं नहीं।",
      "काम को फल की इच्छा के बिना केवल अपने कर्तव्य के रूप में करें, जैसा गीता में भगवान कृष्ण ने सिखाया है।",
      "हर असफलता से मिलने वाले सबक को नोट करें और अगली बार अधिक तैयारी से प्रयास करें।"
    ],
    dailyPractice: "हर हफ्ते कोई ऐसा नया काम करें जिसमें आपके असफल होने की संभावना हो, ताकि डर धीरे-धीरे दूर हो सके।",
    commonMistakes: [
      "डर के कारण नया प्रयास करना ही बंद कर देना।",
      "असफलता मिलने पर खुद को नाकारा और बेकार समझकर अवसाद में चले जाना।"
    ],
    quote: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    finalLesson: "असफलता सफलता का विपरीत नहीं है, बल्कि यह सफलता की यात्रा का एक आवश्यक पड़ाव है।"
  },
  "how to control anger?": {
    category: "mind",
    shortAnswer: "क्रोध हमारी उम्मीदों के टूटने और परिस्थितियों पर अपना नियंत्रण खोने की प्रतिक्रिया (reaction) है, जिसे केवल सजगता से नियंत्रित किया जा सकता है।",
    deepExplanation: "क्रोध एक सुलगता हुआ कोयला है जिसे आप दूसरों पर फेंकने के लिए अपने हाथ में पकड़ते हैं; अंततः जलता आपका ही हाथ है। जब भी आपको क्रोध आए, तो तुरंत प्रतिक्रिया देने के बजाय खुद को थोड़ा समय दें। जैसे गर्म पानी में कभी प्रतिबिंब नहीं देखा जा सकता, वैसे ही क्रोधित मन से कभी सही निर्णय नहीं लिया जा सकता।",
    psychology: "क्रोध हमारे 'फाइट या फ्लाइट' सिस्टम का हिस्सा है। जब भी हमें लगता है कि हमारा अहंकार या हमारी सीमाओं पर हमला हुआ है, तो मस्तिष्क में एड्रेनालाईन का स्तर बढ़ जाता है।",
    reality: "क्रोध में बोले गए कुछ सेकंड के शब्द आपके सालों पुराने पवित्र संबंधों को हमेशा के लिए नष्ट कर सकते हैं। क्रोध विवेक को पूरी तरह खा जाता है।",
    actionSteps: [
      "जब भी अत्यधिक क्रोध आए, तुरंत 1 से 10 तक उल्टी गिनती गिनें या वहां से हट जाएं।",
      "क्रोध की स्थिति में कभी भी कोई निर्णय न लें और न ही किसी को अपशब्द कहें।",
      "गहरी सांसें लें ताकि आपका नर्वस सिस्टम तुरंत शांत हो सके।"
    ],
    dailyPractice: "हर सुबह 15 मिनट प्राणायाम (विशेषकर अनुलोम-विलोम) का अभ्यास करें, यह मस्तिष्क को शांत रखता है।",
    commonMistakes: [
      "क्रोध को दबाने की कोशिश करना; क्रोध को दबाना नहीं बल्कि उसे सजगता से विसर्जित करना चाहिए।",
      "क्रोधित होने पर दूसरों को अपनी इस कमजोरी के लिए दोषी ठहराना।"
    ],
    quote: "क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः। स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥",
    finalLesson: "जो व्यक्ति अपने क्रोध पर नियंत्रण नहीं रख सकता, वह कभी भी आत्म-अनुशासन का शिखर नहीं छू सकता।"
  },
  "how to control lust?": {
    category: "discipline",
    shortAnswer: "वासना को रोकने का उपाय दमन (suppression) नहीं है, बल्कि अपनी कामुक ऊर्जा को ध्यान, कला और ज्ञान के माध्यम से ऊर्ध्वगामी (sublimation) करना है।",
    deepExplanation: "कामुकता मानव शरीर की सबसे शक्तिशाली और बुनियादी ऊर्जा है। यह ऊर्जा एक आग की तरह है; यदि इसे नियंत्रित किया जाए तो यह भोजन पका सकती है, और यदि अनियंत्रित छोड़ दिया जाए तो यह पूरे जंगल को जलाकर राख कर सकती है। ब्रह्मचर्य का पालन केवल वीर्य को रोकना नहीं, बल्कि इस दिव्य ऊर्जा को बुद्धि और ओज में रूपांतरित करना है।",
    psychology: "वासना तब हावी होती है जब मन खाली, आलसी और सस्ते डोपामाइन का आदी हो जाता है। गंदे दृश्यों का बार-बार चिंतन करने से मस्तिष्क में न्यूरल पाथवे मजबूत हो जाते हैं।",
    reality: "कामुकता का क्षणिक सुख केवल कुछ सेकंडों की उत्तेजना है, जिसके समाप्त होते ही गहरी ग्लानि, ऊर्जा का ह्रास और इच्छाशक्ति की कमजोरी का सामना करना पड़ता है।",
    actionSteps: [
      "इंटरनेट पर गंदे और उत्तेजक दृश्यों से पूरी तरह दूरी बनाएं (डिजिटल डिटॉक्स)।",
      "अपने आहार को सात्विक और हल्का रखें; अत्यधिक तीखा, मसालेदार भोजन वासना को भड़काता है।",
      "अत्यधिक कामुक विचार आने पर तुरंत ठंडे पानी से मुंह-हाथ धोएं या कसरत शुरू करें।"
    ],
    dailyPractice: "प्रतिदिन सुबह ब्रह्म मुहूर्त में उठकर कम से कम 15 मिनट ध्यान और प्राणायाम करें।",
    commonMistakes: [
      "यह सोचना कि थोड़ा सा अश्लील वीडियो देखने से कोई फर्क नहीं पड़ेगा; यह मन की एक गहरी चाल है।",
      "अकेले और अंधेरे कमरों में खाली बैठना, जो कि वासना के विचारों को बढ़ावा देता है।"
    ],
    quote: "ब्रह्मचर्य केवल शारीरिक वीर्य रक्षा नहीं है, यह मन के स्तर पर गंदे विचारों का विनाश और आत्म-नियंत्रण का शिखर है।",
    finalLesson: "कामुक ऊर्जा का रूपांतरण ही ओज और तेज का असली स्रोत है; अपनी इस अमूल्य संपदा को बचाएं।"
  }
};

// POST Route for AI Life Guide
app.post("/api/ai-guide", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "कृपया एक प्रश्न पूछें।" });
  }

  const normalizedQuestion = question.trim().toLowerCase().replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // 1. Check if we have exact fallback match for this question
  let matchedAnswerData = fallbackAnswers[normalizedQuestion];

  // 1b. Check if there's an approximate string match
  if (!matchedAnswerData) {
    const matchedKey = Object.keys(fallbackAnswers).find(k => 
      normalizedQuestion.includes(k) || k.includes(normalizedQuestion)
    );
    if (matchedKey) {
      matchedAnswerData = fallbackAnswers[matchedKey];
    }
  }

  let answer: any = null;

  // 2. Query Gemini if we don't have a direct answer or want dynamic generation
  if (!matchedAnswerData && ai && Date.now() > geminiBackoffUntil) {
    try {
      const prompt = `You are the Apna Sooch AI Life Guide. Help the user with their deep life or psychological question: "${question}"

Generate a highly practical, realistic, calm and inspiring response in pure Hindi (using standard Devnagari script). Do not lecture, preach, or use unrequested statistics. Always explain with clear real-life examples and represent the deep philosophical/psychological essence of "Apna Sooch" (focusing on Truth of Life, Gita Wisdom, Self-Discipline, Brahmacharya, Mind Science).

You MUST respond in valid JSON format matching this schema structure exactly. Do not include markdown code block syntax (like \`\`\`json) or any trailing commas that will break parsing. Do not include extra text outside the JSON.

JSON Schema:
{
  "shortAnswer": "Brief, powerful and direct 1-2 sentence answer (Mukhya Uttar)",
  "deepExplanation": "Deep, long-form explanation with a relatable, real-life example (Gahri Vyakhya with example)",
  "psychology": "The psychological mechanism behind this issue—why the human mind behaves this way (Manovigyan)",
  "reality": "The harsh, uncompromised truth of life regarding this issue that society avoids telling you (Jeevan ki Karvi Satyata)",
  "actionSteps": [
    "Practical action step 1 to implement immediately",
    "Practical action step 2 to implement immediately",
    "Practical action step 3 to implement immediately"
  ],
  "dailyPractice": "A small daily ritual, mindfulness exercise, or habit for long-term resolution (Dainik Abhyas)",
  "commonMistakes": [
    "Mistake 1 that people commonly make when dealing with this",
    "Mistake 2 that people commonly make when dealing with this"
  ],
  "quote": "A powerful quote or suvichar in Hindi relevant to this issue (Suvichar - write in Apna Sooch channel's serious and truthful tone)",
  "finalLesson": "One ultimate key takeaway sentence summarizing the lesson (Antim Seekh)",
  "category": "One single-word tag from this list that best describes this issue: 'life', 'mind', 'discipline', 'failure', 'loneliness', 'success', 'money', 'relationships', 'purpose', 'spirituality', 'reality', 'psychology', 'character'"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the official voice of Apna Sooch, a premium spiritual and psychology brand of India teaching Truth, Bhagavad Gita, Sanatan Dharma, Brahmacharya, and Life Lessons in powerful, realistic, calm Hindi.",
          temperature: 0.75,
          responseMimeType: "application/json"
        }
      });

      let text = response.text || "";
      if (text.includes("```")) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      answer = JSON.parse(text);
    } catch (err: any) {
      console.warn("Gemini AI Life Guide error, using synthesized fallback:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("429") || errMsg.toLowerCase().includes("quota")) {
        geminiBackoffUntil = Date.now() + 5 * 60 * 1000; // back off
      }
    }
  }

  // 3. Synthesize fallback if no answer yet
  if (!answer) {
    if (matchedAnswerData) {
      answer = { ...matchedAnswerData };
    } else {
      // Analyze keywords to provide the best matching synthesized fallback
      let matchedKey = "why am i always unhappy?"; // default fallback
      if (normalizedQuestion.includes("overthink") || normalizedQuestion.includes("सोच") || normalizedQuestion.includes("मन") || normalizedQuestion.includes("चिंता")) {
        matchedKey = "how to stop overthinking?";
      } else if (normalizedQuestion.includes("brahmacharya") || normalizedQuestion.includes("ब्रह्मचर्य") || normalizedQuestion.includes("वीर्य") || normalizedQuestion.includes("lust") || normalizedQuestion.includes("सेक्स") || normalizedQuestion.includes("वासना")) {
        matchedKey = "how to control lust?";
      } else if (normalizedQuestion.includes("anger") || normalizedQuestion.includes("क्रोध") || normalizedQuestion.includes("गुस्सा")) {
        matchedKey = "how to control anger?";
      } else if (normalizedQuestion.includes("leave") || normalizedQuestion.includes("छोड़") || normalizedQuestion.includes("लोग") || normalizedQuestion.includes("रिश्ते") || normalizedQuestion.includes("friend")) {
        matchedKey = "why do people leave?";
      } else if (normalizedQuestion.includes("discipline") || normalizedQuestion.includes("अनुशासन") || normalizedQuestion.includes("आलस्य")) {
        matchedKey = "how to become disciplined?";
      } else if (normalizedQuestion.includes("compare") || normalizedQuestion.includes("तुलना") || normalizedQuestion.includes("दिखावा")) {
        matchedKey = "why do i compare myself?";
      } else if (normalizedQuestion.includes("fail") || normalizedQuestion.includes("असफल") || normalizedQuestion.includes("डर") || normalizedQuestion.includes("डरता")) {
        matchedKey = "why am i afraid of failure?";
      }
      
      answer = { ...fallbackAnswers[matchedKey] };
    }
  }

  // 4. Attach Related Content based on category
  const category = answer.category || "life";
  let recVideos: any[] = [];
  let recShorts: any[] = [];
  let recEpisode: any = null;
  let recPlaylist: any = null;

  if (category === "discipline" || category === "character") {
    recVideos = videosData.filter(v => v.id === "brahmacharya-power" || v.id === "discipline-habits" || v.id === "solitude-benefits");
    recShorts = shortsData.filter(s => s.id === "short-1" || s.id === "short-3");
    recEpisode = REALITY_EPISODES.find(e => e.id === "episode-3") || REALITY_EPISODES[0];
    recPlaylist = playlistsData.find(p => p.id === "playlist-brahmacharya");
  } else if (category === "mind" || category === "psychology" || category === "failure") {
    recVideos = videosData.filter(v => v.id === "mind-control" || v.id === "anger-management" || v.id === "gita-shakti-1");
    recShorts = shortsData.filter(s => s.id === "short-3" || s.id === "short-2");
    recEpisode = REALITY_EPISODES.find(e => e.id === "episode-2") || REALITY_EPISODES[0];
    recPlaylist = playlistsData.find(p => p.id === "playlist-psychology");
  } else {
    // life, reality, loneliness, relationships, money, purpose, spirituality etc
    recVideos = videosData.filter(v => v.id === "solitude-benefits" || v.id === "detachment-lessons" || v.id === "theory-of-karma");
    recShorts = shortsData.filter(s => s.id === "short-6" || s.id === "short-5");
    recEpisode = REALITY_EPISODES.find(e => e.id === "episode-1") || REALITY_EPISODES[0];
    recPlaylist = playlistsData.find(p => p.id === "playlist-reality");
  }

  // Ensure we have exactly 3 related videos and 2 shorts as recommendations
  if (recVideos.length < 3) {
    const filler = videosData.filter(v => !recVideos.some(rv => rv.id === v.id));
    recVideos = [...recVideos, ...filler].slice(0, 3);
  }
  if (recShorts.length < 2) {
    const filler = shortsData.filter(s => !recShorts.some(rs => rs.id === s.id));
    recShorts = [...recShorts, ...filler].slice(0, 2);
  }
  if (!recEpisode) recEpisode = REALITY_EPISODES[0];
  if (!recPlaylist) recPlaylist = playlistsData[0];

  res.json({
    ...answer,
    relatedVideos: recVideos,
    relatedShorts: recShorts,
    relatedEpisode: recEpisode,
    relatedPlaylist: recPlaylist
  });
});

// End of API Routes

// Daily Gita verse of the day
app.get("/api/gita/daily", async (req, res) => {
  const dayIndex = new Date().getDate() % gitaVerses.length;
  const verse = gitaVerses[dayIndex];

  if (ai && Date.now() > geminiBackoffUntil) {
    try {
      // Prompt Gemini to generate a deeper explanation/modern life lesson for this verse in pure, inspiring Hindi
      const prompt = `अध्याय ${verse.chapter}, श्लोक ${verse.verse}:
      "${verse.sanskrit}"
      
      अर्थ: ${verse.hindiMeaning}
      
      इस श्लोक पर आधारित एक अत्यंत प्रेरणादायक, गहरा और आधुनिक जीवन से जुड़ा हुआ आध्यात्मिक व्याख्यान (Life Lesson) लगभग 150-200 शब्दों में शुद्ध और परिष्कृत हिंदी में लिखिए। यह युवाओं को ध्यान, अनुशासन, ब्रह्मचर्य, और जीवन के सच को समझने के लिए प्रेरित करने वाला होना चाहिए। "Apna Sooch" चैनल की गंभीर और सत्यनिष्ठ शैली में लिखिए।`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the official voice of Apna Sooch, a premium spiritual brand of India teaching Truth, Bhagavad Gita, Sanatan Dharma, Brahmacharya, and Life Lessons in powerful Hindi.",
          temperature: 0.7
        }
      });

      const aiExplanation = response.text || "";
      return res.json({
        ...verse,
        aiExplanation,
        isAiGenerated: true
      });
    } catch (err: any) {
      // Check if the error is a quota error or rate limit (429)
      const errMsg = err?.message || String(err);
      const isQuotaExceeded = errMsg.includes("429") || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("limit");
      
      if (isQuotaExceeded) {
        // Back off for 5 minutes to prevent spamming the API
        geminiBackoffUntil = Date.now() + 5 * 60 * 1000;
        console.warn("Gemini API Daily Gita: Quota exceeded/rate-limited. Activating 5-minute backoff.");
      } else {
        console.warn("Gemini API Daily Gita error:", errMsg);
      }

      return res.json({
        ...verse,
        aiExplanation: `यह श्लोक हमें सिखाता है कि ${verse.hindiMeaning} वर्तमान युग में, हम लगातार परिणामों के पीछे भागते हैं जिससे तनाव और निराशा पैदा होती है। श्री कृष्ण कहते हैं कि जब आप केवल अपने कर्म को ही अपनी साधना बना लेते हैं, तो आप परिणाम के भय से मुक्त हो जाते हैं। यही सच्ची स्वतंत्रता और आत्म-साक्षात्कार की सीढ़ी है।`,
        isAiGenerated: false
      });
    }
  }

  // Fallback if no Gemini key or rate-limited
  res.json({
    ...verse,
    aiExplanation: `यह श्लोक हमें सिखाता है कि ${verse.hindiMeaning} वर्तमान युग में, हम लगातार परिणामों के पीछे भागते हैं जिससे तनाव और निराशा पैदा होती है। श्री कृष्ण कहते हैं कि जब आप केवल अपने कर्म को ही अपनी साधना बना लेते हैं, तो आप परिणाम के भय से मुक्त हो जाते हैं। यही सच्ची स्वतंत्रता और आत्म-साक्षात्कार की सीढ़ी है।`,
    isAiGenerated: false
  });
});

// Daily spiritual quote with dynamic AI generator
app.get("/api/quotes/daily", async (req, res) => {
  const category = req.query.category as string || "general";
  const refresh = req.query.refresh === "true";

  if (ai && refresh && Date.now() > geminiBackoffUntil) {
    try {
      let prompt = "";
      if (category === "brahmacharya") {
        prompt = "ब्रह्मचर्य (Celibacy), वीर्य रक्षा और आत्म-अनुशासन पर एक नया शक्तिशाली हिंदी सुविचार (quote) लिखिए। यह सुविचार युवाओं के लिए प्रेरणादायक, गंभीर और सत्य पर आधारित होना चाहिए।";
      } else if (category === "gita") {
        prompt = "भगवद्गीता के दर्शन, कर्मयोग, या निष्काम कर्म पर एक नया रहस्यमयी और गहरा हिंदी सुविचार लिखिए।";
      } else if (category === "reality") {
        prompt = "संसार की वास्तविकता, मोह-माया की निरर्थकता और जीवन के परम सत्य पर एक नया हिंदी सुविचार लिखिए।";
      } else {
        prompt = "सत्य, सनातन धर्म, अध्यात्म और जीवन के संघर्ष पर एक नया प्रेरक और हृदयस्पर्शी हिंदी सुविचार लिखिए।";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt + " केवल एक उत्कृष्ट वाक्य लिखिए (अधिकतम 30 शब्द), लेखक के रूप में अंत में 'चैनल- Apna Sooch' लिखें।",
        config: {
          systemInstruction: "You are the official voice of Apna Sooch, creating highly curated and deep spiritual quotes in Hindi.",
          temperature: 0.8
        }
      });

      const fullQuote = response.text || "";
      const text = fullQuote.replace(/(- Apna Sooch|चैनल- Apna Sooch|Apna Sooch|लेखक:?.*$)/g, "").trim();

      return res.json({
        text: text || "सच्चा ज्ञान वही है जो आपके भीतर के अंधकार को नष्ट कर आपको सत्य के प्रकाश की ओर ले जाए।",
        author: "Apna Sooch",
        isAiGenerated: true
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isQuotaExceeded = errMsg.includes("429") || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("limit");
      
      if (isQuotaExceeded) {
        // Back off for 5 minutes to prevent spamming the API
        geminiBackoffUntil = Date.now() + 5 * 60 * 1000;
        console.warn("Gemini API Quote: Quota exceeded/rate-limited. Activating 5-minute backoff.");
      } else {
        console.warn("Gemini API Quote error:", errMsg);
      }
    }
  }

  // Fallback to random quote from our repository
  const quoteIndex = refresh 
    ? Math.floor(Math.random() * spiritualQuotes.length) 
    : (new Date().getDate() % spiritualQuotes.length);
  
  res.json({
    ...spiritualQuotes[quoteIndex],
    isAiGenerated: false
  });
});

// Search Route across all categories
app.get("/api/search", (req, res) => {
  const query = (req.query.q as string || "").toLowerCase();
  if (!query) {
    return res.json({ videos: [], shorts: [], quotes: [] });
  }

  const matchedVideos = videosData.filter(v => 
    v.title.toLowerCase().includes(query) || 
    v.description.toLowerCase().includes(query) || 
    v.category.toLowerCase().includes(query)
  );

  const matchedShorts = shortsData.filter(s => 
    s.title.toLowerCase().includes(query)
  );

  const matchedQuotes = spiritualQuotes.filter(q => 
    q.text.toLowerCase().includes(query)
  );

  res.json({
    videos: matchedVideos,
    shorts: matchedShorts,
    quotes: matchedQuotes
  });
});

// Handle contact submissions
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "कृपया सभी फ़ील्ड भरें।" });
  }
  // Store or process the message
  console.log(`[Contact Message] From: ${name} (${email}) - Message: ${message}`);
  res.json({ 
    success: true, 
    message: "जय श्री कृष्ण! आपका संदेश हमें प्राप्त हो गया है। अपना सोच परिवार से जुड़ने के लिए धन्यवाद।" 
  });
});

// Vite server middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
