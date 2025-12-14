-- Convert the email_verification_status column to VARCHAR
ALTER TABLE email_verification_tokens ALTER COLUMN status TYPE VARCHAR(50) USING status::text;
