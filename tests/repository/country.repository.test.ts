import { CountryRepository } from '../../src/repository/country.repository';
import { ApiError } from '../../src/util/api.util';

// mock data
const mockCountry = [
  {
    id: 'test-id',
    name: 'Test Country',
    code: 'TC',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'another-test-id',
    name: 'Another Test Country',
    code: 'ATC',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// the client has 2 functions which we use after connect() function,
// query -> which queries the command, release which releases the client
// this simulates them
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

// mock pool simulates the connection to the database
// after connection it gives two functions which we use are query and release which are mocked by mockClient
const mockPool = {
  connect: jest.fn(() => mockClient),
};

// mocks the whole pg module
jest.mock('pg', () => ({
  // mocks the Pool class wherever pg module is used with the mockPool
  Pool: jest.fn(() => mockPool),
}));

describe('CountryRepository Test', () => {
  const repo = new CountryRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createCountry should create a country', async () => {
    const newCountry = {
      name: 'New Country',
      code: 'NC',
    };
    mockClient.query.mockResolvedValueOnce({
      rows: [{ id: 'new-id', created_at: new Date(), updated_at: new Date(), ...newCountry }, ...mockCountry],
    });
    const result = await repo.createCountry(newCountry);
    expect(result).toEqual({ id: 'new-id', created_at: expect.any(Date), updated_at: expect.any(Date), ...newCountry });
  });
  /**
   * So, the functionality goes like this
   * 1. When the CountryRepository is instantiated, it fetches the pool from the dbPool.util.ts file.
   * 2. The getPool function returns a mock pool that simulates the connection to the database.
   * 3. When the getAllCountries method is called, it connects to the mock pool, executes a query, and returns the mock country data.
   * 4. The mockClient.query function is used to simulate the database query and return the mock country data.
   * 5. The mockClient.release function is called to release the client after the query is executed.
   */
  it('getAllCountries should return all countries', async () => {
    // mocks the query function to return the mock country data
    mockClient.query.mockResolvedValueOnce({ rows: mockCountry });
    const result = await repo.getAllCountries();
    expect(result).toEqual(mockCountry);
  });

  it('getCountryById should return a country by id', async () => {
    const countryId = 'test-id';
    mockClient.query.mockResolvedValueOnce({ rows: [mockCountry[0]] });
    const result = await repo.getCountryById(countryId);
    expect(result).toEqual(mockCountry[0]);
  });

  it('getCountryById should throw an error of country not found', async () => {
    const countryId = 'non-existing-id';
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    await expect(repo.getCountryById(countryId)).rejects.toThrow(ApiError);
  });

  it('getCountryByName should return a country by name', async () => {
    const countryName = 'Test Country';
    mockClient.query.mockResolvedValueOnce({ rows: [mockCountry[0]] });
    const result = await repo.getCountryByName(countryName);
    expect(result).toBe(mockCountry[0]);
  });

  it('getCountryByCode should return a country by code', async () => {
    const countryCode = 'TC';
    mockClient.query.mockResolvedValueOnce({ rows: [mockCountry[0]] });
    const result = await repo.getCountryByCode(countryCode);
    expect(result).toBe(mockCountry[0]);
    expect(result).not.toBe(mockCountry[1]);
  });

  it('getCountryByCode should throw an error of country not found', async () => {
    const countryCode = 'UC';
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    await expect(repo.getCountryByCode(countryCode)).rejects.toThrow(ApiError);
  });
});
