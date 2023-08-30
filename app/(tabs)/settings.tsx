import { Button, StyleSheet } from 'react-native';

import { View } from '../../components/Themed';
import { useAuth } from '../../context/auth';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Button onPress={signOut} title="Sign Out" />
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
