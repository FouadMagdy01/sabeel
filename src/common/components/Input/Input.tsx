import React, { useCallback, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { styles } from './Input.styles';
import type { InputProps } from './Input.types';

type FocusHandler = NonNullable<InputProps['onFocus']>;
type BlurHandler = NonNullable<InputProps['onBlur']>;

/**
 * Input component with multiple variants and customizable elements
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter text" />
 *
 * <Input label="Email" placeholder="Enter email" helperText="We won't share it" />
 *
 * <Input label="Password" error errorText="Password is too short" />
 *
 * <Input
 *   leftElement={<Icon familyName="Feather" iconName="search" size={18} />}
 *   rightElement={<Icon familyName="Feather" iconName="x" size={18} />}
 *   placeholder="Search..."
 * />
 *
 * <Input
 *   label="Email"
 *   required
 *   clearable
 *   value={email}
 *   onChangeText={setEmail}
 * />
 *
 * <Input
 *   label="Bio"
 *   maxLength={100}
 *   showCount
 *   multiline
 * />
 * ```
 */
export function Input({
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  error = false,
  success = false,
  label,
  helperText,
  errorText,
  leftElement,
  rightElement,
  containerStyle,
  inputContainerStyle,
  style,
  labelStyle,
  helperTextStyle,
  onFocus,
  onBlur,
  clearable = false,
  required = false,
  showCount = false,
  maxLength,
  value,
  onChangeText,
  ...textInputProps
}: InputProps) {
  const { theme } = useUnistyles();
  const [isFocused, setIsFocused] = useState(false);

  styles.useVariants({
    variant,
    size,
    focused: isFocused as true | false,
    disabled: disabled as true | false,
    error: error as true | false,
    success: success as true | false,
  });

  const handleFocus = useCallback<FocusHandler>(
    (e) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback<BlurHandler>(
    (e) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleClear = useCallback(() => {
    onChangeText?.('');
  }, [onChangeText]);

  // Inline color styles to avoid flicker during theme switching
  const inputContainerColors = (() => {
    if (error) return { borderColor: theme.colors.state.error };
    if (success) return { borderColor: theme.colors.state.success };
    if (isFocused)
      return variant === 'underlined'
        ? { borderBottomColor: theme.colors.border.focus }
        : { borderColor: theme.colors.border.focus };
    return variant === 'outlined'
      ? { borderColor: theme.colors.border.default }
      : variant === 'filled'
        ? { backgroundColor: theme.colors.background.input }
        : { borderBottomColor: theme.colors.border.default };
  })();
  const inputTextColor = { color: theme.colors.text.primary };
  const helperTextColor = {
    color: error
      ? theme.colors.state.error
      : success
        ? theme.colors.state.success
        : theme.colors.text.muted,
  };
  const requiredColor = { color: theme.colors.state.error };
  const charCountColor = { color: theme.colors.text.muted };
  const labelColor = {
    color: error
      ? theme.colors.state.error
      : disabled
        ? theme.colors.text.muted
        : theme.colors.text.secondary,
  };

  const displayHelperText = error && errorText ? errorText : helperText;
  const showClearButton = clearable && value && value.length > 0;
  const currentLength = value?.length ?? 0;
  const charCountText = maxLength ? `${currentLength}/${maxLength}` : `${currentLength}`;

  // Determine right element (clear button takes precedence over custom rightElement when clearable is true)
  const effectiveRightElement = showClearButton ? (
    <View style={styles.clearButton}>
      <IconButton
        familyName="Feather"
        iconName="x"
        size="small"
        variant="ghost"
        onPress={handleClear}
      />
    </View>
  ) : (
    rightElement
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography
          type="label"
          size="xs"
          weight="semiBold"
          color="secondary"
          style={[labelColor, labelStyle]}
        >
          {label}
          {required && <Text style={[styles.requiredIndicator, requiredColor]}> *</Text>}
        </Typography>
      )}

      <View style={[styles.inputContainer, inputContainerColors, inputContainerStyle]}>
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}

        <TextInput
          style={[styles.input, inputTextColor, style]}
          editable={!disabled}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          {...textInputProps}
        />

        {effectiveRightElement && <View style={styles.rightElement}>{effectiveRightElement}</View>}
      </View>

      {(Boolean(displayHelperText) || showCount) && (
        <View style={styles.helperTextRow}>
          {displayHelperText && (
            <Text style={[styles.helperText, helperTextColor, helperTextStyle]}>
              {displayHelperText}
            </Text>
          )}
          {showCount && <Text style={[styles.charCount, charCountColor]}>{charCountText}</Text>}
        </View>
      )}
    </View>
  );
}
