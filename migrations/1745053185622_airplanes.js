/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // create airplanes table
  pgm.sql(`
    CREATE TABLE airplanes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      code VARCHAR(10) NOT NULL UNIQUE,
      capacity INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // create index on airplanes name
  pgm.sql(`
    CREATE INDEX idx_airplanes_name ON airplanes (name)
  `);
  // create index on airplanes code
  pgm.sql(`
    CREATE INDEX idx_airplanes_code ON airplanes (code)
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop index on airplanes code
  pgm.sql(`
    DROP INDEX idx_airplanes_code
  `);
  // drop index on airplanes name
  pgm.sql(`
    DROP INDEX idx_airplanes_name
  `);
  // drop airplanes table
  pgm.sql(`
    DROP TABLE airplanes
  `);
};
