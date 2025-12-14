-- Convert the role_type column to VARCHAR
ALTER TABLE roles ALTER COLUMN name TYPE VARCHAR(50) USING name::text;
