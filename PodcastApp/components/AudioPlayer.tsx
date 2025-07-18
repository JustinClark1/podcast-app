// components/AudioPlayer.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Podcast, Episode } from '../types/podcast.types';

interface CurrentPodcast {
  podcast: Podcast;
  episode: Episode;
}

interface AudioPlayerProps {
  currentPodcast: CurrentPodcast | null;
  isPlaying: boolean;
  selectedTopicsCount: number;
  currentTopicIndex: number;
  onTogglePlayback: () => void;
  onStop: () => void;
  onNextTopic?: () => void;
  visible: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentPodcast,
  isPlaying,
  selectedTopicsCount,
  currentTopicIndex,
  onTogglePlayback,
  onStop,
  onNextTopic,
  visible
}) => {
  if (!visible || !currentPodcast) {
    return null;
  }

  const showNextTopicButton = selectedTopicsCount > 1 && onNextTopic;

  return (
    <View style={styles.playerContainer}>
      <View style={styles.playerInfo}>
        <Text style={styles.nowPlayingTitle} numberOfLines={1}>
          {currentPodcast.episode.title}
        </Text>
        <Text style={styles.nowPlayingPodcast} numberOfLines={1}>
          {currentPodcast.podcast.title}
        </Text>
        {selectedTopicsCount > 0 && (
          <Text style={styles.currentTopicText}>
            Topic {currentTopicIndex + 1} of {selectedTopicsCount}
          </Text>
        )}
      </View>
      <View style={styles.playerControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onTogglePlayback}
        >
          <Text style={styles.controlButtonText}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
        {showNextTopicButton && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onNextTopic}
          >
            <Text style={styles.controlButtonText}>Next Topic</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.stopButton}
          onPress={onStop}
        >
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    backgroundColor: '#007AFF',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerInfo: {
    flex: 1,
    marginRight: 10,
  },
  nowPlayingTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nowPlayingPodcast: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  currentTopicText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  playerControls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controlButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stopButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});