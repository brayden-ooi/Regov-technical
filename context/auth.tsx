import { useRootNavigation, useRouter, useSegments } from 'expo-router';
import React, { PropsWithChildren } from 'react';

type User = {};

// Define the AuthContextValue interface
interface SignInResponse {
  data: User | null;
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
  user: User | null;
}

// Create the AuthContext
const AuthContext = React.createContext<AuthContextValue | null>(null);

// This hook can be used to access the user info.
export const useAuth = () => {
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return authContext;
};

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  // checking that navigation is all good;
  const [isNavigationReady, setNavigationReady] = React.useState(false);
  const rootNavigation = useRootNavigation();

  React.useEffect(() => {
    const unsubscribe = rootNavigation?.addListener('state', (event) => {
      setNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  React.useEffect(() => {
    if (!isNavigationReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [user, segments, isNavigationReady]);
}

export function Provider(props: PropsWithChildren) {
  const [user, setAuth] = React.useState<User | null>(null);

  useProtectedRoute(user);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<SignInResponse> => {
    try {
      const response = await Promise.resolve({});

      const user = await Promise.resolve({});
      setAuth(user);
      return { data: user, error: null };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: null };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
  ): Promise<SignInResponse> => {
    try {
      console.log(email, password, username);

      // // create the user
      // await appwrite.account.create(
      //   appwrite.ID.unique(),
      //   email,
      //   password,
      //   username
      // );

      // // create the session by logging in
      // await appwrite.account.createEmailSession(email, password);

      // get Account information for the user
      const user = await Promise.resolve({});
      setAuth(user);
      return { data: user, error: null };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: null };
    }
  };

  const signOut = async (): Promise<SignOutResponse> => {
    try {
      const response = await Promise.resolve({});
      return { error: undefined, data: response };
    } catch (error) {
      return { error, data: null };
    } finally {
      setAuth(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
