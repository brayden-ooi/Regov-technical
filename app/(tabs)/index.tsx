import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useGetGlobalStats } from '../../queries/CovidAPI';

export default function TabOneScreen() {
  const { status, data, error } = useGetGlobalStats();

  if (error) {
    console.log(error);
  }

  return (
    <View style={styles.container}>
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
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
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
