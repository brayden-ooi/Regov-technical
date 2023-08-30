import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import CovidAPI, { CountryStatsResponseType } from '../../constants/CovidAPI';

export default function ModalScreen() {
  const { slug } = useLocalSearchParams();
  const [stuff, setS] = useState<CountryStatsResponseType | null>(null);

  useEffect(() => {
    CovidAPI.getCountryStats(slug as string).then((res) => setS(res));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{slug}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>{JSON.stringify(stuff)}</Text>

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
