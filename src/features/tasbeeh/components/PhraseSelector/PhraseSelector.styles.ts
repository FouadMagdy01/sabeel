import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
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
  listContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p8,
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p12,
    gap: theme.metrics.spacing.p12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    borderRadius: 8,
  },
  phraseInfo: {
    flex: 1,
    gap: theme.metrics.spacingV.p4,
  },
  phraseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  phraseItemSelected: {
    borderColor: theme.colors.brand.primary,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.brand.primary,
  },
}));
