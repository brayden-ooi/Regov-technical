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

export type CountryStatsResponseType = {
  updated: number;
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
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
};

export type GetAllCountryStatsRequestParams = {
  sortBy?:
    | 'cases'
    | 'todayCases'
    | 'deaths'
    | 'todayDeaths'
    | 'recovered'
    | 'active'
    | 'critical'
    | 'casesPerOneMillion'
    | 'deathsPerOneMillion';
  yesterday?: boolean;
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

  static async getCountryStats(
    country: string,
  ): Promise<CountryStatsResponseType | null> {
    try {
      const res = await fetch(
        `https://corona.lmao.ninja/v2/countries/${country}?yesterday=null&strict=false&query%20=null`,
      );

      return (await res.json()) as CountryStatsResponseType;
    } catch (e) {
      return null;
    }
  }

  static async getAllCountryStats(
    config?: GetAllCountryStatsRequestParams,
  ): Promise<Array<CountryStatsResponseType> | null> {
    try {
      const params: Record<string, string> = {};

      if (config) {
        if (config.sortBy) {
          params.sort = config.sortBy;
        }

        if (config.yesterday) {
          params.yesterday = config.yesterday ? 'true' : 'false';
        }
      }

      const res = await fetch(
        `https://corona.lmao.ninja/v2/countries?${new URLSearchParams(
          params,
        ).toString()}`,
      );

      return (await res.json()) as Array<CountryStatsResponseType>;
    } catch (e) {
      return null;
    }
  }
}

export default CovidAPI;
