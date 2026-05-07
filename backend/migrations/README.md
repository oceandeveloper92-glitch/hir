# Database Migrations

This folder contains all Flyway database migrations for the HIR International project.

## Current Migrations

### V1__add_passport_fields.sql
**Status:** Pending
**Description:** Adds new fields to the passports table

**Changes:**
- Lead tracking fields (date, leadStatus, phoneNumber, leadSource, remark, assignedTo)
- Process tracking fields (processDate, processStatus, processRemark)
- Portal credentials (portalId, portalPassword, portalLink)

**To Apply:**
```bash
cd backend
npm run migrate
```

## Creating New Migrations

1. Create a new file following the naming convention:
   ```
   V{version}__{description}.sql
   ```

2. Write your SQL migration

3. Test locally:
   ```bash
   npm run migrate:info    # Check status
   npm run migrate         # Apply
   npm run migrate:validate # Verify
   ```

4. Commit to Git

## Migration Naming Examples

- `V1__create_users_table.sql`
- `V2__add_email_column.sql`
- `V3__create_indexes.sql`
- `V1.1__hotfix_user_table.sql`

## Important Rules

1. **Never modify applied migrations** - Create a new migration instead
2. **Use descriptive names** - Make it clear what the migration does
3. **Keep migrations small** - One logical change per migration
4. **Test locally first** - Always test before applying to production

## Quick Commands

```bash
# Show migration status
npm run migrate:info

# Apply pending migrations
npm run migrate

# Validate migrations
npm run migrate:validate

# Baseline existing database (first time only)
npm run migrate:baseline
```

## Need Help?

See `FLYWAY_SETUP_GUIDE.md` in the project root for detailed instructions.
