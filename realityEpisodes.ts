export interface EpisodeLesson {
  truth: string;
  reality: string;
  psychology: string;
  discipline: string;
  mindset: string;
  action: string;
}

export interface EpisodeQuote {
  text: string;
  author: string;
}

export interface RealityEpisode {
  id: string;
  episodeNumber: string;
  season: string;
  title: string;
  subtitle: string;
  description: string;
  videoId: string;
  duration: string;
  views: string;
  publishDate: string;
  tags: string[];
  isLatest?: boolean;
  rating?: string;
  coverImage: string;
  thumbnailImage: string;
  readingTime: string;
  scriptParagraphs: string[];
  highlightedSentences: string[];
  lessons: EpisodeLesson;
  quotes: EpisodeQuote[];
  gallery: {
    url: string;
    caption: string;
  }[];
}

export const REALITY_EPISODES: RealityEpisode[] = [
  {
    id: "episode-1",
    episodeNumber: "EPISODE 01",
    season: "Season 1",
    title: "Dukhi Insaan Kabhi Gareeb Nahi Hota",
    subtitle: "The Profound Depth of Human Suffering & Inner Abundance",
    description: "क्या दुख वास्तव में एक अभिशाप है, या यह हमारी आत्मा को तराशने का एक दैवीय माध्यम है? जानिए क्यों एक दुखी इंसान कभी भी मानसिक या आध्यात्मिक रूप से गरीब नहीं हो सकता। जीवन की इस परम सच्चाई का गहरा मनोवैज्ञानिक और आध्यात्मिक विश्लेषण।",
    videoId: "W9C_CWhMv-s",
    duration: "14:25",
    views: "1.2M",
    publishDate: "2026-06-20",
    tags: ["Reality", "Psychology", "Life Lessons", "Sanatan Wisdom"],
    isLatest: true,
    rating: "9.9",
    coverImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200",
    thumbnailImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
    readingTime: "5 min read",
    scriptParagraphs: [
      "संसार का सबसे बड़ा रहस्य यह है कि जिस दुख से पूरी दुनिया भाग रही है, वही दुख मनुष्य के भीतर ज्ञान का असली बीज बोता है। जब तक जीवन में सब कुछ ठीक चल रहा होता है, हमारी चेतना सोई रहती है। हम सतही सुखों, भौतिक वस्तुओं और नकली संबंधों में खुद को संतुष्ट मानते हैं। लेकिन जैसे ही दुख का वज्रपात होता है, हमारे भ्रम का महल ढह जाता है।",
      "दुख इंसान को तोड़ता नहीं है, बल्कि वह उसके भीतर की उस नकली पहचान को तोड़ देता है जिसे अहंकार कहा जाता है। एक दुखी इंसान जब अकेले बैठता है, तो उसका मन बाहरी दुनिया से हटकर अंतर्मुखी हो जाता है। वह जीवन के गहरे प्रश्न पूछने लगता है। वह यह समझने लगता है कि संसार में कुछ भी स्थायी नहीं है। यही कारण है कि दुख में डूबा व्यक्ति विचारों और संवेदनाओं के स्तर पर सबसे अमीर बन जाता है। उसके पास वह समझ होती है जो किसी करोड़पति सुखभोगी के पास कभी नहीं हो सकती।",
      "भगवान श्री कृष्ण ने भगवद्गीता में कहा है कि यह जगत 'दुःखालयमशाश्वतम्' है—अर्थात यह दुखों का घर है और क्षणभंगुर है। जो व्यक्ति इस कड़वी सच्चाई को समय रहते स्वीकार कर लेता है, वह मानसिक रूप से स्वतंत्र हो जाता है। वह सुख में अति-उत्साहित नहीं होता और दुख में टूटता नहीं है। उसकी बुद्धि स्थिर (स्थिरप्रज्ञ) हो जाती है।",
      "कठिन परिस्थितियों में ही मनुष्य के वास्तविक चरित्र की परीक्षा होती है। जब आपके पास खोने के लिए कुछ नहीं बचता, तब आपके भीतर एक असीम साहस और वैराग्य का उदय होता है। एक दुखी इंसान जो आत्म-मंथन कर रहा है, वह संसार के प्रपंचों से ऊपर उठकर अपनी चेतना को जागृत करता है। वह सचमुच जीवन की उस परम संपदा को पा लेता है जो कभी नष्ट नहीं हो सकती।"
    ],
    highlightedSentences: [
      "दुख इंसान को तोड़ता नहीं है, बल्कि वह उसके भीतर की उस नकली पहचान को तोड़ देता है जिसे अहंकार कहा जाता है।",
      "दुख में डूबा व्यक्ति विचारों और संवेदनाओं के स्तर पर सबसे अमीर बन जाता है क्योंकि उसके पास वह समझ होती है जो किसी सुखभोगी के पास कभी नहीं हो सकती।",
      "जो व्यक्ति इस कड़वी सच्चाई को समय रहते स्वीकार कर लेता है, वह मानसिक रूप से स्वतंत्र हो जाता है।"
    ],
    lessons: {
      truth: "दुख कोई सजा नहीं है, यह प्रकृति का निमंत्रण है—बाहरी तमाशे से हटकर अपने भीतर लौटने का। संसार का हर बड़ा सत्य पीड़ा की कोख से ही जनमा है।",
      reality: "संसार में जिसे हम सुख कहते हैं, वह केवल दो दुखों के बीच का एक छोटा सा विराम है। सुख क्षणभंगुर है, जबकि दुख हमें शाश्वत की ओर धकेलता है।",
      psychology: "वेदना हमारे मन के झूठे तर्कों को नष्ट कर देती है। जब अहंकार टूटता है, तभी हृदय में सच्ची करुणा, संवेदनशीलता और अनूठा विवेक जन्म लेता है।",
      discipline: "विपत्ति के समय ही आत्म-अनुशासन और नियमों की असली परीक्षा होती है। कठिन काल में भी ब्रह्मचर्य और मन पर संयम रखना ही असली वीरता है।",
      mindset: "यह मत पूछो कि 'यह दुख मेरे साथ ही क्यों हुआ?' बल्कि यह पूछो कि 'यह परिस्थिति मुझे कौन सी नई सीख देने आई है?' ज्ञानी पुरुष सदैव सीख ढूंढते हैं।",
      action: "कर्म ही पूजा है। जब आपकी आत्मा रो रही हो, तब भी अपने कर्तव्यों (Dharma) का निष्पादन पूरी निष्ठा से करें। कर्म की पवित्रता ही परम शांति का मार्ग है।"
    },
    quotes: [
      { text: "दुख कोई सजा नहीं है, यह तो प्रकृति का निमंत्रण है—भीतर लौटने का।", author: "Apna Sooch" },
      { text: "जब तक आपकी आंखों में आंसू नहीं आते, तब तक आप संसार के झूठे मुखौटों के पार नहीं देख सकते।", author: "Apna Sooch" },
      { text: "असली गरीबी धन की कमी नहीं है, असली गरीबी तो जागृत चेतना और समझ का अभाव है।", author: "Apna Sooch" },
      { text: "जो दुख में भी अपनी गरिमा और सत्य को नहीं छोड़ता, वह ब्रह्मांड का सबसे अमीर जीव है।", author: "Apna Sooch" },
      { text: "वेदना ही वह भट्टी है जहां साधारण कोयला हीरा बनता है। पीड़ा से भागें नहीं, उसे समझें।", author: "Apna Sooch" }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600", caption: "The beginning of inner contemplation under the silent sky." },
      { url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600", caption: "Walking the narrow and desolate path of self-realization." },
      { url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600", caption: "Nature's raw wisdom teaching the impermanence of all things." },
      { url: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600", caption: "Lighting a single lamp of awareness in the absolute darkness of the mind." },
      { url: "https://images.unsplash.com/photo-1516307364728-22f127e727e7?auto=format&fit=crop&q=80&w=600", caption: "The rising sun of absolute wisdom signaling the end of suffering." }
    ]
  },
  {
    id: "episode-2",
    episodeNumber: "EPISODE 02",
    season: "Season 1",
    title: "मन की गुलामी सबसे बड़ी बेड़ी",
    subtitle: "Dethroning the Chattering Mind & Reclaiming Focus",
    description: "क्या आप अपने ही विचारों के कैदी हैं? जानिए कैसे आपका मन चौबीसों घंटे बिना आपकी अनुमति के अतीत और भविष्य में भागता रहता है, और कैसे सनातन ध्यान विधियों से इसे वश में किया जा सकता है।",
    videoId: "dQw4w9WgXcQ",
    duration: "11:50",
    views: "980K",
    publishDate: "2026-06-15",
    tags: ["Mindset", "Psychology", "Discipline", "Sanatan Wisdom"],
    rating: "9.7",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
    thumbnailImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    readingTime: "4 min read",
    scriptParagraphs: [
      "आज के युग में मनुष्य शारीरिक रूप से तो स्वतंत्र है, लेकिन मानसिक रूप से वह एक बहुत बड़ा गुलाम बन चुका है। वह गुलाम है अपनी आदतों का, अपने विकारों का, और सबसे बढ़कर—अपने ही मन के अनियंत्रित विचारों का। जब आप शांति से बैठना चाहते हैं, तब भी आपका मन शांत नहीं होता। वह निरंतर अतीत के पछतावे या भविष्य की चिंता की रील चलाता रहता है।",
      "मन का स्वभाव एक बंदर की तरह है जो निरंतर एक डाल से दूसरी डाल पर कूदता रहता है। लेकिन जब इस बंदर को तकनीक, सोशल मीडिया और सस्ते डोपामाइन (Instant Gratification) की शराब पिला दी जाती है, तो यह पूरी तरह पागल हो जाता है। यही कारण है कि आज का युवा चाहकर भी 15 मिनट एकाग्र नहीं रह पाता।",
      "भगवान श्री कृष्ण ने गीता के छठे अध्याय में स्पष्ट कहा है: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम्। अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥' यानी मन निसंदेह चंचल और कठिनता से वश में होने वाला है, लेकिन हे कुंतीपुत्र अर्जुन! इसे निरंतर अभ्यास (Practice) और वैराग्य (Detachment) द्वारा वश में किया जा सकता है।",
      "जब आप अपने मन के विचारों को केवल एक साक्षी भाव (Observer) से देखना शुरू करते हैं, बिना उनमें बहे, तो मन की शक्ति धीरे-धीरे कम होने लगती है। मन को वश में करने का अर्थ मन को मारना नहीं है, बल्कि उसे बुद्धि का दास बनाना है ताकि वह आपके जीवन के लक्ष्यों को पूरा करने में आपकी मदद करे।"
    ],
    highlightedSentences: [
      "आज के युग में मनुष्य शारीरिक रूप से स्वतंत्र है, लेकिन मानसिक रूप से वह अपने ही अनियंत्रित विचारों का कैदी बन चुका है।",
      "मन का स्वभाव एक बंदर की तरह है, जिसे जब सस्ते डोपामाइन की शराब पिला दी जाती है, तो यह पूरी तरह पागल हो जाता है।",
      "मन को वश में करने का अर्थ मन को मारना नहीं है, बल्कि उसे बुद्धि का दास बनाना है।"
    ],
    lessons: {
      truth: "मन स्वयं में कोई सत्ता नहीं है; यह केवल अतीत के अनुभवों और भविष्य की कल्पनाओं का एक बंडल है। मन का सत्य शून्य है।",
      reality: "संसार की 90% समस्याएं वास्तविक नहीं हैं, वे केवल मन के भीतर की अति-चिंता (Overthinking) का परिणाम हैं।",
      psychology: "मनुष्य अपने ही विचारों से डरता है। विचारों को बिना न्याय किए केवल देखना (Mindfulness) ही मन को शांत करने की सर्वश्रेष्ठ मनोवैज्ञानिक तकनीक है।",
      discipline: "मन के बहकावे में न आना ही असली तप है। जब मन कहे कि 'आज सो जाते हैं', तब उठकर ध्यान लगाना ही आत्म-अनुशासन है।",
      mindset: "आप अपने विचार नहीं हैं। आप वह चेतना हैं जो इन विचारों को देख रही है। इस भेद को समझना ही ज्ञान की शुरुआत है।",
      action: "मन की चंचलता को रोकने के लिए प्राणायाम और ध्यान को अपनी दैनिक दिनचर्या का अनिवार्य हिस्सा बनाएं।"
    },
    quotes: [
      { text: "जो मन को अपना मित्र नहीं बना सकता, उसका मन ही उसका सबसे बड़ा शत्रु बन जाता है।", author: "Apna Sooch" },
      { text: "विचार केवल बादल हैं, आप अनंत आकाश हैं। बादलों से आकाश कभी दूषित नहीं होता।", author: "Apna Sooch" },
      { text: "सस्ता डोपामाइन आपकी इच्छाशक्ति को दीमक की तरह खा जाता है।", author: "Apna Sooch" },
      { text: "शांति बाहर नहीं है, वह आपके मन की इच्छाओं के शांत होने की स्थिति का नाम है।", author: "Apna Sooch" },
      { text: "मन के हारे हार है, मन के जीते जीत। मन को जीतो, संसार स्वतः विजित हो जाएगा।", author: "Apna Sooch" }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600", caption: "Stillness of posture leads to the stillness of the mind." },
      { url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600", caption: "The absolute silence of an ancient temple where thoughts dissolve." },
      { url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600", caption: "The inner sun rising as the clouds of chattering thoughts vanish." }
    ]
  },
  {
    id: "episode-3",
    episodeNumber: "EPISODE 03",
    season: "Season 1",
    title: "ब्रह्मचर्य की असली ताकत",
    subtitle: "Conserving the Sacred Energy & Awakening Geniuses",
    description: "वीर्य रक्षा और आत्म-अनुशासन से कैसे आप अपने मस्तिष्क और शरीर को एक महामानव के रूप में विकसित कर सकते हैं। सनातन विज्ञान और मनोविज्ञान का अनूठा विश्लेषण।",
    videoId: "fHq2e1Y6D0g",
    duration: "18:10",
    views: "2.4M",
    publishDate: "2026-07-01",
    tags: ["Brahmacharya", "Discipline", "Psychology", "Motivation"],
    rating: "9.8",
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
    thumbnailImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    readingTime: "6 min read",
    scriptParagraphs: [
      "ब्रह्मचर्य केवल एक शारीरिक नियम नहीं है, बल्कि यह मानव चेतना को उच्चतम शिखर पर ले जाने का एक परम विज्ञान है। हमारे प्राचीन ऋषियों ने समझा था कि जो ऊर्जा जीवन का निर्माण कर सकती है, वही ऊर्जा यदि भीतर संचित और उर्ध्वगामी (Upward Flow) की जाए, तो वह असाधारण बौद्धिक और मानसिक शक्तियों को जन्म दे सकती है।",
      "आज के इंटरनेट और सोशल मीडिया के युग में युवाओं की मानसिक ऊर्जा को कामुकता और अश्लीलता के माध्यम से पूरी तरह निचोड़ा जा रहा है। इसका परिणाम है—स्मरण शक्ति का कमजोर होना, निरंतर थकावट, आत्मविश्वास की भारी कमी और इच्छाशक्ति (Willpower) का पूरी तरह नष्ट हो जाना। जब तक वीर्य की रक्षा नहीं होगी, तब तक मन कभी भी एकाग्र और शक्तिशाली नहीं बन सकता।",
      "पतंजलि योगसूत्र में स्पष्ट कहा गया है—'ब्रह्मचर्यप्रतिष्ठायां वीर्यलाभः' अर्थात ब्रह्मचर्य की दृढ़ प्रतिष्ठा होने पर असाधारण सामर्थ्य और ओज की प्राप्ति होती है। यह ओज ही मनुष्य के चेहरे पर चमक, उसकी वाणी में आकर्षण और उसकी आंखों में एक अनूठा तेज बनकर प्रकट होता है। स्वामी विवेकानंद, महाराणा प्रताप और वीर हनुमान का पूरा जीवन इसी दिव्य शक्ति का प्रमाण है।",
      "ब्रह्मचर्य का पालन केवल वीर्य को रोकना नहीं है, बल्कि अपनी ऊर्जा को रचनात्मक कार्यों, ध्यान, सेवा और अध्ययन में रूपांतरित (Transmute) करना है। जब यह ऊर्जा मस्तिष्क की ओर बहने लगती है, तो ओजस और तेजस का निर्माण होता है। यही वह परम शक्ति है जो एक साधारण इंसान को महामानव बना देती है।"
    ],
    highlightedSentences: [
      "जो ऊर्जा जीवन का निर्माण कर सकती है, वही ऊर्जा यदि भीतर उर्ध्वगामी की जाए, तो वह असाधारण बौद्धिक शक्तियों को जन्म देती है।",
      "इंटरनेट युग में युवाओं की ऊर्जा को कामुकता के माध्यम से निचोड़ा जा रहा है, जिससे उनकी इच्छाशक्ति पूरी तरह नष्ट हो रही है।",
      "ब्रह्मचर्य का असली अर्थ अपनी ऊर्जा का रचनात्मक और आध्यात्मिक कार्यों में रूपांतरण (Transmutation) करना है।"
    ],
    lessons: {
      truth: "वीर्य मनुष्य के शरीर की परम धातु है। यह केवल एक शारीरिक स्राव नहीं, बल्कि जीवन की मौलिक प्राणशक्ति (Vital Force) का सांद्रित रूप है।",
      reality: "संसार की क्षणिक कामुकता का सुख एक छलावा है जो कुछ सेकंडों में समाप्त हो जाता है और बदले में जीवन भर की मानसिक शक्ति और ओज को छीन लेता है।",
      psychology: "कामुकता का आदि होना मानसिक कमजोरी का लक्षण है। जब मन कमजोर होता है, तो वह सबसे आसान शारीरिक सुखों की ओर भागता है।",
      discipline: "दृश्यों और विचारों की शुचिता ही ब्रह्मचर्य की नींव है। मोबाइल और इंटरनेट पर गंदे दृश्यों से पूरी तरह दूरी बनाना ही पहली और सबसे महत्वपूर्ण सीढ़ी है।",
      mindset: "अपनी कामुक ऊर्जा को दमित (Suppress) न करें, बल्कि इसे कला, ध्यान, ज्ञान और सेवा के माध्यम से उर्ध्वगामी (Sublimate) करें।",
      action: "ब्रह्म मुहूर्त (सुबह 4 बजे) में उठकर प्राणायाम और जप की आदत डालें। यह ऊर्जा को मस्तिष्क की ओर ले जाने का सबसे वैज्ञानिक मार्ग है।"
    },
    quotes: [
      { text: "ब्रह्मचर्य ही जीवन है, वीर्य नाश ही मृत्यु है। अपनी इस दिव्य संपदा की रक्षा प्राणों से बढ़कर करें।", author: "Apna Sooch" },
      { text: "एक सच्चा ब्रह्मचारी पूरे संसार को अपनी वाणी और उपस्थिति मात्र से प्रभावित करने का सामर्थ्य रखता है।", author: "Apna Sooch" },
      { text: "ऊर्जा को दबाना विनाशकारी है, ऊर्जा को रूपांतरित करना ही सृजन का मूल है।", author: "Apna Sooch" },
      { text: "इंद्रियों पर विजय पाना ही संसार की सबसे बड़ी जीत है। इसके आगे चक्रवर्ती सम्राट का पद भी तुच्छ है।", author: "Apna Sooch" },
      { text: "ब्रह्मचर्य के बिना ध्यान असंभव है, और ध्यान के बिना ब्रह्मचर्य अधूरा है। दोनों एक दूसरे के पूरक हैं।", author: "Apna Sooch" }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600", caption: "The pristine morning hour (Brahmamuhurta) where the soul awakes." },
      { url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600", caption: "Channelling vital energy into higher dimensions of science and spirit." },
      { url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600", caption: "Unshakable strength and posture reflecting total sensory mastery." }
    ]
  }
];

export function syncEpisodesWithPlaylist(youtubeVideos: any[]): RealityEpisode[] {
  if (!youtubeVideos || youtubeVideos.length === 0) {
    return REALITY_EPISODES;
  }

  return youtubeVideos.map((ytVideo, index) => {
    // Look for matching local episode by videoId
    const localMatch = REALITY_EPISODES.find(
      ep => ep.videoId === ytVideo.youtubeId || ep.videoId === ytVideo.id
    );

    const epNum = index + 1;
    const epShortString = epNum < 10 ? `EPISODE 0${epNum}` : `EPISODE ${epNum}`;

    if (localMatch) {
      return {
        ...localMatch,
        id: `episode-${epNum}`,
        episodeNumber: epShortString,
        title: ytVideo.title || localMatch.title,
        description: ytVideo.description || localMatch.description,
        views: ytVideo.views || localMatch.views,
        duration: ytVideo.duration || localMatch.duration,
        publishDate: ytVideo.date || localMatch.publishDate,
        thumbnailImage: ytVideo.thumbnail || localMatch.thumbnailImage,
        coverImage: ytVideo.thumbnail || localMatch.coverImage
      };
    }

    // Generate elegant default metadata for newly uploaded playlist episodes
    const scriptParas = ytVideo.description
      ? ytVideo.description.split("\n\n").map((p: string) => p.trim()).filter(Boolean)
      : [
          "इस वीडियो के माध्यम से जीवन के एक महत्वपूर्ण सत्य को उजागर किया गया है। जीवन की गहराइयों को समझने के लिए पूरा वीडियो अवश्य देखें।",
          "अपने विचारों को साक्षी भाव से देखना और स्वयं में सुधार करना ही जीवन का असली लक्ष्य है। यह वृत्तचित्र उसी मार्ग की ओर संकेत करता है।"
        ];

    return {
      id: `episode-${epNum}`,
      episodeNumber: epShortString,
      season: "Season 1",
      title: ytVideo.title,
      subtitle: "Cinematic wisdom & self-discovery",
      description: ytVideo.description || "A deep, documentary-style exploration of truth, discipline, and the realities of human behavior.",
      videoId: ytVideo.youtubeId || ytVideo.id,
      duration: ytVideo.duration || "12:00",
      views: ytVideo.views || "100K",
      publishDate: ytVideo.date || new Date().toISOString().split('T')[0],
      tags: ["Reality", "Life Lessons", "Sanatan Wisdom"],
      coverImage: ytVideo.thumbnail || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200",
      thumbnailImage: ytVideo.thumbnail || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
      readingTime: `${Math.max(3, Math.min(8, Math.ceil(scriptParas.join(" ").length / 500)))} min read`,
      scriptParagraphs: scriptParas,
      highlightedSentences: [
        scriptParas[0] ? scriptParas[0].substring(0, 100) + "..." : "अपने विचारों को साक्षी भाव से देखना और स्वयं में सुधार करना ही जीवन का असली लक्ष्य है।"
      ],
      lessons: {
        truth: "जीवन का अंतिम सत्य कर्म और धर्म के संतुलन में है। समय का सदुपयोग करें और विचलित न हों।",
        reality: "संसार की चमक क्षणिक है, जबकि आंतरिक शांति ही वास्तविक और शाश्वत है।",
        psychology: "मन एक उत्कृष्ट सेवक है परंतु एक अत्यंत घातक स्वामी है। इसे अपनी चेतना का दास बनाएं।",
        discipline: "दैनिक जीवन में छोटे-छोटे संकल्पों का पालन करना ही आत्म-नियंत्रण और ओज की ओर ले जाता है।",
        mindset: "परिस्थितियां आपके वश में नहीं हैं, परंतु उन पर आपकी प्रतिक्रिया पूर्णतः आपके नियंत्रण में है।",
        action: "बिना फल की चिंता किए निष्काम भाव से अपने कर्तव्यों का पालन करना ही सर्वश्रेष्ठ कर्म है।"
      },
      quotes: [
        { text: "जो स्वयं को जीत लेता है, उसके लिए पूरा ब्रह्मांड अनुकूल हो जाता है।", author: "Apna Sooch" },
        { text: "शांति परिस्थितियों में नहीं, आपके विचारों के ठहराव में है।", author: "Apna Sooch" }
      ],
      gallery: [
        { url: ytVideo.thumbnail || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600", caption: "Contemplating life and purpose." },
        { url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600", caption: "Walking the path of truth and discipline." }
      ]
    };
  });
}
