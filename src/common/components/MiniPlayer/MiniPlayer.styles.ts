import { spacing } from '@/theme/metrics';
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.p8,
    right: spacing.p8,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 8,
    alignItems: 'center',
    paddingTop: spacing.p8,
    paddingBottom: spacing.p4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: 'hidden',
  },
  info: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.p12,
  },
  slider: {
    width: '90%',
    height: 20,
    marginVertical: spacing.p4,
  },
  controls: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: spacing.p4,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.p8,
    right: spacing.p8,
    padding: spacing.p4,
    zIndex: 1,
  },
});
