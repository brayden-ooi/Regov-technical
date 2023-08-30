import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useGetCountryStats } from '../../queries/CovidAPI';

export default function CountryScreen() {
  const { slug } = useLocalSearchParams();
  const { status, data, error } = useGetCountryStats(
    slug as string, // HACK
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{slug}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {(() => {
        switch (status) {
          case 'success': {
            return <Text style={styles.title}>{JSON.stringify(data)}</Text>;
          }
          case 'error': {
            return (
              <Text style={styles.title}>The page could not be fetched!</Text>
            );
          }
          case 'loading': {
            return <Text style={styles.title}>Loading...</Text>;
          }
        }
      })()}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
