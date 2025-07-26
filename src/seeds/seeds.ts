import { seedData } from './seedData';

(async () => {
  try {
    await seedData();
    console.log('✅ Data seeding completed');
  } catch (err) {
    console.error('❌ Data seeding failed:', err);
  } finally {
    process.exit();
  }
})();
