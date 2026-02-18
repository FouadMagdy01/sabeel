import { Toolbar } from '@/common/components/Toolbar';
import type { ToolbarAction } from '@/common/components/Toolbar';
import { Image, type ImageSource } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { scheduleOnRN } from 'react-native-worklets';
import { useAyahBounds } from '../../hooks/useAyahBounds';
import type { AyahBound } from '../../services/quranDatabase';

type SelectedAyah = { sura: number; ayah: number };

type QuranPageProps = {
  page: number;
  imageUri?: string;
  onAyahSelect?: (ayahs: SelectedAyah[]) => void;
  /** Which page currently owns the selection — this page clears if it doesn't match */
  activeSelectionPage?: number | null;
  /** Called when this page starts a new selection */
  onSelectionStart?: (page: number) => void;
  onTafseer?: (ayahs: SelectedAyah[]) => void;
  onShare?: (ayahs: SelectedAyah[]) => void;
  onPlay?: (ayahs: SelectedAyah[]) => void;
  onPlaybackSettings?: (ayahs: SelectedAyah[]) => void;
  onBookmark?: (ayahs: SelectedAyah[]) => void;
  showToolbarLabels?: boolean;
};

const IMG_WIDTH = 1024;
const PHI = 1.618;
const LONG_PRESS_DURATION = 500;

const BUNDLED_PAGE_1 = require('../../../../../assets/quran/pages/1.png') as ImageSource;

/** Find which bound index contains the given (x, y) point */
function hitTest(bounds: AyahBound[], x: number, y: number, ratio: number): number {
  for (let i = 0; i < bounds.length; i++) {
    const b = bounds[i];
    if (
      x >= b.min_x * ratio &&
      x <= b.max_x * ratio &&
      y >= b.min_y * ratio &&
      y <= b.max_y * ratio
    ) {
      return i;
    }
  }
  return -1;
}

/** Given anchor and current bound indices, collect unique sura:ayah pairs */
function collectRange(bounds: AyahBound[], anchorIdx: number, currentIdx: number): Set<string> {
  const lo = Math.min(anchorIdx, currentIdx);
  const hi = Math.max(anchorIdx, currentIdx);
  const keys = new Set<string>();
  for (let i = lo; i <= hi; i++) {
    keys.add(`${bounds[i].sura}:${bounds[i].ayah}`);
  }
  return keys;
}

type LineRect = { left: number; right: number; top: number; bottom: number };

/**
 * Build a single SVG path string that fills the selected region seamlessly.
 * Groups selected bounds by line, merges each line into one rect,
 * then traces a polygon: down the right edges, back up the left edges.
 */
function buildSelectionPath(bounds: AyahBound[], selectedKeys: Set<string>, ratio: number): string {
  if (selectedKeys.size === 0) return '';

  // Collect selected bounds grouped by line
  const lineMap = new Map<number, LineRect>();
  for (const b of bounds) {
    if (!selectedKeys.has(`${b.sura}:${b.ayah}`)) continue;
    const existing = lineMap.get(b.line);
    if (existing) {
      existing.left = Math.min(existing.left, b.min_x * ratio);
      existing.right = Math.max(existing.right, b.max_x * ratio);
      existing.top = Math.min(existing.top, b.min_y * ratio);
      existing.bottom = Math.max(existing.bottom, b.max_y * ratio);
    } else {
      lineMap.set(b.line, {
        left: b.min_x * ratio,
        right: b.max_x * ratio,
        top: b.min_y * ratio,
        bottom: b.max_y * ratio,
      });
    }
  }

  // Sort lines top-to-bottom
  const lines = Array.from(lineMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, rect]) => rect);

  if (lines.length === 0) return '';

  // For adjacent lines, set the boundary to the midpoint so there's no gap
  for (let i = 0; i < lines.length - 1; i++) {
    const mid = (lines[i].bottom + lines[i + 1].top) / 2;
    lines[i].bottom = mid;
    lines[i + 1].top = mid;
  }

  // Build polygon path: down the right edges, then back up the left edges
  // Right side (top-to-bottom)
  const rightPoints: string[] = [];
  for (const line of lines) {
    rightPoints.push(`${line.right},${line.top}`);
    rightPoints.push(`${line.right},${line.bottom}`);
  }
  // Left side (bottom-to-top)
  const leftPoints: string[] = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    leftPoints.push(`${line.left},${line.bottom}`);
    leftPoints.push(`${line.left},${line.top}`);
  }

  return `M${rightPoints[0]} L${rightPoints.slice(1).join(' L')} L${leftPoints.join(' L')} Z`;
}

/** Get the top Y coordinate of the first selected line (for toolbar positioning) */
function getSelectionTopY(bounds: AyahBound[], selectedKeys: Set<string>, ratio: number): number {
  let minY = Infinity;
  for (const b of bounds) {
    if (selectedKeys.has(`${b.sura}:${b.ayah}`)) {
      minY = Math.min(minY, b.min_y * ratio);
    }
  }
  return minY;
}

export function QuranPage({
  page,
  imageUri,
  onAyahSelect,
  activeSelectionPage,
  onSelectionStart,
  onTafseer,
  onShare,
  onPlay,
  onPlaybackSettings,
  onBookmark,
  showToolbarLabels = false,
}: QuranPageProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { bounds } = useAyahBounds(page);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const ratio = screenWidth / IMG_WIDTH;
  const pageHeight = screenWidth * PHI;

  const anchorIdxRef = useRef(-1);

  // Clear selection when another page becomes the active selection owner
  useEffect(() => {
    if (activeSelectionPage != null && activeSelectionPage !== page) {
      setSelectedKeys(new Set());
    }
  }, [activeSelectionPage, page]);

  const updateSelection = useCallback((keys: Set<string>) => {
    setSelectedKeys(keys);
  }, []);

  const finalizeSelection = useCallback(
    (keys: Set<string>) => {
      setSelectedKeys(keys);
      if (onAyahSelect && keys.size > 0) {
        const ayahs = Array.from(keys).map((k) => {
          const [sura, ayah] = k.split(':').map(Number);
          return { sura, ayah };
        });
        onAyahSelect(ayahs);
      }
    },
    [onAyahSelect]
  );

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  const handleLongPressStart = useCallback(
    (x: number, y: number) => {
      const idx = hitTest(bounds, x, y, ratio);
      if (idx === -1) return;
      anchorIdxRef.current = idx;
      onSelectionStart?.(page);
      const keys = new Set<string>();
      keys.add(`${bounds[idx].sura}:${bounds[idx].ayah}`);
      updateSelection(keys);
    },
    [bounds, ratio, updateSelection, onSelectionStart, page]
  );

  const handleDrag = useCallback(
    (x: number, y: number) => {
      if (anchorIdxRef.current === -1) return;
      const idx = hitTest(bounds, x, y, ratio);
      if (idx === -1) return;
      const keys = collectRange(bounds, anchorIdxRef.current, idx);
      updateSelection(keys);
    },
    [bounds, ratio, updateSelection]
  );

  const handleDragEnd = useCallback(
    (x: number, y: number) => {
      if (anchorIdxRef.current === -1) return;
      const idx = hitTest(bounds, x, y, ratio);
      const keys =
        idx === -1
          ? collectRange(bounds, anchorIdxRef.current, anchorIdxRef.current)
          : collectRange(bounds, anchorIdxRef.current, idx);
      anchorIdxRef.current = -1;
      finalizeSelection(keys);
    },
    [bounds, ratio, finalizeSelection]
  );

  const gesture = useMemo(() => {
    const dragSelect = Gesture.Pan()
      .activateAfterLongPress(LONG_PRESS_DURATION)
      .onStart((e) => {
        scheduleOnRN(handleLongPressStart, e.x, e.y);
      })
      .onUpdate((e) => {
        scheduleOnRN(handleDrag, e.x, e.y);
      })
      .onEnd((e) => {
        scheduleOnRN(handleDragEnd, e.x, e.y);
      });

    const tap = Gesture.Tap().onStart(() => {
      scheduleOnRN(clearSelection);
    });

    return Gesture.Exclusive(dragSelect, tap);
  }, [handleLongPressStart, handleDrag, handleDragEnd, clearSelection]);

  const selectionPath = buildSelectionPath(bounds, selectedKeys, ratio);
  const hasSelection = selectedKeys.size > 0;
  const imageSource = imageUri ? { uri: imageUri } : BUNDLED_PAGE_1;
  const imageColors = {
    backgroundColor: theme.colors.background.app,
    tintColor: theme.colors.text.primary,
  };

  const selectedAyahs = useMemo(() => {
    if (!hasSelection) return [];
    return Array.from(selectedKeys).map((k) => {
      const [sura, ayah] = k.split(':').map(Number);
      return { sura, ayah };
    });
  }, [selectedKeys, hasSelection]);

  const toolbarActions = useMemo(
    (): ToolbarAction[] => [
      {
        key: 'tafseer',
        icon: { familyName: 'MaterialCommunityIcons', iconName: 'book-open-variant' },
        label: t('screens.quran.toolbar.tafseer'),
        onPress: () => onTafseer?.(selectedAyahs),
      },
      {
        key: 'share',
        icon: { familyName: 'Ionicons', iconName: 'share-social' },
        label: t('screens.quran.toolbar.share'),
        onPress: () => onShare?.(selectedAyahs),
      },
      {
        key: 'play',
        icon: { familyName: 'Ionicons', iconName: 'play' },
        label: t('screens.quran.toolbar.play'),
        onPress: () => onPlay?.(selectedAyahs),
      },
      {
        key: 'settings',
        icon: { familyName: 'Feather', iconName: 'sliders' },
        label: t('screens.quran.toolbar.settings'),
        onPress: () => onPlaybackSettings?.(selectedAyahs),
      },
      {
        key: 'bookmark',
        icon: { familyName: 'Feather', iconName: 'bookmark' },
        label: t('screens.quran.toolbar.bookmark'),
        onPress: () => onBookmark?.(selectedAyahs),
      },
    ],
    [selectedAyahs, onTafseer, onShare, onPlay, onPlaybackSettings, onBookmark, t]
  );

  const toolbarTopY = hasSelection ? getSelectionTopY(bounds, selectedKeys, ratio) : 0;
  const TOOLBAR_HEIGHT = 44;
  const TOOLBAR_MARGIN = 8;

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Image
          source={imageSource}
          style={[styles.image, imageColors, { width: screenWidth, height: pageHeight }]}
          contentFit="contain"
          pointerEvents="none"
        />

        {selectionPath !== '' && (
          <Svg
            style={styles.svgOverlay}
            width={screenWidth}
            height={pageHeight}
            pointerEvents="none"
          >
            <Path d={selectionPath} fill={theme.colors.overlay.pressed} />
          </Svg>
        )}

        {hasSelection && (
          <View
            style={[
              styles.toolbarContainer,
              { top: Math.max(0, toolbarTopY - TOOLBAR_HEIGHT - TOOLBAR_MARGIN) },
            ]}
          >
            <Toolbar actions={toolbarActions} showLabels={showToolbarLabels} />
          </View>
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create(() => ({
  container: {
    position: 'relative',
  },
  image: {},
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  toolbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
}));
