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
  // create airplane_rotations table
  pgm.sql(`
    CREATE TABLE airplane_rotations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      airplane_id UUID NOT NULL,
      sequence INT NOT NULL,
      from_airport_id UUID NOT NULL,
      to_airport_id UUID NOT NULL,
      duration_minutes INT NOT NULL,
      offset_minutes INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // add foreign key constraints
  pgm.sql(`
    ALTER TABLE airplane_rotations
    ADD CONSTRAINT fk_airplane
    FOREIGN KEY (airplane_id)
    REFERENCES airplanes(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
  pgm.sql(`
    ALTER TABLE airplane_rotations
    ADD CONSTRAINT fk_from_airport
    FOREIGN KEY (from_airport_id)
    REFERENCES airports(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
  pgm.sql(`
    ALTER TABLE airplane_rotations
    ADD CONSTRAINT fk_to_airport
    FOREIGN KEY (to_airport_id)
    REFERENCES airports(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop foreign key constraints
  pgm.sql(`
    ALTER TABLE airplane_rotations
    DROP CONSTRAINT fk_airplane
  `);
  pgm.sql(`
    ALTER TABLE airplane_rotations
    DROP CONSTRAINT fk_from_airport
  `);
  pgm.sql(`
    ALTER TABLE airplane_rotations
    DROP CONSTRAINT fk_to_airport
  `);
  // drop airplane_rotations table
  pgm.sql(`
    DROP TABLE airplane_rotations
  `);
};
