import { Button, StyleSheet } from 'react-native';

import { View } from '../../components/Themed';
import { useAuth } from '../../context/auth';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Button onPress={signOut} title="Sign Out" />
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
});
