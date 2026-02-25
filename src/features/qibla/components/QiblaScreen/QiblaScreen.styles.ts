import { rf } from '@/theme/metrics';
import { StyleSheet } from 'react-native-unistyles';

export const qiblaStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    gap: theme.metrics.spacing.p8,
  },
  headerTitle: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.metrics.spacing.p24,
  },
  kaabaContainer: {
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p16,
  },
  kaabaImage: {
    width: rf(48),
    height: rf(48),
  },
  compassContainer: {
    width: rf(280),
    height: rf(280),
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDial: {
    width: rf(280),
    height: rf(280),
    borderRadius: rf(140),
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinalN: {
    position: 'absolute',
    top: rf(12),
  },
  cardinalS: {
    position: 'absolute',
    bottom: rf(12),
  },
  cardinalE: {
    position: 'absolute',
    right: rf(12),
  },
  cardinalW: {
    position: 'absolute',
    left: rf(12),
  },
  qiblaNeedleOverlay: {
    position: 'absolute',
    width: rf(280),
    height: rf(280),
    alignItems: 'center',
    justifyContent: 'center',
  },
  qiblaIndicator: {
    position: 'absolute',
    top: rf(4),
    alignItems: 'center',
  },
  headingText: {
    marginTop: theme.metrics.spacingV.p24,
  },
  statusText: {
    marginTop: theme.metrics.spacingV.p12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.metrics.spacingV.p16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.metrics.spacing.p32,
    gap: theme.metrics.spacingV.p16,
  },
  settingsButton: {
    marginTop: theme.metrics.spacingV.p8,
    paddingHorizontal: theme.metrics.spacing.p24,
    paddingVertical: theme.metrics.spacingV.p12,
    borderRadius: 8,
  },
  retryButton: {
    paddingHorizontal: theme.metrics.spacing.p24,
    paddingVertical: theme.metrics.spacingV.p12,
    borderRadius: 8,
    borderWidth: 1,
  },
}));
