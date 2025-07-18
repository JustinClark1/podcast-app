// index.tsx - Main App (Refactored)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Audio } from 'expo-av';

// Import our components and services
import { SearchBar } from '../../components/SearchBar';
import { PodcastList } from '../../components/PodcastList';
import { TopicSelector } from '../../components/TopicSelector';
import { AudioPlayer } from '../../components/AudioPlayer';
import { PodcastService } from '../../services/PodcastService';
import { Podcast, Episode, Topic } from '../../types/podcast.types';

const podcastService = new PodcastService();

export default function HomeScreen() {
  // State management
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<{podcast: Podcast, episode: Episode} | null>(null);
  const [subscribedPodcasts, setSubscribedPodcasts] = useState(new Set<string>());
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [debugMessage, setDebugMessage] = useState('Ready with Listen Notes API');
  
  // Topic-related state
  const [selectedTopics, setSelectedTopics] = useState(new Set<string>());
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [topicEpisode, setTopicEpisode] = useState<Episode | null>(null);

  // Sample podcasts for initial display
  const samplePodcasts: Podcast[] = [
    {
      id: 'sample-1',
      title: 'Search for real podcasts!',
      description: 'Try searching for "Joe Rogan", "tech", "NPR", or any podcast name to get real results.',
      author: 'Demo App',
      episodes: [{
        id: 'demo',
        title: 'Demo Episode',
        description: 'Search for real podcasts to see actual episodes',
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        duration: '0:05',
        publishDate: '2025-01-15'
      }]
    }
  ];

  // Initialize app
  useEffect(() => {
    setPodcasts(samplePodcasts);
    
    // Configure audio for playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Cleanup audio when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Search for podcasts
  const searchPodcasts = async () => {
    if (!searchQuery.trim()) {
      setPodcasts(samplePodcasts);
      return;
    }

    setLoading(true);
    
    try {
      const result = await podcastService.searchPodcasts(searchQuery, 15);
      
      if (result.success) {
        setPodcasts(result.podcasts);
      } else {
        Alert.alert('Search Error', result.error || 'Failed to search podcasts');
        setPodcasts([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search podcasts');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create demo episode with topics for testing
  const createDemoEpisodeWithTopics = (podcast: Podcast): Episode => {
    return {
      id: 'demo-topics',
      title: 'Demo Episode with Topics',
      description: 'This demo episode shows how topic-based listening works.',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: '45:00',
      publishDate: new Date().toISOString(),
      topics: [
        {
          id: 'topic-1',
          title: 'Introduction & Welcome',
          description: 'Host introduces the show and today\'s guests',
          startTime: 0,
          endTime: 120,
          selected: true
        },
        {
          id: 'topic-2',
          title: 'AI and Technology Trends',
          description: 'Discussion about artificial intelligence and emerging tech',
          startTime: 120,
          endTime: 600,
          selected: false
        },
        {
          id: 'topic-3',
          title: 'Business Strategy',
          description: 'How companies are adapting to new technologies',
          startTime: 600,
          endTime: 1200,
          selected: false
        },
        {
          id: 'topic-4',
          title: 'Personal Stories',
          description: 'Guest shares personal experiences and insights',
          startTime: 1200,
          endTime: 1800,
          selected: false
        },
        {
          id: 'topic-5',
          title: 'Q&A and Wrap-up',
          description: 'Audience questions and final thoughts',
          startTime: 1800,
          endTime: 2700,
          selected: false
        }
      ]
    };
  };

  // Show topic selection for podcast
  const showTopicSelection = async (podcast: Podcast) => {
    setLoading(true);
    setDebugMessage('Checking if episode supports topics...');

    try {
      const episodeResult = await podcastService.getPodcastEpisodes(podcast.id);
      
      if (episodeResult.success && episodeResult.episodes.length > 0) {
        const episode = episodeResult.episodes[0];
        
        if (podcastService.isTopicExtractionSupported(episode)) {
          setDebugMessage('Extracting topics from real episode...');
          
          const topicResult = await podcastService.extractTopicsFromEpisode(
            episode.audioUrl, 
            episode.title
          );
          
          if (topicResult.success) {
            const episodeWithTopics: Episode = {
              ...episode,
              topics: topicResult.topics
            };
            
            setTopicEpisode(episodeWithTopics);
            setSelectedTopics(new Set(['real-topic-1']));
            setShowTopicSelector(true);
            setDebugMessage('Real topics extracted successfully!');
          } else {
            const demoEpisode = createDemoEpisodeWithTopics(podcast);
            setTopicEpisode(demoEpisode);
            setSelectedTopics(new Set(['topic-1']));
            setShowTopicSelector(true);
            setDebugMessage('Using demo topics (real extraction failed)');
          }
        } else {
          const demoEpisode = createDemoEpisodeWithTopics(podcast);
          setTopicEpisode(demoEpisode);
          setSelectedTopics(new Set(['topic-1']));
          setShowTopicSelector(true);
          setDebugMessage('Using demo topics (episode not suitable for extraction)');
        }
      } else {
        throw new Error('Could not fetch episode');
      }
    } catch (error) {
      const demoEpisode = createDemoEpisodeWithTopics(podcast);
      setTopicEpisode(demoEpisode);
      setSelectedTopics(new Set(['topic-1']));
      setShowTopicSelector(true);
      setDebugMessage(`Error: ${error.message} - using demo topics`);
    } finally {
      setLoading(false);
    }
  };

  // Play podcast episode
  const playPodcast = async (podcast: Podcast, episode?: Episode) => {
    try {
      setDebugMessage('Starting playback...');
      
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      setLoading(true);
      
      let episodeToPlay = episode;
      if (!episodeToPlay) {
        setDebugMessage('Fetching episodes from Listen Notes...');
        const episodeResult = await podcastService.getPodcastEpisodes(podcast.id);
        
        if (episodeResult.success && episodeResult.episodes.length > 0) {
          episodeToPlay = episodeResult.episodes[0];
          setDebugMessage(`Found: ${episodeToPlay.title.substring(0, 30)}...`);
        } else {
          setLoading(false);
          setDebugMessage('No episodes found in Listen Notes');
          return;
        }
      }

      setLoading(false);
      
      if (!episodeToPlay.audioUrl) {
        setDebugMessage('No audio URL available');
        return;
      }

      setCurrentPodcast({ podcast, episode: episodeToPlay });
      setIsPlaying(true);
      setDebugMessage(`Playing: ${episodeToPlay.title.substring(0, 20)}...`);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: episodeToPlay.audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setDebugMessage('Audio playing successfully!');

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentPodcast(null);
          setDebugMessage('Episode finished');
        }
      });

    } catch (error) {
      setLoading(false);
      setDebugMessage(`Playback error: ${error}`);
    }
  };

  // Audio player controls
  const togglePlayback = async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      
      if (status.isLoaded) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Toggle playback error:', error);
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.error('Stop playback error:', error);
      }
    }
    setIsPlaying(false);
    setCurrentPodcast(null);
  };

  // Subscription management
  const toggleSubscription = (podcastId: string) => {
    const newSubscriptions = new Set(subscribedPodcasts);
    if (newSubscriptions.has(podcastId)) {
      newSubscriptions.delete(podcastId);
    } else {
      newSubscriptions.add(podcastId);
    }
    setSubscribedPodcasts(newSubscriptions);
  };

  // Topic selection handlers
  const toggleTopicSelection = (topicId: string) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(topicId)) {
      newSelected.delete(topicId);
    } else {
      newSelected.add(topicId);
    }
    setSelectedTopics(newSelected);
  };

  const playSelectedTopics = () => {
    if (selectedTopics.size === 0) {
      Alert.alert('No Topics Selected', 'Please select at least one topic to play.');
      return;
    }

    setShowTopicSelector(false);
    setDebugMessage(`Playing ${selectedTopics.size} selected topics`);
    
    if (topicEpisode) {
      playPodcast({ id: 'demo', title: 'Demo Podcast', description: '', author: '', episodes: [] }, topicEpisode);
    }
  };

  const jumpToNextTopic = () => {
    if (!topicEpisode?.topics) return;
    
    const selectedTopicsList = topicEpisode.topics.filter(topic => selectedTopics.has(topic.id));
    const nextIndex = currentTopicIndex + 1;
    
    if (nextIndex < selectedTopicsList.length) {
      const nextTopic = selectedTopicsList[nextIndex];
      setCurrentTopicIndex(nextIndex);
      setDebugMessage(`Jumping to: ${nextTopic.title}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎧 Podcast App</Text>
      </View>

      <SearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={searchPodcasts}
        placeholder="Search podcasts... (try 'Joe Rogan', 'NPR', 'tech')"
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching podcasts...</Text>
        </View>
      )}

      <PodcastList
        podcasts={podcasts}
        subscribedPodcasts={subscribedPodcasts}
        onToggleSubscription={toggleSubscription}
        onSelectTopics={showTopicSelection}
      />

      <TopicSelector
        episode={topicEpisode!}
        selectedTopics={selectedTopics}
        onToggleTopicSelection={toggleTopicSelection}
        onPlaySelectedTopics={playSelectedTopics}
        onCancel={() => setShowTopicSelector(false)}
        visible={showTopicSelector}
      />

      <AudioPlayer
        currentPodcast={currentPodcast}
        isPlaying={isPlaying}
        selectedTopicsCount={selectedTopics.size}
        currentTopicIndex={currentTopicIndex}
        onTogglePlayback={togglePlayback}
        onStop={stopPlayback}
        onNextTopic={jumpToNextTopic}
        visible={!!currentPodcast}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {podcasts.length} podcast{podcasts.length !== 1 ? 's' : ''} available
        </Text>
        <Text style={styles.footerSubtext}>
          Debug: {debugMessage}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  footerSubtext: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
});