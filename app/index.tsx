import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import TrackPlayer, { Capability } from "react-native-track-player";
import { PlaybackService } from "../src/services/PlaybackService";

export default function Index() {
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupPlayer() {
      try {
        // Register the playback service
        TrackPlayer.registerPlaybackService(() => PlaybackService);

        // Setup the player
        await TrackPlayer.setupPlayer();

        TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          notificationCapabilities: [Capability.Play, Capability.Pause],
        });

        setPlayerReady(true);
      } catch (e) {
        console.error("Failed to setup TrackPlayer:", e);
        setError(
          "TrackPlayer requires a development build. It won't work in Expo Go. Please run: npx expo run:android or npx expo run:ios"
        );
      }
    }
    setupPlayer();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
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
