import React from 'react';
import { Pressable, View } from 'react-native';
import { Typography } from '@/common/components/Typography';
import { styles } from './LanguageSelector.styles';
import type { LanguageSelectorProps } from './LanguageSelector.types';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
] as const;

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <View style={styles.container}>
      {LANGUAGES.map((lang) => {
        const isActive = currentLanguage === lang.code;
        return (
          <Pressable
            key={lang.code}
            onPress={() => onLanguageChange(lang.code)}
            style={[styles.button, isActive && styles.buttonActive]}
          >
            <Typography
              type="label"
              size="xs"
              weight="semiBold"
              color={isActive ? 'inverse' : 'secondary'}
            >
              {lang.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
