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
  // create airports table
  pgm.sql(`
    CREATE TABLE airports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      code VARCHAR(10) NOT NULL UNIQUE,
      city_id UUID NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // add foreign key constraint to cities table
  pgm.sql(`
    ALTER TABLE airports
    ADD CONSTRAINT fk_city
    FOREIGN KEY (city_id)
    REFERENCES cities(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
  // create index on airports name
  pgm.sql(`
    CREATE INDEX idx_airports_name ON airports (name)
  `);
  // create index on airports code
  pgm.sql(`
    CREATE INDEX idx_airports_code ON airports (code)
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop index on airports code
  pgm.sql(`
    DROP INDEX idx_airports_code
  `);
  // drop index on airports name
  pgm.sql(`
    DROP INDEX idx_airports_name
  `);
  // drop foreign key constraint
  pgm.sql(`
    ALTER TABLE airports
    DROP CONSTRAINT fk_city
  `);
  // drop airports table
  pgm.sql(`
    DROP TABLE airports
  `);
};
