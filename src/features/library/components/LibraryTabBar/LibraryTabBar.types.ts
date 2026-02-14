export interface LibraryTabBarProps {
  routes: { key: string; title: string }[];
  activeIndex: number;
  onTabPress: (index: number) => void;
}
