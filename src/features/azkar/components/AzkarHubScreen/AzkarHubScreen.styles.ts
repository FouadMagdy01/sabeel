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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
  },
  searchContainer: {
    paddingHorizontal: theme.metrics.spacing.p24,
    paddingBottom: theme.metrics.spacingV.p8,
  },
  headerTitle: {
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  sectionHeader: {
    paddingTop: theme.metrics.spacingV.p8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.metrics.spacing.p12,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p4,
  },
  searchResultText: {
    flex: 1,
    gap: theme.metrics.spacingV.p4,
  },
  categoryBadge: {
    paddingHorizontal: theme.metrics.spacing.p8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
}));
