-- Sample data for cs425demo

-- Insert users
INSERT INTO user (uuid, name, email, password) VALUES
  (UUID(), 'Muhammed Raza', 'mraza@example.com', 'password123'),
  (UUID(), 'Luis Ortiz', 'lortiz@example.com', 'password456');

-- Insert categories
INSERT INTO category (uuid, name, description) VALUES
  (UUID(), 'Food', 'Groceries and dining out'),
  (UUID(), 'Transport', 'Public transport and fuel'),
  (UUID(), 'Utilities', 'Electricity, water, internet');

-- Insert budgets (assume user_id = 1, category_id = 1)
INSERT INTO budget (uuid, user_id, category_id, limit_amount, start_date, end_date, alert_threshold) VALUES
  (UUID(), 1, 1, 500.00, '2024-05-01', '2024-05-31', 400.00),
  (UUID(), 2, 2, 200.00, '2024-05-01', '2024-05-31', 150.00);

-- Insert expenses (assume user_id = 1, category_id = 1)
INSERT INTO expense (uuid, user_id, amount, date, description, category_id) VALUES
  (UUID(), 1, 45.50, '2024-05-05', 'Grocery shopping', 1),
  (UUID(), 2, 20.00, '2024-05-06', 'Bus ticket', 2);

-- Insert income sources (assume user_id = 1)
INSERT INTO income_source (uuid, name, amount, frequency, description, user_id) VALUES
  (UUID(), 'Job', 3000.00, 'monthly', 'Full-time job', 1),
  (UUID(), 'Freelance', 500.00, 'monthly', 'Side projects', 2);

-- Insert reports (assume user_id = 1)
INSERT INTO report (uuid, generated_at, type, data, user_id) VALUES
  (UUID(), NOW(), 'Monthly Summary', '{"total":3500}', 1); 