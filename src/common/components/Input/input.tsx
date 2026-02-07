import React, { useCallback, useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { styles } from './input.styles';
import type { InputProps } from './input.types';

type FocusHandler = NonNullable<InputProps['onFocus']>;
type BlurHandler = NonNullable<InputProps['onBlur']>;

/**
 * Input component with multiple variants and customizable elements
 *
 * @example
 * ```tsx
 * // Basic outlined input (default)
 * <Input placeholder="Enter text" />
 *
 * // With label and helper text
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   helperText="We'll never share your email"
 * />
 *
 * // With error state
 * <Input
 *   label="Password"
 *   error
 *   errorText="Password is too short"
 * />
 *
 * // With left/right elements (icons)
 * <Input
 *   leftElement={<Icon name="search" />}
 *   rightElement={<Icon name="x" />}
 *   placeholder="Search..."
 * />
 *
 * // Filled variant
 * <Input variant="filled" placeholder="Filled input" />
 *
 * // Underlined variant
 * <Input variant="underlined" placeholder="Underlined input" />
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
  ...textInputProps
}: InputProps) {
  const { theme } = useUnistyles();
  const [isFocused, setIsFocused] = useState(false);

  // Configure variants for unistyles
  styles.useVariants({
    variant,
    size,
    focused: isFocused as true | false,
    disabled: disabled as true | false,
    error: error as true | false,
    success: success as true | false,
  });

  // Handle focus
  const handleFocus = useCallback<FocusHandler>(
    (e) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  // Handle blur
  const handleBlur = useCallback<BlurHandler>(
    (e) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  // Determine helper text to display
  const displayHelperText = error && errorText ? errorText : helperText;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}

      <View style={[styles.inputContainer, inputContainerStyle]}>
        {leftElement && (
          <View style={styles.leftElement}>{leftElement}</View>
        )}

        <TextInput
          style={[styles.input, style]}
          editable={!disabled}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />

        {rightElement && (
          <View style={styles.rightElement}>{rightElement}</View>
        )}
      </View>

      {displayHelperText && (
        <Text style={[styles.helperText, helperTextStyle]}>
          {displayHelperText}
        </Text>
      )}
    </View>
  );
}
