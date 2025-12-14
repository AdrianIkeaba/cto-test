-- Insert default roles for Gym Management System
-- V1.0.1 - Insert default roles

INSERT INTO roles (name, description) VALUES 
('ADMIN', 'System administrator with full access'),
('MEMBER', 'Gym member with basic access'),
('TRAINER', 'Gym trainer with member and training management access'),
('STAFF', 'Gym staff with member support and basic management access');

-- Update sequence to continue from current values
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));