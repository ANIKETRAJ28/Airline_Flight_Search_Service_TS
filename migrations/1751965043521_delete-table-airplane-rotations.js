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
  pgm.sql(`DROP TABLE IF EXISTS airplane_rotations;`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    CREATE TABLE airplane_rotations (
      id SERIAL PRIMARY KEY,
      airplane_id UUID NOT NULL,
      from_airport_id UUID NOT NULL,
      to_airport_id UUID NOT NULL,
      flight_number VARCHAR(10) NOT NULL,
      departure_time TIMESTAMP NOT NULL,
      arrival_time TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    ALTER TABLE airplane_rotations
    ADD CONSTRAINT fk_airplane
    FOREIGN KEY (airplane_id)
    REFERENCES airplanes(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
    ALTER TABLE airplane_rotations
    ADD CONSTRAINT fk_from_airport
    FOREIGN KEY (from_airport_id)
    REFERENCES airports(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
    ALTER TABLE airplane_rotations
    ADD CONSTRAINT fk_to_airport
    FOREIGN KEY (to_airport_id)
    REFERENCES airports(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
  `);
};
