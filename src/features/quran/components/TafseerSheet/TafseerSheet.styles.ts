import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  sheetContainer: {
    zIndex: 2000,
  },
  background: {
    backgroundColor: theme.colors.background.modal,
  },
  indicator: {
    backgroundColor: theme.colors.border.subtle,
  },
  header: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flex: 1,
  },
  ayahTextContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  ayahText: {
    fontSize: theme.metrics.fontSize.xl,
    lineHeight: 42,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  tabIndicator: {
    backgroundColor: theme.colors.brand.primary,
    height: 3,
    borderRadius: 1.5,
  },
  tabStyle: {
    width: 'auto' as const,
    minWidth: 80,
    paddingHorizontal: theme.metrics.spacing.p12,
  },
  tabLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.metrics.fontSize.sm,
    textTransform: 'none' as const,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p16,
  },
  tafseerText: {
    lineHeight: 32,
  },
  ayahSection: {
    marginTop: theme.metrics.spacingV.p16,
    paddingTop: theme.metrics.spacingV.p16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  ayahLabel: {
    marginBottom: theme.metrics.spacingV.p8,
  },
  loadingContainer: {
    paddingVertical: theme.metrics.spacingV.p20,
    alignItems: 'center',
  },
  errorContainer: {
    paddingVertical: theme.metrics.spacingV.p20,
    alignItems: 'center',
    gap: theme.metrics.spacingV.p12,
  },
  shareButton: {
    marginTop: theme.metrics.spacingV.p16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.metrics.spacing.p8,
    paddingVertical: theme.metrics.spacingV.p12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
  },
}));
