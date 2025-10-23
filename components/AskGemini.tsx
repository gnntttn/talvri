import React, { useState } from 'react';
import type { Movie, TVShow } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { askAboutMedia } from '../services/geminiService';

interface AskGeminiProps {
  media: Movie | TVShow;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.145.604c.731.107 1.023 1.005.494 1.521l-2.998 2.922.708 4.129c.125.728-.638 1.285-1.29.948L10 14.85l-3.713 1.952c-.652.337-1.415-.22-1.29-.948l.708-4.129-2.998-2.922c-.529-.516-.237-1.414.494-1.521l4.145-.604 1.83-3.751Z" clipRule="evenodd" />
  </svg>
);

const SuggestionButton: React.FC<{ text: string; onClick: () => void; }> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
  >
    {text}
  </button>
);

export const AskGemini: React.FC<AskGeminiProps> = ({ media }) => {
  const { t, language } = useTranslation();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaTitle = 'title' in media ? media.title : media.name;

  const handleSubmit = async (e?: React.FormEvent, suggestedQuestion?: string) => {
    if (e) e.preventDefault();
    const query = suggestedQuestion || question;
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setError(null);
    

    try {
      const result = await askAboutMedia(media, query, language);
      setResponse(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
      // Clear question only after a successful submission from text area
      if(!suggestedQuestion) setQuestion('');
    }
  };

  const handleSuggestionClick = (suggestionKey: 'suggestionExplainEnding' | 'suggestionIsItForKids' | 'suggestionMainTheme') => {
    const suggestedQuestion = t(suggestionKey);
    setQuestion(suggestedQuestion);
    handleSubmit(undefined, suggestedQuestion);
  }

  return (
    <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-700 text-left rtl:text-right">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-indigo-500" />
        {t('askGemini')}
      </h3>
      
      {(isLoading || response || error) && (
        <div className="mb-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 min-h-[80px]">
          {isLoading && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400">{t('geminiIsThinking')}</p>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {response && (
             <div
                className="text-sm text-slate-700 dark:text-slate-200 prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: response }}
            />
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('askAnythingAbout', { title: mediaTitle })}
          className="w-full rounded-md border-0 bg-slate-100 dark:bg-slate-800/50 py-2 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-colors duration-200"
          rows={2}
          disabled={isLoading}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
            <div className="flex flex-wrap items-center gap-2">
                <SuggestionButton text={t('suggestionExplainEnding')} onClick={() => handleSuggestionClick('suggestionExplainEnding')} />
                <SuggestionButton text={t('suggestionIsItForKids')} onClick={() => handleSuggestionClick('suggestionIsItForKids')} />
                <SuggestionButton text={t('suggestionMainTheme')} onClick={() => handleSuggestionClick('suggestionMainTheme')} />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={isLoading || !question.trim()}
            >
                {t('ask')}
            </button>
        </div>
      </form>
       <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">{t('geminiDisclaimer')}</p>
    </div>
  );
};
