import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactGA from 'react-ga4';
import videosData from '../../data/videos.json';

const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
if (TRACKING_ID) ReactGA.initialize(TRACKING_ID);

// Dynamic import for VideoCard
const VideoCard = dynamic(() => import('../../components/VideoCard'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

const EditingWorks: NextPage = () => {
  const [videos, setVideos] = useState(videosData);
  const [filteredVideos, setFilteredVideos] = useState(videosData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get all unique tags from videos
  const allTags = Array.from(
    new Set(videos.flatMap(video => video.tags || []))
  ).sort();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/editing-works', title: 'Editing Works' });
  }, []);

  useEffect(() => {
    let filtered = videos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        video =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(video =>
        selectedTags.some(tag => video.tags?.includes(tag))
      );
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  return (
    <div className="relative my-10 sm:my-20">
      {/* Header Section */}
      <div className="mb-12">
        <div className="text-4xl md:text-5xl font-medium mb-4">
          Video Editing Portfolio
        </div>
        <div className="text-muted-foreground font-light max-w-3xl">
          Explore my creative video editing work spanning various genres including cinematic travel videos, 
          commercial promos, music videos, corporate events, and creative visual effects. Each project 
          showcases different editing techniques and storytelling approaches.
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search videos by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTags.length === 0 ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={clearFilters}
          >
            All
          </Badge>
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* View Mode Toggle and Results Count */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Videos Grid/List */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-2xl font-medium text-muted-foreground mb-2">
            No videos found
          </div>
          <div className="text-muted-foreground">
            Try adjusting your search terms or filters
          </div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
            : "space-y-4"
        }>
          {filteredVideos.map((video, index) => (
            <div key={video.id} className={viewMode === 'list' ? 'flex gap-4' : ''}>
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-16 pt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{videos.length}</div>
            <div className="text-muted-foreground">Total Videos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{allTags.length}</div>
            <div className="text-muted-foreground">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">2+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditingWorks; 