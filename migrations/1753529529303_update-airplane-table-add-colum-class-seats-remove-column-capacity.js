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
    ALTER TABLE airplanes
    ADD COLUMN economy_class_seats INTEGER NOT NULL,
    ADD COLUMN business_class_seats INTEGER NOT NULL,
    ADD COLUMN premium_class_seats INTEGER NOT NULL
  `);
  pgm.sql(`
    ALTER TABLE airplanes
    DROP COLUMN capacity
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE airplanes
    ADD COLUMN capacity INTEGER NOT NULL
  `);
  pgm.sql(`
    ALTER TABLE airplanes
    DROP COLUMN economy_class_seats,
    DROP COLUMN business_class_seats,
    DROP COLUMN premium_class_seats
  `);
};
