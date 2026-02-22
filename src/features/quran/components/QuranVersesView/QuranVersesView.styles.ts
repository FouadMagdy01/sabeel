import { rf } from '@/theme/metrics';
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  page: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  pageScrollContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    gap: theme.metrics.spacingV.p16,
  },

  // Bismillah
  bismillah: {
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p24,
    gap: theme.metrics.spacingV.p8,
  },
  bismillahText: {
    writingDirection: 'rtl',
    lineHeight: rf(65),
  },

  // Verse card — glass-style surface
  verseCard: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderWidth: 1,
    borderRadius: 24,
    padding: theme.metrics.spacing.p32,
  },
  verseCardHighlighted: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.brand.primary,
    backgroundColor: theme.colors.overlay.focus,
  },
  verseTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  verseText: {
    writingDirection: 'rtl',
    textAlign: 'center',
    lineHeight: rf(75),
  },
  verseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.brand.tertiary,
    backgroundColor: 'transparent',
    marginTop: theme.metrics.spacingV.p12,
  },
  verseNumberText: {
    color: theme.colors.brand.tertiary,
  },
  divider: {
    height: 1,
    marginTop: theme.metrics.spacingV.p16,
    backgroundColor: theme.colors.border.subtle,
  },
  verseActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: theme.metrics.spacing.p20,
    paddingTop: theme.metrics.spacingV.p16,
  },
  actionButton: {
    alignItems: 'center',
    gap: theme.metrics.spacingV.p4,
  },
  actionButtonLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
}));
