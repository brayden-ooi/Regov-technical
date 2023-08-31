import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { formatRelative } from 'date-fns';
import { View } from '../../components/Themed';
import { useEffect, useState } from 'react';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useGetAllCountryStats } from '../../queries/CovidAPI';
import { CountryStatsResponseType } from '../../constants/CovidAPI';
import { statFormatter } from '../../utils';
import Colors, { tintColorLight } from '../../constants/Colors';

const Card = ({
  payload,
  selector,
  index,
}: {
  payload: CountryStatsResponseType;
  selector: keyof CountryStatsResponseType;
  index: number;
}) => {
  const colorScheme = useColorScheme();

  return (
    <Link href={`/country/${payload.country}`} asChild>
      <Pressable>
        {({ pressed }) => (
          <View style={styles.cardContainer}>
            <View style={styles.rankContainer}>
              <Text style={styles.rank}>{index + 1}</Text>
            </View>
            <View style={styles.countryInfoContainer}>
              <Text
                style={{
                  color: Colors[colorScheme ?? 'light'].text,
                  opacity: pressed ? 0.5 : 1,
                }}
              >
                {payload.country}
              </Text>
              <Text style={styles.timestamp}>
                {formatRelative(new Date(payload.updated), new Date())}
              </Text>
            </View>
            <View style={styles.metricContainer}>
              <Text>{statFormatter(Number(payload[selector]))}</Text>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
};

const FirstRoute = () => {
  const { status, data, error, refetch } = useGetAllCountryStats({
    sortBy: 'todayCases',
    yesterday: true,
  });

  useEffect(() => {
    if (status === 'success' && !data) {
      refetch();
    }
  }, [data, status]);

  return (
    <View
      style={[styles.container, status === 'error' && { alignItems: 'center' }]}
    >
      {(() => {
        switch (status) {
          case 'success': {
            return (
              <FlatList
                data={data}
                renderItem={({ item, index }) => (
                  <Card payload={item} selector="todayCases" index={index} />
                )}
                keyExtractor={(item) => item.countryInfo._id + item.country}
              />
            );
          }
          case 'error': {
            return (
              <Text style={styles.error}>The page could not be fetched!</Text>
            );
          }
          case 'loading': {
            return (
              <ActivityIndicator
                size="large"
                color={tintColorLight}
                style={{ marginTop: 200 }}
              />
            );
          }
        }
      })()}
    </View>
  );
};

const SecondRoute = () => {
  const { status, data, error, refetch } = useGetAllCountryStats({
    sortBy: 'todayDeaths',
    yesterday: true,
  });

  useEffect(() => {
    if (status === 'success' && !data) {
      refetch();
    }
  }, [data, status]);

  return (
    <View
      style={[styles.container, status === 'error' && { alignItems: 'center' }]}
    >
      {(() => {
        switch (status) {
          case 'success': {
            return (
              <FlatList
                data={data}
                renderItem={({ item, index }) => (
                  <Card payload={item} selector="todayDeaths" index={index} />
                )}
                keyExtractor={(item) => item.countryInfo._id + item.country}
              />
            );
          }
          case 'error': {
            return (
              <Text style={styles.error}>The page could not be fetched!</Text>
            );
          }
          case 'loading': {
            return (
              <ActivityIndicator
                size="large"
                color={tintColorLight}
                style={{ marginTop: 200 }}
              />
            );
          }
        }
      })()}
    </View>
  );
};

const ThirdRoute = () => {
  const { status, data, error, refetch } = useGetAllCountryStats({
    sortBy: 'cases',
  });

  useEffect(() => {
    if (status === 'success' && !data) {
      refetch();
    }
  }, [data, status]);

  return (
    <View
      style={[styles.container, status === 'error' && { alignItems: 'center' }]}
    >
      {(() => {
        switch (status) {
          case 'success': {
            return (
              <FlatList
                data={data}
                renderItem={({ item, index }) => (
                  <Card payload={item} selector="cases" index={index} />
                )}
                keyExtractor={(item) => item.countryInfo._id + item.country}
              />
            );
          }
          case 'error': {
            return (
              <Text style={styles.error}>The page could not be fetched!</Text>
            );
          }
          case 'loading': {
            return (
              <ActivityIndicator
                size="large"
                color={tintColorLight}
                style={{ marginTop: 200 }}
              />
            );
          }
        }
      })()}
    </View>
  );
};

export default function RankingsScreen() {
  const [tabState, setTabState] = useState({
    index: 0,
    routes: [
      { key: 'todayCases', title: "Today's Cases" },
      { key: 'todayDeaths', title: "Today's Deaths" },
      { key: 'cases', title: 'Total Cases' },
    ],
  });
  const setTabIndex = (index: number) =>
    setTabState((prevState) => ({ ...prevState, index }));

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{
        key: string;
        title: string;
      }>;
    },
  ) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5,
            ),
          });

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => setTabIndex(i)}
            >
              <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabView
      navigationState={tabState}
      renderScene={SceneMap({
        todayCases: FirstRoute,
        todayDeaths: SecondRoute,
        cases: ThirdRoute,
      })}
      renderTabBar={renderTabBar}
      onIndexChange={setTabIndex}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: StatusBar.currentHeight,
    marginBottom: 10,
    height: 50,
    alignSelf: 'center',
    gap: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderColor: '#333333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
  },

  cardContainer: {
    flex: 1,
    width: 'auto',
    marginTop: 10,
    marginHorizontal: 10,
    minHeight: 60,
    borderColor: '#bbb',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,

    flexDirection: 'row',
    gap: 10,
  },

  rankContainer: {
    width: '14%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rank: {
    fontWeight: '200',
  },

  countryInfoContainer: {
    width: '54%',
    padding: 10,
  },
  timestamp: {
    fontWeight: '200',
    fontSize: 12,
  },

  metricContainer: {
    width: '29%',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },

  error: {
    marginTop: 200,
    fontSize: 16,
  },
});
