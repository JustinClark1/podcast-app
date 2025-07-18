// components/PodcastList.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { Podcast } from '../types/podcast.types';

interface PodcastListProps {
  podcasts: Podcast[];
  subscribedPodcasts: Set<string>;
  onToggleSubscription: (podcastId: string) => void;
  onSelectTopics: (podcast: Podcast) => void;
}

export const PodcastList: React.FC<PodcastListProps> = ({
  podcasts,
  subscribedPodcasts,
  onToggleSubscription,
  onSelectTopics
}) => {
  const renderPodcast = ({ item }: { item: Podcast }) => (
    <View style={styles.podcastItem}>
      <View style={styles.podcastImage}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.podcastImageActual}
            defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' }}
          />
        ) : (
          <Text style={styles.podcastImageText}>
            {item.title.substring(0, 3).toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.podcastInfo}>
        <Text style={styles.podcastTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.podcastAuthor}>by {item.author}</Text>
        <Text style={styles.podcastDescription} numberOfLines={3}>
          {item.description}
        </Text>
        {item.category && (
          <Text style={styles.podcastCategory}>{item.category}</Text>
        )}
        <View style={styles.podcastActions}>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              subscribedPodcasts.has(item.id) && styles.subscribedButton
            ]}
            onPress={() => onToggleSubscription(item.id)}
          >
            <Text style={styles.subscribeButtonText}>
              {subscribedPodcasts.has(item.id) ? 'Subscribed' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => onSelectTopics(item)}
          >
            <Text style={styles.playButtonText}>
              Select Topics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={podcasts}
      renderItem={renderPodcast}
      keyExtractor={(item) => item.id.toString()}
      style={styles.podcastList}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  podcastList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  podcastItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  podcastImage: {
    width: 80,
    height: 80,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  podcastImageActual: {
    width: '100%',
    height: '100%',
  },
  podcastImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  podcastInfo: {
    flex: 1,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  podcastAuthor: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 6,
  },
  podcastDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  podcastCategory: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  podcastActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscribeButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  subscribedButton: {
    backgroundColor: '#666',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  playButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});