
exports.up = function (knex) {
    return knex.schema.withSchema('public').createTable('history', function (table) {
        table.increments('id').primary();
        table.string('userName').notNullable();
        table.string('projectName').notNullable();
        table.string('sprintName').notNullable();
        table.float('RemainingSeconds').notNullable();
        table.float('EstimatedSeconds').notNullable();
        table.float('AcutalSeconds').notNullable();
        table.float('FinalRatio').notNullable();
        table.float('BaseSprintSalary').notNullable();
        table.float('FinalSprintSalary').notNullable();
        table.jsonb('issues').notNullable();
        table.string('token').unique().notNullable();
        table.timestamps();
    });
};
exports.down = function (knex) {
    return knex.schema.dropTable('history')
};
