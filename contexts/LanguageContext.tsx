
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Define translations
const translations = {
  en: {
    appName: 'talvri',
    searchPlaceholder: 'Search for movies & tv shows...',
    movies: 'Movies',
    tvShows: 'TV Shows',
    home: 'Home',
    search: 'Search',
    watchlist: 'Watchlist',
    favorites: 'Favorites',
    popular: 'Popular',
    topRated: 'Top Rated',
    nowPlaying: 'Now Playing',
    upcoming: 'Upcoming',
    popularTvShows: 'Popular TV Shows',
    topRatedTvShows: 'Top Rated TV Shows',
    airingToday: 'Airing Today',
    viewAll: 'View All',
    noMoviesFound: 'No results found. Try adjusting your search or filters.',
    myFavorites: 'My Favorites',
    myWatchlist: 'My Watchlist',
    noFavorites: "You haven't added any favorites yet.",
    emptyWatchlist: 'Your watchlist is empty.',
    noFavoriteTvShows: "You haven't added any favorite TV shows yet.",
    emptyTvShowWatchlist: 'Your TV show watchlist is empty.',
    genre: 'Genre',
    allGenres: 'All Genres',
    releaseYear: 'Release Year',
    anyYear: 'Any Year',
    minRating: 'Min. Rating: {rating} ★',
    anyRating: 'Min. Rating: Any',
    resetFilters: 'Reset Filters',
    whereToWatch: 'Where to Watch',
    stream: 'Stream',
    buy: 'Buy',
    rent: 'Rent',
    cast: 'Cast',
    youMightAlsoLike: 'You might also like',
    releaseDate: 'Release Date:',
    firstAirDate: 'First Air Date:',
    rating: 'Rating:',
    director: 'Director',
    creator: 'Creator',
    crew: 'Crew',
    reviews: 'Reviews',
    noReviewsFound: 'No reviews found for this movie yet.',
    readMore: 'Read More',
    showLess: 'Show Less',
    seasonsAndEpisodes: 'Seasons & Episodes',
    season: 'Season',
    episode: 'Episode',
    tmdbAttribution: '',
    errorOccurred: 'An error occurred',
    failedToLoadMovies: 'Failed to load movies. Please try again later.',
    failedToFetchDetails: 'Failed to fetch movie details',
    couldNotFetchRandom: 'Could not fetch a random movie. Please try again later.',
    failedToFetchList: 'Failed to fetch movies from your list.',
    viewDetailsFor: 'View details for {title}',
    addToWatchlist: 'Add {title} to watchlist',
    removeFromWatchlist: 'Remove {title} from watchlist',
    addToFavorites: 'Add {title} to favorites',
    removeFromFavorites: 'Remove {title} from favorites',
    toggleTheme: 'Toggle theme',
    closeModal: 'Close modal',
    goToTop: 'Go to top',
    playTrailer: 'Play trailer',
    viewDetails: 'View Details',
    biography: 'Biography',
    knownFor: 'Known For',
    born: 'Born',
    died: 'Died',
    placeOfBirth: 'Place of Birth',
    // Fix: Add missing translation keys.
    watchNow: 'Watch Now',
    browse: 'Browse',
    trending: 'Trending',
    discover: 'Discover',
    liveBroadcasts: 'Live Broadcasts',
    menu: 'Menu',
    surpriseMe: 'Surprise Me',
    action: 'Action',
    adventure: 'Adventure',
  },
  ar: {
    appName: 'talvri',
    searchPlaceholder: 'ابحث عن أفلام ومسلسلات...',
    movies: 'أفلام',
    tvShows: 'مسلسلات',
    home: 'الرئيسية',
    search: 'بحث',
    watchlist: 'قائمة المشاهدة',
    favorites: 'المفضلة',
    popular: 'الأكثر شيوعًا',
    topRated: 'الأعلى تقييمًا',
    nowPlaying: 'يعرض الآن',
    upcoming: 'قادم قريبًا',
    popularTvShows: 'مسلسلات شائعة',
    topRatedTvShows: 'الأعلى تقييماً',
    airingToday: 'يعرض اليوم',
    viewAll: 'عرض الكل',
    noMoviesFound: 'لا توجد نتائج. حاول تعديل بحثك أو الفلاتر.',
    myFavorites: 'أفلامي المفضلة',
    myWatchlist: 'قائمة المشاهدة الخاصة بي',
    noFavorites: 'لم تقم بإضافة أي أفلام مفضلة بعد.',
    emptyWatchlist: 'قائمة المشاهدة فارغة.',
    noFavoriteTvShows: 'لم تقم بإضافة أي مسلسلات مفضلة بعد.',
    emptyTvShowWatchlist: 'قائمة مشاهدة المسلسلات فارغة.',
    genre: 'النوع',
    allGenres: 'كل الأنواع',
    releaseYear: 'سنة الإصدار',
    anyYear: 'أي سنة',
    minRating: 'أقل تقييم: {rating} ★',
    anyRating: 'أقل تقييم: أي',
    resetFilters: 'إعادة تعيين الفلاتر',
    whereToWatch: 'أين تشاهد',
    stream: 'بث',
    buy: 'شراء',
    rent: 'إيجار',
    cast: 'طاقم التمثيل',
    youMightAlsoLike: 'قد يعجبك أيضًا',
    releaseDate: 'تاريخ الإصدار:',
    firstAirDate: 'تاريخ أول عرض:',
    rating: 'التقييم:',
    director: 'المخرج',
    creator: 'المبتكر',
    crew: 'طاقم العمل',
    reviews: 'المراجعات',
    noReviewsFound: 'لا توجد مراجعات لهذا الفيلم بعد.',
    readMore: 'اقرأ المزيد',
    showLess: 'عرض أقل',
    seasonsAndEpisodes: 'المواسم والحلقات',
    season: 'الموسم',
    episode: 'حلقة',
    tmdbAttribution: '',
    errorOccurred: 'حدث خطأ',
    failedToLoadMovies: 'فشل تحميل الأفلام. يرجى المحاولة مرة أخرى في وقت لاحق.',
    failedToFetchDetails: 'فشل في جلب تفاصيل الفيلم',
    couldNotFetchRandom: 'تعذر جلب فيلم عشوائي. يرجى المحاولة مرة أخرى في وقت لاحق.',
    failedToFetchList: 'فشل في جلب الأفلام من قائمتك.',
    viewDetailsFor: 'عرض تفاصيل {title}',
    addToWatchlist: 'إضافة {title} إلى قائمة المشاهدة',
    removeFromWatchlist: 'إزالة {title} من قائمة المشاهدة',
    addToFavorites: 'إضافة {title} إلى المفضلة',
    removeFromFavorites: 'إزالة {title} من المفضلة',
    toggleTheme: 'تبديل المظهر',
    closeModal: 'إغلاق النافذة',
    goToTop: 'اذهب للأعلى',
    playTrailer: 'تشغيل المقطع الدعائي',
    viewDetails: 'عرض التفاصيل',
    biography: 'السيرة الذاتية',
    knownFor: 'أشهر الأعمال',
    born: 'الميلاد',
    died: 'الوفاة',
    placeOfBirth: 'مكان الميلاد',
    // Fix: Add missing translation keys.
    watchNow: 'شاهد الآن',
    browse: 'تصفح',
    trending: 'شائع',
    discover: 'اكتشف',
    liveBroadcasts: 'بث مباشر',
    menu: 'القائمة',
    surpriseMe: 'فاجئني',
    action: 'أكشن',
    adventure: 'مغامرة',
  }
};

export type Language = 'en' | 'ar';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLang = window.localStorage.getItem('language');
      if (storedLang === 'ar' || storedLang === 'en') return storedLang;
    }
    if (typeof window !== 'undefined' && navigator.language.startsWith('ar')) {
        return 'ar';
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  const t = useCallback((key: TranslationKey, vars: Record<string, string | number> = {}) => {
    let text = translations[language][key] || translations['en'][key];
    Object.keys(vars).forEach(varKey => {
      const regex = new RegExp(`{${varKey}}`, 'g');
      text = text.replace(regex, String(vars[varKey]));
    });
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
