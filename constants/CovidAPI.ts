import Countries from './Countries';

export type GlobalStatsResponseType = {
  updated: number;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  affectedCountries: number;
};


class CovidAPI {
  // used for search groups
  static countriesByContinent = Countries;
  static countries = Countries.map(({ countries }) => countries).flat();

  static async getGlobalStats(): Promise<GlobalStatsResponseType | null> {
    try {
      const res = await fetch(
        'https://corona.lmao.ninja/v2/all?yesterday=null',
      );

      return (await res.json()) as GlobalStatsResponseType;
    } catch (e) {
      return null;
    }
  }

}

export default CovidAPI;
