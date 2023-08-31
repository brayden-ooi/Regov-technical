import {
  Button,
  Pressable,
  SectionList,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Link, Tabs } from 'expo-router';
import { useState } from 'react';

import { Text, View } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import CovidAPI from '../../constants/CovidAPI';
import Colors from '../../constants/Colors';
import { nonNullable } from '../../utils';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full width

const TabSearchScreenHeader = ({
  searchStr,
  setSearchStr,
}: {
  searchStr: string;
  setSearchStr: (str: string) => void;
}) => (
  <View style={styles.searchContainer}>
    <Button onPress={() => setSearchStr('')} title="Clear" />
    <TextInput
      placeholder="Search"
      onChangeText={(text) => setSearchStr(text)}
      value={searchStr}
      style={styles.textInput}
    />
    {/* TODO */}
    <Button onPress={() => setSearchStr('')} disabled title="History" />
  </View>
);

export default function TabSearchScreen() {
  const [searchStr, setSearchStr] = useState('');
  const colorScheme = useColorScheme();

  const sections = CovidAPI.countriesByContinent
    .map(({ continent, countries }) => {
      const filteredCountries = countries.filter((country) =>
        country.includes(searchStr),
      );

      if (filteredCountries.length) {
        return {
          title: continent,
          data: filteredCountries,
        };
      }

      return null;
    })
    .filter(nonNullable);

  return (
    <View style={styles.pageContainer}>
      <Tabs.Screen
        options={{
          headerTitle: () => (
            <TabSearchScreenHeader
              searchStr={searchStr}
              setSearchStr={setSearchStr}
            />
          ),
        }}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.countryContainer}>
            <Link href={`/country/${item}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <View>
                    <Text
                      style={{
                        color: Colors[colorScheme ?? 'light'].text,
                        opacity: pressed ? 0.5 : 1,
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                )}
              </Pressable>
            </Link>
          </View>
        )}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length ? <Text style={styles.continent}>{title}</Text> : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No countries found!</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    width: width - 40,
    flexDirection: 'row',
    gap: 10,
    marginVertical: 3,
  },
  textInput: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#455fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  pageContainer: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  continent: {
    fontWeight: '200',
    padding: 10,
    paddingTop: 20,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },

  countryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  emptyContainer: {
    height: height - 120,
    width: width,
    flex: 1,
    justifyContent: 'center',
    margin: 'auto',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
  },
});
