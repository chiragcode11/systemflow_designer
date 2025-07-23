import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DesignCard = ({ design, viewMode = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(design.isLiked || false);
  const [likeCount, setLikeCount] = useState(design.likes);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/design/${design.id}`);
  };

  const handleFork = (e) => {
    e.stopPropagation();
    console.log('Fork design:', design.id);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border border-border p-6 hover:border-primary/20 transition-all duration-200 cursor-pointer group">
        <div className="flex gap-6">
          {/* Thumbnail */}
          <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image
              src={design.thumbnail}
              alt={design.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {design.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {design.description}
                </p>
              </div>
              <div className="flex items-center space-x-1 ml-4">
                {design.badges?.map((badge, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full ${
                      badge === 'Interview Winner' ? 'bg-accent/10 text-accent' :
                      badge === 'Featured' ? 'bg-primary/10 text-primary' :
                      badge === 'Template'? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src={design.creator.avatar}
                alt={design.creator.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="text-sm font-medium text-foreground">{design.creator.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{design.creator.title}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {design.createdAt}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {design.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                >
                  {tag}
                </span>
              ))}
              {design.tags.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{design.tags.length - 4} more
                </span>
              )}
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Eye" size={14} />
                  <span>{design.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Heart" size={14} />
                  <span>{likeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MessageCircle" size={14} />
                  <span>{design.comments}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} />
                  <span>{design.rating}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? 'text-red-500' : ''}
                >
                  <Icon name={isLiked ? "Heart" : "Heart"} size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Icon name="Share" size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleFork}>
                  <Icon name="GitFork" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-all duration-200 cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={design.thumbnail}
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {design.badges?.map((badge, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm ${
                badge === 'Interview Winner' ? 'bg-accent/90 text-white' :
                badge === 'Featured' ? 'bg-primary/90 text-white' :
                badge === 'Template'? 'bg-secondary/90 text-white' : 'bg-black/50 text-white'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`backdrop-blur-sm ${isLiked ? 'text-red-500 bg-white/20' : 'text-white bg-black/20'}`}
          >
            <Icon name="Heart" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="backdrop-blur-sm text-white bg-black/20"
          >
            <Icon name="Share" size={16} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {design.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {design.description}
        </p>

        {/* Creator */}
        <div className="flex items-center space-x-2 mb-3">
          <Image
            src={design.creator.avatar}
            alt={design.creator.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-medium text-foreground">{design.creator.name}</span>
          <span className="text-xs text-muted-foreground">{design.createdAt}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {design.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
            >
              {tag}
            </span>
          ))}
          {design.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{design.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} />
              <span>{design.views > 1000 ? `${(design.views/1000).toFixed(1)}k` : design.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Heart" size={14} />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} />
              <span>{design.rating}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFork}
            className="text-xs"
          >
            <Icon name="GitFork" size={14} />
            <span className="ml-1">Fork</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;