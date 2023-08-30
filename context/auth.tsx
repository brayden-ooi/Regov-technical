import { useRootNavigation, useRouter, useSegments } from 'expo-router';
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMMKVObject } from 'react-native-mmkv';

type User = {
  username: string;
  email: string;
  password: string;
};

// Define the AuthContextValue interface
interface SignInResponse {
  data: Omit<User, 'username'> | null;
  error: Error | null;
}

interface SignOutResponse {
  error: any | null;
  data: {} | null;
}

interface AuthContextValue {
  signIn: (e: string, p: string) => Promise<SignInResponse>;
  signUp: (e: string, p: string, n: string) => Promise<SignInResponse>;
  signOut: () => Promise<SignOutResponse>;
  user: User | undefined;
}

// Create the AuthContext
const AuthContext = React.createContext<AuthContextValue | null>(null);

// This hook can be used to access the user info.
export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return authContext;
};

// This hook will protect the route access based on user authentication.
function useProtectedRoute(session: boolean) {
  const segments = useSegments();
  const router = useRouter();

  // checking that navigation is all good;
  const [isNavigationReady, setNavigationReady] = React.useState(false);
  const rootNavigation = useRootNavigation();

  useEffect(() => {
    const unsubscribe = rootNavigation?.addListener('state', (event) => {
      setNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  useEffect(() => {
    if (!isNavigationReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [session, segments, isNavigationReady]);
}

export function Provider(props: PropsWithChildren) {
  const [auth, setAuth] = useMMKVObject<User>('user');
  const [session, setSession] = useState<boolean>(false);

  useProtectedRoute(session);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<SignInResponse> => {
    try {
      // not allowed to sign in if in session
      if (session) {
        return { data: null, error: new Error('Not allowed to sign in') };
      }

      // if no account to match sign in will never work
      if (!auth) {
        return { data: null, error: new Error('No user registered') };
      }

      const user = {
        email,
        password,
      };

      if (auth.email !== email || auth.password !== password) {
        return { data: null, error: new Error('Wrong credentials') };
      }

      setSession(true);

      return { data: user, error: null };
    } catch (error) {
      setSession(false);
      return { error: error as Error, data: null };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
  ): Promise<SignInResponse> => {
    try {
      // not allowed to sign up if in session
      if (session) {
        return { data: null, error: new Error('Not allowed to sign up') };
      }

      // Only allow one registration for demonstration
      if (auth) {
        return { data: null, error: new Error('Not allowed to sign up') };
      }

      // TODO Install ZOD
      const user = {
        email,
        password,
        username,
      };
      setAuth(user);
      setSession(true);

      return { data: user, error: null };
    } catch (error) {
      setSession(false);
      return { error: error as Error, data: null };
    }
  };

  const signOut = async (): Promise<SignOutResponse> => {
    try {
      return { error: undefined, data: {} };
    } catch (error) {
      return { error, data: null };
    } finally {
      setSession(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        user: auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
