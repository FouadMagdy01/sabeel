/**
 * Shared type definitions for common components.
 * These types promote consistency across the component library.
 */

/**
 * Standard size scale used across components for consistent sizing.
 * @example
 * ```tsx
 * <Button size="medium" />
 * <Input size="large" />
 * ```
 */
export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Semantic color tokens that map to theme color categories.
 * @example
 * ```tsx
 * <Button color="primary" />
 * <IconButton color="error" />
 * ```
 */
export type SemanticColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

/**
 * Shared props for components that can be disabled.
 * When disabled, components should use `colors.state.disabled` styling.
 */
export interface DisableableProps {
  /**
   * Whether the component is disabled.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Shared props for components that can show a loading state.
 * When loading, components should show a loading indicator.
 */
export interface LoadableProps {
  /**
   * Whether the component is in a loading state.
   * @default false
   */
  loading?: boolean;
}
