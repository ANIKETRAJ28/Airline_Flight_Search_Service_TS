import { CityRepository } from '../../src/repository/city.repository';
import { ApiError } from '../../src/util/api.util';

const mockCityWithCountry = [
  {
    id: 'test-id',
    name: 'Test City',
    country: {
      id: 'country-id',
      name: 'Test Country',
      code: 'TC',
      created_at: new Date(),
      updated_at: new Date(),
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'another-test-id',
    name: 'Another Test City',
    country: {
      id: 'another-country-id',
      name: 'Another Test Country',
      code: 'ATC',
      created_at: new Date(),
      updated_at: new Date(),
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockCity = [
  {
    id: 'test-id',
    name: 'Test City',
    country_id: 'country-id',
    country_name: 'Test Country',
    country_code: 'TC',
    country_created_at: new Date(),
    country_updated_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'another-test-id',
    name: 'Another Test City',
    country_id: 'another-country-id',
    country_name: 'Another Test Country',
    country_code: 'ATC',
    country_created_at: new Date(),
    country_updated_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockPool = {
  connect: jest.fn(() => mockClient),
};

jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
}));

describe('CityRepository Test', () => {
  const repo = new CityRepository();

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('getAllCities should return all cities', async () => {
    mockClient.query.mockResolvedValueOnce({ rows: mockCity });
    const result = await repo.getAllCities();
    expect(result).toEqual(mockCityWithCountry);
  });

  it('getCityById should return a city by id', async () => {
    const cityId = 'test-id';
    mockClient.query.mockResolvedValueOnce({ rows: [mockCity[0]] });
    const result = await repo.getCityById(cityId);
    expect(result).toEqual(mockCityWithCountry[0]);
  });

  it('getCityById should throw an error of city not found', async () => {
    const cityId = 'non-existing-id';
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    await expect(repo.getCityById(cityId)).rejects.toThrow(ApiError);
  });

  it('getCityByName should return a city by name', async () => {
    const cityName = 'Test City';
    mockClient.query.mockResolvedValueOnce({ rows: [mockCity[0]] });
    const result = await repo.getCityByName(cityName);
    expect(result).toEqual(mockCityWithCountry[0]);
  });

  it('getCityByName should throw an error of city not found', async () => {
    const cityName = 'Non-existing City';
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    await expect(repo.getCityByName(cityName)).rejects.toThrow(ApiError);
  });

  it('createCity should create a city', async () => {
    const newCity = {
      name: 'New City',
      country_id: 'new-country-id',
    };
    const newCityWithCountry = {
      id: 'new-id',
      name: 'New City',
      country: {
        id: 'new-country-id',
        name: 'New Country',
        code: 'NC',
        created_at: new Date(),
        updated_at: new Date(),
      },
      created_at: new Date(),
      updated_at: new Date(),
    };
    repo.getCityByName = jest.fn(async () => await newCityWithCountry);
    const result = await repo.createCity(newCity);
    expect(result).toEqual(newCityWithCountry);
  });

  it('updateCityName should update a city name', async () => {
    const updatedCity = {
      id: 'new-id',
      name: 'UpdatedCity',
      country: {
        id: 'new-country-id',
        name: 'New Country',
        code: 'NC',
        created_at: new Date(),
        updated_at: new Date(),
      },
      created_at: new Date(),
      updated_at: new Date(),
    };
    repo.getCityById = jest.fn(async () => await updatedCity);
    const result = await repo.updateCityName('new-id', 'UpdatedCity');
    expect(result).toEqual(updatedCity);
  });
});
