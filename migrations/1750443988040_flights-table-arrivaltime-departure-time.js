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
  pgm.sql(`
    ALTER TABLE flights
    ALTER COLUMN arrival_time TYPE TIMESTAMPTZ USING arrival_time::TIMESTAMPTZ,
    ALTER COLUMN departure_time TYPE TIMESTAMPTZ USING departure_time::TIMESTAMPTZ;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE flights
    ALTER COLUMN arrival_time TYPE TIMESTAMP USING arrival_time::TIMESTAMP,
    ALTER COLUMN departure_time TYPE TIMESTAMP USING departure_time::TIMESTAMP;
  `);
};
