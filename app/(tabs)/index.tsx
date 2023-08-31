import { ActivityIndicator, StyleSheet } from 'react-native';
import { formatRelative } from 'date-fns';

import { Text, View } from '../../components/Themed';
import { useGetGlobalStats } from '../../queries/CovidAPI';
import { useEffect } from 'react';
import { statFormatter } from '../../utils';
import { GlobalStatsResponseType } from '../../constants/CovidAPI';
import Section from '../../components/Section';
import { tintColorLight } from '../../constants/Colors';

const sections = (payload: GlobalStatsResponseType) => [
  {
    title: 'Cases',
    metrics: [
      {
        title: 'Total Cases',
        stat: statFormatter(payload.cases),
      },
      {
        title: "Today's Cases",
        stat: statFormatter(payload.todayCases),
      },
      {
        title: 'Cases per 1M',
        stat: statFormatter(payload.casesPerOneMillion),
      },
    ],
  },
  {
    title: 'Deaths',
    metrics: [
      {
        title: 'Total Deaths',
        stat: statFormatter(payload.deaths),
      },
      {
        title: "Today's Deaths",
        stat: statFormatter(payload.todayDeaths),
      },
      {
        title: 'Deaths per 1M',
        stat: statFormatter(payload.deathsPerOneMillion),
      },
    ],
  },
  {
    title: 'Status',
    metrics: [
      {
        title: 'Active',
        stat: statFormatter(payload.active),
      },
      {
        title: 'Recovered',
        stat: statFormatter(payload.recovered),
      },
      {
        title: 'Critical',
        stat: statFormatter(payload.critical),
      },
    ],
  },
  {
    title: 'Testing',
    metrics: [
      {
        title: 'Total Tests',
        stat: statFormatter(payload.tests),
      },
      {
        title: 'Tests per 1M',
        stat: statFormatter(payload.testsPerOneMillion),
      },
    ],
  },
];

export default function TabOneScreen() {
  const { status, data, error, refetch } = useGetGlobalStats();

  useEffect(() => {
    if (status === 'success' && !data) {
      refetch();
    }
  }, [data, status]);

  return (
    <View style={styles.container}>
      {(() => {
        switch (status) {
          case 'success': {
            if (!data) {
              return (
                <Text style={styles.error}>The page could not be fetched!</Text>
              );
            }

            return (
              <>
                {sections(data).map(({ title, metrics }) => (
                  <Section key={title} title={title} metrics={metrics} />
                ))}

                <View
                  style={styles.separator}
                  lightColor="#eee"
                  darkColor="rgba(255,255,255,0.1)"
                />

                <Text style={styles.timestamp}>
                  last updated{' '}
                  {formatRelative(new Date(data!.updated), new Date())}
                </Text>
              </>
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
    marginTop: 10,
    height: 1,
    width: '80%',
  },

  timestamp: {
    marginVertical: 10,
    fontWeight: '100',
  },

  error: {
    fontSize: 16,
  },
});
