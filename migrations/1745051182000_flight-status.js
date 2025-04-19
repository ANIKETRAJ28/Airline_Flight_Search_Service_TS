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
  // create status enums
  pgm.createType('flight_status', [
    'SCHEDULED',
    'BOARDING',
    'IN_FLIGHT',
    'LANDED',
    'COMPLETED',
    'DELAYED',
    'CANCELLED',
  ]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop status enums
  pgm.dropType('flight_status');
};
