import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();
  const [_playerReady, _setPlayerReady] = useState(false);
  const [_error, _setError] = useState<string | null>(null);

  const handlePlayPress = () => {
    void TrackPlayer.add({
      url: 'https://server6.mp3quran.net/akdr/001.mp3',
      title: 'Test Track',
    }).then(() => TrackPlayer.play());
  };

  const handlePausePress = () => {
    void TrackPlayer.pause();
  };

  return (
    <View style={styles.container}>
      {_error ? (
        <Text style={styles.errorText}>{_error}</Text>
      ) : (
        <>
          <Button title={t('screens.quran.test')} onPress={handlePlayPress} />
          <Button title={t('screens.quran.pause')} onPress={handlePausePress} />
          <Text>
            {_playerReady ? t('screens.quran.playerReady') : t('screens.quran.settingUp')}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.app,
  },
  errorText: {
    color: theme.colors.state.error,
    textAlign: 'center',
  },
}));
