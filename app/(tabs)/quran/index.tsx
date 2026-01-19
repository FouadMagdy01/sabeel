import { useState } from "react";
import { Button, Text, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { StyleSheet } from "react-native-unistyles";

export default function Index() {
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : (
        <>
          <Button
            title="test"
            onPress={async () => {
              await TrackPlayer.add({
                url: "https://server6.mp3quran.net/akdr/001.mp3",
                title: "Test Track",
              });
              await TrackPlayer.play();
            }}
          />

          <Button
            title="pause"
            onPress={async () => {
              await TrackPlayer.pause();
            }}
          />

          <Text>
            {playerReady ? "Player is ready!" : "Setting up player..."}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
  },
}));
