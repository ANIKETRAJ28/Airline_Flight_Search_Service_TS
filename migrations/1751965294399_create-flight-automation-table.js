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
    CREATE TABLE flight_automations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      start_date TIMESTAMPTZ NOT NULL,
      offset_day INTEGER NOT NULL DEFAULT 0,
      airplane_id UUID NOT NULL,
      flight_rotation JSONB NOT NULL,
      is_cancelled BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  pgm.sql(`
    ALTER TABLE flight_automations
    ADD CONSTRAINT fk_airplane
    FOREIGN KEY (airplane_id)
    REFERENCES airplanes(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE flight_automations
    DROP CONSTRAINT fk_airplane;
  `);
  pgm.sql(`
    DROP TABLE IF EXISTS flight_automations;
  `);
};
