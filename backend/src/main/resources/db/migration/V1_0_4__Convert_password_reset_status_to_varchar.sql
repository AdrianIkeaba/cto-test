-- Convert the password_reset_status column to VARCHAR
ALTER TABLE password_reset_tokens ALTER COLUMN status TYPE VARCHAR(50) USING status::text;
