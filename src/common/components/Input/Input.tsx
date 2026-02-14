import React, { useCallback, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { IconButton } from '@/common/components/IconButton';
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
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.requiredIndicator}> *</Text>}
        </Text>
      )}

      <View style={[styles.inputContainer, inputContainerStyle]}>
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}

        <TextInput
          style={[styles.input, style]}
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
            <Text style={[styles.helperText, helperTextStyle]}>{displayHelperText}</Text>
          )}
          {showCount && <Text style={styles.charCount}>{charCountText}</Text>}
        </View>
      )}
    </View>
  );
}
