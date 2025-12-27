import { ExternalLink } from 'lucide-react';

const CardProject = ({ 
  Img, 
  Title, 
  Description, 
  Link: ProjectLink, 
  id, // если не используется, можно удалить
  // можно добавить дополнительные пропсы, например:
  // Tags = [],
  // GitHubLink,
  // Technologies = []
}) => {
  
  const handleLiveDemo = (e) => {
    // Более чистая проверка
    if (!ProjectLink) {
      e.preventDefault();
      // Лучше использовать toast или другие методы уведомлений
      console.warn("Live demo link is not available for:", Title);
      // Можно также не показывать alert в production
      if (process.env.NODE_ENV !== 'production') {
        alert("Live demo link is not available");
      }
    }
  };

  return (
    <div className="group relative w-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
        
        {/* Анимированная обводка при наведении */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        </div>
    
        <div className="relative p-5 z-10">
          {/* Контейнер для изображения с фиксированной высотой для консистентности */}
          <div className="relative overflow-hidden rounded-lg aspect-video">
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              // Добавляем fallback для изображений
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x225/1e293b/94a3b8?text=Project+Image";
              }}
            />
            {/* Оверлей при наведении */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {Title}
            </h3>
            
            <p className="text-gray-300/80 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
              {Description}
            </p>
            
            {/* Можно добавить теги технологий */}
            {/* {Tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {Tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-slate-800/50 rounded-md text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )} */}
            
            <div className="pt-4 flex items-center justify-between">
              {ProjectLink ? (
                <a
                  href={ProjectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-200 group/link border border-blue-500/20 hover:border-blue-500/40"
                  aria-label={`View live demo of ${Title}`}
                >
                  <span className="text-sm font-medium">Live Demo</span>
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              ) : (
                <button 
                  disabled
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg text-gray-500 cursor-not-allowed"
                  aria-label="Live demo not available"
                >
                  <span className="text-sm font-medium">Demo Not Available</span>
                </button>
              )}
              
              {/* Можно добавить ссылку на GitHub */}
              {/* {GitHubLink && (
                <a
                  href={GitHubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`View ${Title} source code on GitHub`}
                >
                  <Github className="w-5 h-5" />
                </a>
              )} */}
            </div>
          </div>
          
          {/* Градиентная граница - исправлен z-index */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-xl transition-all duration-300 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;