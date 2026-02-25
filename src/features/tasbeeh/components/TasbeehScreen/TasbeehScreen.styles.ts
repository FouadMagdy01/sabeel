import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  scrollContent: {
    paddingHorizontal: theme.metrics.spacing.p24,
    gap: theme.metrics.spacingV.p16,
  },
  stickyHeader: {
    backgroundColor: theme.colors.background.app,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
  },
  headerTitle: {
    flex: 1,
  },
  phraseCard: {
    alignItems: 'center',
    gap: theme.metrics.spacingV.p8,
    paddingVertical: theme.metrics.spacingV.p16,
    paddingHorizontal: theme.metrics.spacing.p16,
    borderRadius: 16,
  },
  phraseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  targetsContainer: {
    gap: theme.metrics.spacingV.p8,
  },
  targetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.metrics.spacing.p8,
  },
  targetChip: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    borderRadius: 20,
    borderWidth: 1,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.metrics.spacingV.p8,
  },
  settingsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  banner: {
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
    borderRadius: 12,
  },
  resetButton: {
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
}));
