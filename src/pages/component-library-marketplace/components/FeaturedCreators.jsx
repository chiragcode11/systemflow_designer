import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedCreators = ({ creators = [], onViewProfile = () => {} }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
          <Icon name="Users" size={24} className="text-primary" />
          <span>Featured Creators</span>
        </h2>
        <Button variant="ghost" size="sm">
          View All
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creators?.map((creator) => (
          <div
            key={creator?.id}
            className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <Image
                  src={creator?.avatar}
                  alt={creator?.name}
                  className="w-12 h-12 rounded-full"
                />
                {creator?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{creator?.name}</h3>
                <p className="text-sm text-muted-foreground">{creator?.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {creator?.bio}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Package" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{creator?.componentsCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Download" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{creator?.totalDownloads}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-yellow-400" />
                  <span className="text-muted-foreground">{creator?.averageRating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {creator?.specialties?.slice(0, 2).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                  >
                    {specialty}
                  </span>
                ))}
                {creator?.specialties?.length > 2 && (
                  <span className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground">
                    +{creator?.specialties?.length - 2}
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onViewProfile(creator)}
                className="group-hover:border-primary/50"
              >
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCreators;