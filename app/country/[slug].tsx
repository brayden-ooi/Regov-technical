import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, Platform, StyleSheet } from 'react-native';
import { formatRelative } from 'date-fns';

import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useGetCountryStats } from '../../queries/CovidAPI';
import { useEffect } from 'react';
import { statFormatter } from '../../utils';
import { CountryStatsResponseType } from '../../constants/CovidAPI';
import Section from '../../components/Section';
import { tintColorLight } from '../../constants/Colors';

const sections = (payload: CountryStatsResponseType) => [
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

export default function CountryScreen() {
  const { slug } = useLocalSearchParams();
  const { status, data, error, refetch } = useGetCountryStats(
    slug as string, // HACK
  );

  useEffect(() => {
    if (status === 'success' && !data) {
      console.log(data);
      refetch();
    }
  }, [data, status]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{slug}</Text>

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
                <Image
                  style={{ height: 120, width: 240 }}
                  source={{ uri: data!.countryInfo.flag }}
                />
                <Text style={styles.timestamp}>
                  last updated{' '}
                  {formatRelative(new Date(data.updated), new Date())}
                </Text>

                <View
                  style={styles.separator}
                  lightColor="#eee"
                  darkColor="rgba(255,255,255,0.1)"
                />

                {sections(data).map(({ title, metrics }) => (
                  <Section key={title} title={title} metrics={metrics} />
                ))}
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

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  timestamp: {
    marginTop: 2,
    fontWeight: '100',
  },

  error: {
    marginTop: 200,
    fontSize: 16,
  },
});
