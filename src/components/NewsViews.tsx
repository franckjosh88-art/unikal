import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Share2, 
  BookOpen 
} from 'lucide-react';
import newsData from '../data/news.json';

interface NewsViewsProps {
  viewType: 'archive' | 'detail';
  selectedNewsId?: string;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function NewsViews({ viewType, selectedNewsId, onBack, onNavigate }: NewsViewsProps) {
  const [filterCategory, setFilterCategory] = useState('Tous');

  const sanitizeNewsList = (list: any[]) => {
    return list.map(item => {
      // Clear image if it's an Unsplash stock photo
      if (item.image && item.image.includes('unsplash.com')) {
        return { ...item, image: "" };
      }
      return item;
    });
  };

  const [allNews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('amani_news_list');
      if (saved) {
        return sanitizeNewsList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error reading local news list in NewsViews:", e);
    }
    return sanitizeNewsList(newsData);
  });

  const categories = ['Tous', 'Académique', 'Clinique', 'Coopération', 'Recherche'];

  const filteredNews = filterCategory === 'Tous' 
    ? allNews 
    : allNews.filter(item => item.category === filterCategory);

  const selectedArticle = allNews.find(item => item.id === selectedNewsId);

  return (
    <div className="w-full font-sans space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 text-slate-700 hover:text-blue-900 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Retour</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-slate-400 font-bold">Actualités</span>
        {viewType === 'detail' && selectedArticle && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-blue-900 font-extrabold truncate max-w-[200px]">{selectedArticle.title}</span>
          </>
        )}
      </div>

      {/* ARCHIVE VIEW */}
      {viewType === 'archive' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-amber-400" />
              <span>Actualités de l'Université</span>
            </h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 max-w-2xl font-medium">Découvrez les derniers événements marquants, les annonces officielles, et la vie de notre communauté universitaire au Tanganyika.</p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
                <div className="flex flex-col h-full">
                  {item.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-blue-900 text-white font-black text-[9px] uppercase tracking-wider rounded">
                        {item.category}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col space-y-3">
                    {!item.image && (
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-blue-900 text-white font-black text-[9px] uppercase tracking-wider rounded">
                          {item.category}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Le {item.date}</span>
                    </div>
                    <h3 className="text-xs font-black text-slate-900 leading-snug line-clamp-2 hover:text-blue-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3 flex-1">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0 border-t border-slate-100/60 mt-4">
                  <button 
                    onClick={() => {
                      onNavigate(`news-detail-${item.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-black text-blue-900 hover:text-amber-500 flex items-center gap-1 group/btn cursor-pointer"
                  >
                    <span>Lire la suite</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL VIEW */}
      {viewType === 'detail' && selectedArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main article body */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            
            <div className="space-y-4">
              <span className="px-3 py-1 bg-blue-100/60 text-blue-900 font-black text-[10px] uppercase tracking-wider rounded-full">
                {selectedArticle.category}
              </span>
              <h1 className="text-xl md:text-3xl font-black text-slate-900 leading-tight">
                {selectedArticle.title}
              </h1>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Publié le {selectedArticle.date}</span>
                </div>
                <span>•</span>
                <span>Par Secrétariat Général du Lycée Amani</span>
              </div>
            </div>

            {/* Main Featured Image */}
            {selectedArticle.image && (
              <div className="h-96 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                
              </div>
            )}

            {/* Article Content */}
            <div className={`text-slate-700 text-xs md:text-sm leading-relaxed font-medium space-y-4 pt-4 ${selectedArticle.image ? 'border-t border-slate-100' : ''}`}>
              <p className="font-extrabold text-slate-900 text-sm md:text-base leading-relaxed">
                {selectedArticle.excerpt}
              </p>
              <p>
                {selectedArticle.content}
              </p>
              <p>
                L'Université de Kalemie exprime ses vives félicitations à l'ensemble du personnel académique, des étudiants et des partenaires techniques pour la réussite constante de nos filières d'apprentissage et la qualité croissante de notre offre d'études en République Démocratique du Congo.
              </p>
            </div>

          </div>

          {/* Right side suggestions */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Articles Connexes</h3>
              
              <div className="space-y-4">
                {allNews
                  .filter(item => item.id !== selectedArticle.id)
                  .slice(0, 3)
                  .map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        onNavigate(`news-detail-${item.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer group space-y-1"
                    >
                      <span className="text-[9px] font-black uppercase text-blue-900 block">{item.category}</span>
                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-amber-500 leading-snug transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono block">Le {item.date}</span>
                    </div>
                  ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
