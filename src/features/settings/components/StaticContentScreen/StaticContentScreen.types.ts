import type { IconName } from '@/common/components/Icon/Icon.types';

export interface ContentSection {
  heading: string;
  body: string;
}

export interface StaticContentScreenProps {
  title: string;
  lastUpdated: string;
  heroIcon: IconName<'Ionicons'>;
  sections: ContentSection[];
}
