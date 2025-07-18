// components/TopicSelector.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Episode, Topic } from '../types/podcast.types';

interface TopicSelectorProps {
  episode: Episode;
  selectedTopics: Set<string>;
  onToggleTopicSelection: (topicId: string) => void;
  onPlaySelectedTopics: () => void;
  onCancel: () => void;
  visible: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  episode,
  selectedTopics,
  onToggleTopicSelection,
  onPlaySelectedTopics,
  onCancel,
  visible
}) => {
  if (!visible || !episode?.topics) {
    return null;
  }

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      style={[
        styles.topicItem,
        selectedTopics.has(item.id) && styles.topicItemSelected
      ]}
      onPress={() => onToggleTopicSelection(item.id)}
    >
      <View style={styles.topicHeader}>
        <Text style={[
          styles.topicTitle,
          selectedTopics.has(item.id) && styles.topicTitleSelected
        ]}>
          {item.title}
        </Text>
        <Text style={styles.topicTime}>
          {Math.floor(item.startTime / 60)}:{(item.startTime % 60).toString().padStart(2, '0')} - {Math.floor(item.endTime / 60)}:{(item.endTime % 60).toString().padStart(2, '0')}
        </Text>
      </View>
      <Text style={[
        styles.topicDescription,
        selectedTopics.has(item.id) && styles.topicDescriptionSelected
      ]}>
        {item.description}
      </Text>
      {selectedTopics.has(item.id) && (
        <Text style={styles.selectedIndicator}>✓ Selected</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.topicSelectorOverlay}>
      <View style={styles.topicSelectorContainer}>
        <Text style={styles.topicSelectorTitle}>Select Topics to Listen To:</Text>
        <Text style={styles.topicSelectorSubtitle}>{episode.title}</Text>
        
        <FlatList
          data={episode.topics}
          keyExtractor={(item) => item.id}
          style={styles.topicsList}
          renderItem={renderTopic}
        />
        
        <View style={styles.topicSelectorActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.playTopicsButton,
              selectedTopics.size === 0 && styles.playTopicsButtonDisabled
            ]}
            onPress={onPlaySelectedTopics}
          >
            <Text style={styles.playTopicsButtonText}>
              Play {selectedTopics.size} Topic{selectedTopics.size !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topicSelectorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  topicSelectorContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  topicSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  topicSelectorSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  topicsList: {
    maxHeight: 300,
  },
  topicItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  topicItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  topicTitleSelected: {
    color: '#007AFF',
  },
  topicTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  topicDescriptionSelected: {
    color: '#333',
  },
  selectedIndicator: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  topicSelectorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  playTopicsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  playTopicsButtonDisabled: {
    backgroundColor: '#ccc',
  },
  playTopicsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});