import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { StaticContentScreen } from '../StaticContentScreen';
import type { ContentSection } from '../StaticContentScreen';

export function PrivacyPolicyScreen() {
  const { t } = useTranslation();

  const sections = useMemo<ContentSection[]>(
    () => [
      {
        heading: t('screens.privacyPolicy.sections.dataCollection.heading'),
        body: t('screens.privacyPolicy.sections.dataCollection.body'),
      },
      {
        heading: t('screens.privacyPolicy.sections.dataUsage.heading'),
        body: t('screens.privacyPolicy.sections.dataUsage.body'),
      },
      {
        heading: t('screens.privacyPolicy.sections.dataStorage.heading'),
        body: t('screens.privacyPolicy.sections.dataStorage.body'),
      },
      {
        heading: t('screens.privacyPolicy.sections.thirdParty.heading'),
        body: t('screens.privacyPolicy.sections.thirdParty.body'),
      },
      {
        heading: t('screens.privacyPolicy.sections.contact.heading'),
        body: t('screens.privacyPolicy.sections.contact.body'),
      },
    ],
    [t]
  );

  return (
    <StaticContentScreen
      title={t('screens.privacyPolicy.title')}
      lastUpdated={t('screens.privacyPolicy.lastUpdated')}
      heroIcon="shield-checkmark-outline"
      sections={sections}
    />
  );
}
