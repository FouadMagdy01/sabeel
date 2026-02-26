import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { StaticContentScreen } from '../StaticContentScreen';
import type { ContentSection } from '../StaticContentScreen';

export function TermsOfServiceScreen() {
  const { t } = useTranslation();

  const sections = useMemo<ContentSection[]>(
    () => [
      {
        heading: t('screens.termsOfService.sections.acceptance.heading'),
        body: t('screens.termsOfService.sections.acceptance.body'),
      },
      {
        heading: t('screens.termsOfService.sections.useOfApp.heading'),
        body: t('screens.termsOfService.sections.useOfApp.body'),
      },
      {
        heading: t('screens.termsOfService.sections.accuracy.heading'),
        body: t('screens.termsOfService.sections.accuracy.body'),
      },
      {
        heading: t('screens.termsOfService.sections.intellectualProperty.heading'),
        body: t('screens.termsOfService.sections.intellectualProperty.body'),
      },
      {
        heading: t('screens.termsOfService.sections.liability.heading'),
        body: t('screens.termsOfService.sections.liability.body'),
      },
    ],
    [t]
  );

  return (
    <StaticContentScreen
      title={t('screens.termsOfService.title')}
      lastUpdated={t('screens.termsOfService.lastUpdated')}
      heroIcon="document-text-outline"
      sections={sections}
    />
  );
}
