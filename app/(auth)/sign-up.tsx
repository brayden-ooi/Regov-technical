import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import { useAuth } from "../context/auth";
import { Stack, useRouter } from 'expo-router';
import { useRef } from 'react';
import { useAuth } from '../../context/auth';

export default function SignUp() {
  const { signUp } = useAuth();
  const router = useRouter();

  const emailRef = useRef('');
  const passwordRef = useRef('');
  const userNameRef = useRef('');

  const onPressSignUp = async () => {
    const { data, error } = await signUp(
      emailRef.current,
      passwordRef.current,
      userNameRef.current,
    );
    if (data) {
      router.replace('/');
    } else {
      console.log(error);
      // Alert.alert("Login Error", resp.error?.message);
    }
  };

  const onPressSignIn = () => router.replace('/sign-in');

  return (
    <>
      <Stack.Screen options={{ title: 'sign up', headerShown: false }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="John"
            autoCapitalize="none"
            nativeID="userName"
            onChangeText={(text) => {
              userNameRef.current = text;
            }}
            style={styles.textInput}
          />
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="john@regov.com"
            autoCapitalize="none"
            nativeID="email"
            onChangeText={(text) => {
              emailRef.current = text;
            }}
            style={styles.textInput}
          />
        </View>
        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="********"
            secureTextEntry={true}
            nativeID="password"
            onChangeText={(text) => {
              passwordRef.current = text;
            }}
            style={styles.textInput}
          />
        </View>

        <TouchableOpacity onPress={onPressSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: '200' }} onPress={onPressSignIn}>
            Click Here To Return To Sign In Page
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: '#455fff',
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#455fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    width: 250,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
