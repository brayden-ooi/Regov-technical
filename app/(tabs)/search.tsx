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
const height = Dimensions.get('window').height; //full height

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
    <Button onPress={() => setSearchStr('')} title="History" />
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
                  <Text
                    style={{
                      fontSize: 24,
                      color: Colors[colorScheme ?? 'light'].text,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  >
                    {item}
                  </Text>
                )}
              </Pressable>
            </Link>
          </View>
        )}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length ? <Text style={styles.continent}>{title}</Text> : null
        }
        ListEmptyComponent={() => <Text>No country found!</Text>}
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

  countryContainer: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  continent: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
});
