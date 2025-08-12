import { AirplaneRepository } from '../../src/repository/airplane.repository';

const mockAirplane = [
  {
    id: 'test-id',
    name: 'Test Airplane',
    code: 'TA123',
    capacity: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'another-test-id',
    name: 'Another Test Airplane',
    code: 'ATA456',
    capacity: 100,
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

describe('AirplaneRepository Test', () => {
  const repo = new AirplaneRepository();

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('getAllAirplanes should return all airplanes', async () => {
    mockClient.query.mockResolvedValueOnce({ rows: mockAirplane });
    const result = await repo.getAllAirplanes();
    expect(result).toEqual(mockAirplane);
  });

  it('getAirplaneById should return an airplane by id', async () => {
    const airplaneId = 'test-id';
    mockClient.query.mockResolvedValueOnce({ rows: [mockAirplane[0]] });
    const result = await repo.getAirplaneById(airplaneId);
    expect(result).toEqual(mockAirplane[0]);
  });

  it('getAirplaneByCode should return an airplane by code', async () => {
    const airplaneCode = 'TA123';
    mockClient.query.mockResolvedValueOnce({ rows: [mockAirplane[0]] });
    const result = await repo.getAirplaneByCode(airplaneCode);
    expect(result).toEqual(mockAirplane[0]);
  });
});
