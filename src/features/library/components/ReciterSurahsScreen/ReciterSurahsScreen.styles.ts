import { StyleSheet } from 'react-native-unistyles';

const AVATAR_FULL = 96;
const AVATAR_COLLAPSED = 36;
const PROFILE_HEIGHT = 220;

export { AVATAR_FULL, AVATAR_COLLAPSED, PROFILE_HEIGHT };

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },

  // Collapsed sticky header (appears on scroll)
  collapsedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: theme.colors.background.app,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  collapsedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p8,
    paddingBottom: theme.metrics.spacingV.p4,
    gap: theme.metrics.spacing.p12,
  },
  collapsedAvatar: {
    width: AVATAR_COLLAPSED,
    height: AVATAR_COLLAPSED,
    borderRadius: AVATAR_COLLAPSED / 2,
    borderWidth: 2,
    borderColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.brand.primary}15`,
  },
  collapsedInfo: {
    flex: 1,
  },
  collapsedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p4,
  },
  collapsedSearchContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p4,
  },
  collapsedSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p8,
  },

  // Top bar (expanded state)
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -theme.metrics.spacing.p16,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
  },

  // Profile section (expanded)
  profileSection: {
    alignItems: 'center',
    paddingBottom: theme.metrics.spacingV.p16,
  },
  avatarContainer: {
    width: AVATAR_FULL,
    height: AVATAR_FULL,
    borderRadius: AVATAR_FULL / 2,
    borderWidth: 3,
    borderColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.brand.primary}15`,
    marginBottom: theme.metrics.spacingV.p12,
  },
  reciterName: {
    marginBottom: 4,
  },
  moshafInfo: {
    marginBottom: theme.metrics.spacingV.p16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.metrics.spacing.p12,
    width: '100%',
  },
  playAllButton: {
    flex: 1,
  },

  // Search & section header (in expanded list header)
  searchContainer: {
    paddingBottom: theme.metrics.spacingV.p8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.metrics.spacingV.p8,
  },
  listContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p32,
    gap: theme.metrics.spacingV.p12,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.metrics.spacingV.p12,
  },
}));
