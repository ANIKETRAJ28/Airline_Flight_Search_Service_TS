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
  // create cities table
  pgm.sql(`CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);
  // add foreign key constraint to countries table
  pgm.sql(`ALTER TABLE cities
    ADD CONSTRAINT fk_country
    FOREIGN KEY (country_id)
    REFERENCES countries(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
  // create index on cities name
  pgm.sql(`CREATE INDEX idx_cities_name ON cities (name)`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop index on cities name
  pgm.sql(`DROP INDEX idx_cities_name`);
  // drop foreign key constraint
  pgm.sql(`ALTER TABLE cities
    DROP CONSTRAINT fk_country
  `);
  // drop cities table
  pgm.sql(`DROP TABLE cities`);
};
