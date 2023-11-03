// jest.setup.js
(async () => {
    const dotenv = await import('dotenv');
    dotenv.config({ path: '.env.test' });
  })();
  