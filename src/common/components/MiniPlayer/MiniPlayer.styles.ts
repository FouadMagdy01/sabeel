import { MINI_PLAYER_HEIGHT } from './MiniPlayer.types';
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    left: theme.metrics.spacing.p8,
    right: theme.metrics.spacing.p8,
    height: MINI_PLAYER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p12,
    gap: theme.metrics.spacing.p12,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 1000,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
  },
  progressFill: {
    height: 3,
    borderRadius: 1.5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p4,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  closeButton: {
    padding: theme.metrics.spacing.p4,
  },
}));
