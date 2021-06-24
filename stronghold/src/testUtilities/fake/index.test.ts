
it('should export TestStrategy', async () => {
  const { TestStrategy } = await import('.')
  expect(TestStrategy).not.toBeFalsy()
})
