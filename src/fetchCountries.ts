//API for requesting and receiving data from the server
interface Name {
  common: string,
  official: string,
  nativeName: {
    [key: string]: {
      official: string,
      common: string,
    }
  }
}

export interface Country {
  name: Name;
  capital: string[];
  population: number;
  flags: {
    png: string,
    svg: string,
    alt: string,
  };
  languages: {
    [key: string]: string
  };
}

export async function fetchCountries(name: string): Promise<Country[]> {
  const BASE_URL: string = 'https://restcountries.com/v3.1';
  const SEARCH_FILTER: string = 'fields=name,capital,population,flags,languages';
  const response = await fetch(`${BASE_URL}/name/${name}?${SEARCH_FILTER}`);
  if (!response.ok) {
    throw new Error(response.status.toString());
  }
  return await (response.json() as Promise<Country[]>);
}
