jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));
