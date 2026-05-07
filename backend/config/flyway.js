const { Flyway } = require('node-flywaydb');
const path = require('path');

/**
 * Run Flyway migrations automatically
 * This ensures the database schema is always up-to-date
 */
async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');

        const flyway = new Flyway({
            migrationLocations: [path.join(__dirname, 'migrations')],
            driver: 'mysql2',
            url: process.env.DB_URL || `mysql://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            schemas: [process.env.DB_NAME],
            baselineOnMigrate: true,
            validateOnMigrate: true,
            outOfOrder: false,
            table: 'flyway_schema_history',
        });

        // Get migration info
        const info = await flyway.info();
        console.log(`📊 Migration status: ${info.migrations.length} migration(s) found`);

        // Check for pending migrations
        const pending = info.migrations.filter(m => m.state === 'Pending');

        if (pending.length > 0) {
            console.log(`⏳ ${pending.length} pending migration(s) to apply...`);

            // Run migrations
            const result = await flyway.migrate();

            console.log(`✅ Successfully applied ${result.migrationsExecuted} migration(s)`);
            console.log(`📌 Current schema version: ${result.targetSchemaVersion || 'baseline'}`);
        } else {
            console.log('✅ Database schema is up-to-date');
        }

        return true;
    } catch (error) {
        console.error('❌ Error running migrations:', error.message);
        console.error('⚠️  Continuing with application startup...');
        console.error('💡 You may need to run migrations manually: npm run migrate');

        // Don't throw error - allow app to start even if migrations fail
        return false;
    }
}

module.exports = { runMigrations };
