import { Animated, StatusBar, StyleSheet, Text } from 'react-native';

import { View } from '../../components/Themed';
import { useState } from 'react';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useGetAllCountryStats } from '../../queries/CovidAPI';

const FirstRoute = () => {
  const { status, data, error } = useGetAllCountryStats({
    sortBy: 'todayCases',
    yesterday: true,
  });

  return (
    <View style={[styles.container, { backgroundColor: '#ff4081' }]}>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

const SecondRoute = () => {
  const { status, data, error } = useGetAllCountryStats({
    sortBy: 'todayDeaths',
    yesterday: true,
  });

  return (
    <View style={[styles.container, { backgroundColor: '#673ab7' }]}>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

const ThirdRoute = () => {
  const { status, data, error } = useGetAllCountryStats({
    sortBy: 'cases',
  });

  return (
    <View style={[styles.container, { backgroundColor: '#673ac7' }]}>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

export default function RankingsScreen() {
  const [tabState, setTabState] = useState({
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
      { key: 'third', title: 'Third' },
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
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
      })}
      renderTabBar={renderTabBar}
      onIndexChange={setTabIndex}
    />
    // <View style={styles.container}>
    //   <Text style={styles.title}>{JSON.stringify(stuff)}</Text>
    //   <View
    //     style={styles.separator}
    //     lightColor="#eee"
    //     darkColor="rgba(255,255,255,0.1)"
    //   />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: StatusBar.currentHeight,
    height: 50,
    alignSelf: 'center',
    gap: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
