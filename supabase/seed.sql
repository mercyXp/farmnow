-- DEMO / DEVELOPMENT SEED DATA
-- Extracted from FarmNow_ERP_System.xlsx. Do not use as production history without review.
begin;

-- Settings
insert into public.settings (key, value) values
  ('CompanyName', 'FarmNow Limited'),
  ('Location', 'Lusaka, Zambia'),
  ('Phone', '+260 000 000000'),
  ('Email', 'info@farmnow.example'),
  ('CurrencySymbol', 'K'),
  ('ReportCurrency', 'ZMW'),
  ('TargetFCR', '1.7'),
  ('TargetLivabilityPct', '0.95'),
  ('MortalityAlertThresholdPct', '0.02'),
  ('MedicineExpiryWarningDays', '30'),
  ('CurrentFlockCounter', '4');

insert into public.lookup_options (list_name, value, sort_order) values
  ('PaymentMethod', 'Cash', 0),
  ('PaymentMethod', 'Mobile Money', 1),
  ('PaymentMethod', 'Bank Transfer', 2),
  ('PaymentMethod', 'Cheque', 3),
  ('PaymentMethod', 'Credit', 4),
  ('LitterCondition', 'Dry', 0),
  ('LitterCondition', 'Damp', 1),
  ('LitterCondition', 'Wet', 2),
  ('LitterCondition', 'Needs Changing', 3),
  ('Ventilation', 'Good', 0),
  ('Ventilation', 'Fair', 1),
  ('Ventilation', 'Poor', 2),
  ('ExpenseCategory', 'Day-Old Chicks', 0),
  ('ExpenseCategory', 'Bedding/Litter', 1),
  ('ExpenseCategory', 'Utilities', 2),
  ('ExpenseCategory', 'Labour', 3),
  ('ExpenseCategory', 'Transport', 4),
  ('ExpenseCategory', 'Veterinary', 5),
  ('ExpenseCategory', 'Heater/Fuel', 6),
  ('YesNo', 'Yes', 0),
  ('YesNo', 'No', 1),
  ('MortalityCause', 'Normal Culling', 0),
  ('MortalityCause', 'Heat Stress', 1),
  ('MortalityCause', 'Disease', 2),
  ('MortalityCause', 'Predator', 3),
  ('MortalityCause', 'Cold Stress', 4),
  ('MortalityCause', 'Other', 5),
  ('VaccinationRoute', 'Eye Drop', 0),
  ('VaccinationRoute', 'Drinking Water', 1),
  ('VaccinationRoute', 'Injection', 2),
  ('VaccinationRoute', 'Spray', 3),
  ('IncomeSource', 'Manure Sales', 0),
  ('IncomeSource', 'Empty Bag Sales', 1),
  ('IncomeSource', 'Equipment Rental', 2),
  ('IncomeSource', 'Other', 3),
  ('ProductType', 'Vaccine', 0),
  ('ProductType', 'Antibiotic', 1),
  ('ProductType', 'Supplement', 2),
  ('FeedStage', 'Starter', 0),
  ('FeedStage', 'Grower', 1),
  ('FeedStage', 'Finisher', 2);

-- Houses
insert into public.houses (id, code, capacity, location_zone, status) values
  ('dd5e189d-3b8c-5070-93ca-90cdd68cee40', 'H-01', 5000, 'Zone A', 'Active'),
  ('51ab42c2-4d82-5260-89a5-94832a20b202', 'H-02', 5000, 'Zone A', 'Active'),
  ('5cd08494-410b-5da3-8c2a-2ed534c6a23e', 'H-03', 4000, 'Zone B', 'Active'),
  ('27bb7838-7041-5c4f-bc2f-0b99191b217a', 'H-04', 4000, 'Zone B', 'Inactive');

-- Breeds
insert into public.breeds (id, name, standard_fcr, standard_adg_g) values
  ('f43ca945-fc0c-5e27-993b-4c017b7d8fc5', 'Ross 308', 1.65, 62),
  ('7b55139d-f426-50c9-9ef1-c75caafdbe9a', 'Cobb 500', 1.68, 60),
  ('49f35b88-8436-5ffb-875c-7fc769e907bb', 'Arbor Acres', 1.7, 58);

-- Feed types
insert into public.feed_types (id, name, stage, unit_cost_per_kg, standard_bag_weight_kg, min_stock_kg) values
  ('e689167d-50ce-5047-850f-a2a47dcbf83b', 'Starter Mash', 'Starter', 12.5, 50, 300),
  ('9c9ffb99-da75-5e11-9453-8a0588e0d05d', 'Grower Mash', 'Grower', 11.8, 50, 400),
  ('2e920a97-1519-57ba-99c2-837c8b6ac99c', 'Finisher Mash', 'Finisher', 11.2, 50, 400);

-- Suppliers
insert into public.suppliers (id, name, contact, email, category, lead_time_days) values
  ('f719fe71-4ff1-5500-87a0-90e60f399572', 'Zamchick Hatchery', '+260-97-111-2222', 'sales@zamchick.example', 'Day-Old Chicks', 2),
  ('0c284e97-9090-5435-8d59-9bdf67f938ac', 'National Milling Co', '+260-96-333-4444', 'orders@natmill.example', 'Feed', 1),
  ('ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', 'AgroVet Supplies Ltd', '+260-95-555-6666', 'info@agrovet.example', 'Veterinary', 3),
  ('1218763d-287d-5520-a2f3-667873667e07', 'Lusaka Wood Shavings Ltd', '+260-97-888-1111', 'sales@lusakawood.example', 'Bedding/Litter', 2);

-- Customers
insert into public.customers (id, name, contact, address, price_tier, payment_terms) values
  ('18a2184a-c8fe-5906-9929-46556d21ade0', 'Shoprite Lusaka', '+260-21-123-4567', 'Cairo Road, Lusaka', 'Wholesale', '30 Days Credit'),
  ('ebaa79dc-deee-566e-bfee-cc5da61557d2', 'Melissa Poultry Traders', '+260-97-777-8888', 'Kabwata, Lusaka', 'Retail', 'Cash on Delivery'),
  ('b4a01f52-473d-57d7-97e7-24ef54faab9e', 'City Market Vendors Assoc', '+260-96-222-3333', 'City Market, Lusaka', 'Bulk', 'Cash on Delivery');

-- Products
insert into public.products (id, name, type, dosage_unit, withdrawal_days) values
  ('e7eca6fa-1917-5be8-a933-d71f7fafbdd7', 'Newcastle Disease Vaccine (Lasota)', 'Vaccine', 'ml/bird', 0),
  ('d7b88c0a-1af5-5ec1-bfeb-20168ace3352', 'Gumboro Vaccine (IBD)', 'Vaccine', 'ml/bird', 0),
  ('b9fcae06-91cd-527d-b3ba-f74b4f057076', 'Amoxicillin Oral Solution', 'Antibiotic', 'ml/L water', 7),
  ('3146cefd-e8b6-5ef9-a5fc-41f4cd379861', 'Multivitamin Booster', 'Supplement', 'ml/L water', 0);

-- Employees
insert into public.employees (id, name, position, contact_number, nrc, date_hired, salary_zmw, status) values
  ('8590bd6f-8f56-528a-81ec-bc881a343502', 'D. Chanda', 'Farm Manager', '+260-97-444-5555', '111111/10/1', '2024-03-01', 6500, 'Active'),
  ('c52440d4-9eee-5f61-8430-7c5f3e84558d', 'C. Banda', 'Entry Clerk', '+260-96-222-1111', '222222/10/1', '2025-02-10', 2800, 'Active'),
  ('fe7776d8-b8ae-5883-9a8b-e752e9ea8dc5', 'B. Tembo', 'Supervisor', '+260-95-333-2222', '333333/10/1', '2024-08-15', 4200, 'Active'),
  ('35ee5a7b-cd82-5a71-b744-f1b4568f73a7', 'E. Zulu', 'General Worker', '+260-97-666-7777', '444444/10/1', '2025-05-01', 2200, 'Active'),
  ('4ba4792e-0142-5bf0-9a68-c9d991b97d43', 'G. Tembo', 'General Worker', '+260-96-777-8888', '555555/10/1', '2025-06-20', 2200, 'Active');

-- Flocks (all Active first so transaction triggers accept historical rows; Closed applied at end)
insert into public.flocks (id, code, house_id, breed_id, supplier_id, placed_date, initial_bird_count, expected_dispatch_date, status) values
  ('1bb9b6cf-68a4-5f67-b05d-180311651abf', 'FLK-001', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', 'f43ca945-fc0c-5e27-993b-4c017b7d8fc5', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-05-20', 5000, '2026-07-01', 'Active'),
  ('b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'FLK-002', '51ab42c2-4d82-5260-89a5-94832a20b202', '7b55139d-f426-50c9-9ef1-c75caafdbe9a', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-06-25', 5000, '2026-08-06', 'Active'),
  ('16add6e3-6cac-52a2-9d73-ca5c868177fe', 'FLK-003', '5cd08494-410b-5da3-8c2a-2ed534c6a23e', 'f43ca945-fc0c-5e27-993b-4c017b7d8fc5', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-07-15', 4000, '2026-08-26', 'Active'),
  ('15f68c39-e28e-52ac-872d-ff2e032f0fda', 'FLK-004', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '49f35b88-8436-5ffb-875c-7fc769e907bb', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-08-01', 5000, '2026-09-12', 'Active');

-- Feed purchases
insert into public.feed_purchases (code, purchase_date, supplier_id, feed_type_id, number_of_bags, bag_weight_kg, unit_cost_per_bag, invoice_no, payment_method, is_active) values
  ('FPO-0001', '2026-05-21', '0c284e97-9090-5435-8d59-9bdf67f938ac', 'e689167d-50ce-5047-850f-a2a47dcbf83b', 64, 50, 625, '2300801', 'Bank Transfer', true),
  ('FPO-0002', '2026-05-29', '0c284e97-9090-5435-8d59-9bdf67f938ac', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', 207, 50, 590, '2300803', 'Bank Transfer', true),
  ('FPO-0003', '2026-06-02', '0c284e97-9090-5435-8d59-9bdf67f938ac', 'e689167d-50ce-5047-850f-a2a47dcbf83b', 43, 50, 625, '2300802', 'Bank Transfer', true),
  ('FPO-0004', '2026-06-10', '0c284e97-9090-5435-8d59-9bdf67f938ac', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', 138, 50, 590, '2300804', 'Bank Transfer', true),
  ('FPO-0005', '2026-06-14', '0c284e97-9090-5435-8d59-9bdf67f938ac', '2e920a97-1519-57ba-99c2-837c8b6ac99c', 255, 50, 560, '2300805', 'Bank Transfer', true),
  ('FPO-0006', '2026-06-26', '0c284e97-9090-5435-8d59-9bdf67f938ac', '2e920a97-1519-57ba-99c2-837c8b6ac99c', 170, 50, 560, '2300806', 'Bank Transfer', true);

-- Feed consumption
insert into public.feed_consumption (code, flock_id, feed_type_id, entry_date, kg_used, is_active) values
  ('FEED-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'e689167d-50ce-5047-850f-a2a47dcbf83b', '2026-05-24', 600, true),
  ('FEED-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'e689167d-50ce-5047-850f-a2a47dcbf83b', '2026-05-28', 800, true),
  ('FEED-0003', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-06-01', 1000, true),
  ('FEED-0004', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-06-05', 1200, true),
  ('FEED-0005', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-06-09', 1400, true),
  ('FEED-0006', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-06-13', 1600, true),
  ('FEED-0007', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-06-17', 1800, true),
  ('FEED-0008', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-06-21', 2000, true),
  ('FEED-0009', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-06-25', 2200, true),
  ('FEED-0010', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-06-29', 2400, true),
  ('FEED-0011', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'e689167d-50ce-5047-850f-a2a47dcbf83b', '2026-06-29', 720, true),
  ('FEED-0012', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'e689167d-50ce-5047-850f-a2a47dcbf83b', '2026-07-03', 960, true),
  ('FEED-0013', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-07-07', 1200, true),
  ('FEED-0014', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-07-11', 1440, true),
  ('FEED-0015', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-07-15', 1680, true),
  ('FEED-0016', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-07-19', 1920, true),
  ('FEED-0017', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-07-23', 2160, true),
  ('FEED-0018', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-07-27', 2400, true),
  ('FEED-0019', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-07-31', 2640, true),
  ('FEED-0020', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2e920a97-1519-57ba-99c2-837c8b6ac99c', '2026-08-04', 2880, true),
  ('FEED-0021', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'e689167d-50ce-5047-850f-a2a47dcbf83b', '2026-07-19', 408, true),
  ('FEED-0022', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'e689167d-50ce-5047-850f-a2a47dcbf83b', '2026-07-23', 544, true),
  ('FEED-0023', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-07-27', 680, true),
  ('FEED-0024', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-07-31', 816, true),
  ('FEED-0025', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-08-04', 952, true),
  ('FEED-0026', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '9c9ffb99-da75-5e11-9453-8a0588e0d05d', '2026-08-08', 1088, true),
  ('FEED-0027', '15f68c39-e28e-52ac-872d-ff2e032f0fda', 'e689167d-50ce-5047-850f-a2a47dcbf83b', '2026-08-05', 630, true);

-- Mortality
insert into public.mortality_entries (code, flock_id, entry_date, mortality_count, cause, is_active) values
  ('MORT-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-05-20', 8, 'Normal Culling', true),
  ('MORT-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-05-24', 7, 'Heat Stress', true),
  ('MORT-0003', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-05-28', 1, 'Disease', true),
  ('MORT-0004', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-01', 3, 'Normal Culling', true),
  ('MORT-0005', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-05', 2, 'Normal Culling', true),
  ('MORT-0006', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-09', 1, 'Heat Stress', true),
  ('MORT-0007', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-13', 2, 'Disease', true),
  ('MORT-0008', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-17', 1, 'Normal Culling', true),
  ('MORT-0009', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-21', 1, 'Normal Culling', true),
  ('MORT-0010', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-25', 2, 'Heat Stress', true),
  ('MORT-0011', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-29', 1, 'Disease', true),
  ('MORT-0012', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-06-25', 10, 'Normal Culling', true),
  ('MORT-0013', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-06-29', 8, 'Heat Stress', true),
  ('MORT-0014', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-03', 1, 'Disease', true),
  ('MORT-0015', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-07', 4, 'Normal Culling', true),
  ('MORT-0016', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-11', 2, 'Normal Culling', true),
  ('MORT-0017', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-15', 1, 'Heat Stress', true),
  ('MORT-0018', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-19', 2, 'Disease', true),
  ('MORT-0019', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-23', 1, 'Normal Culling', true),
  ('MORT-0020', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-27', 1, 'Normal Culling', true),
  ('MORT-0021', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-31', 2, 'Heat Stress', true),
  ('MORT-0022', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-08-04', 1, 'Disease', true),
  ('MORT-0023', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-07-15', 7, 'Normal Culling', true),
  ('MORT-0024', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-07-19', 6, 'Heat Stress', true),
  ('MORT-0025', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-07-23', 1, 'Disease', true),
  ('MORT-0026', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-07-27', 3, 'Normal Culling', true),
  ('MORT-0027', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-07-31', 2, 'Normal Culling', true),
  ('MORT-0028', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-08-04', 1, 'Heat Stress', true),
  ('MORT-0029', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-08-08', 2, 'Disease', true),
  ('MORT-0030', '15f68c39-e28e-52ac-872d-ff2e032f0fda', '2026-08-01', 8, 'Normal Culling', true),
  ('MORT-0031', '15f68c39-e28e-52ac-872d-ff2e032f0fda', '2026-08-05', 7, 'Heat Stress', true);

-- Weekly weights
insert into public.weekly_weights (code, flock_id, entry_date, week_no, sample_size, avg_body_weight_g, is_active) values
  ('WGT-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-05-27', 1, 50, 180, true),
  ('WGT-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-03', 2, 50, 430, true),
  ('WGT-0003', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-10', 3, 50, 800, true),
  ('WGT-0004', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-17', 4, 50, 1300, true),
  ('WGT-0005', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-06-24', 5, 50, 1850, true),
  ('WGT-0006', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '2026-07-01', 6, 50, 2400, true),
  ('WGT-0007', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-02', 1, 50, 180, true),
  ('WGT-0008', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-09', 2, 50, 430, true),
  ('WGT-0009', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-16', 3, 50, 800, true),
  ('WGT-0010', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-23', 4, 50, 1300, true),
  ('WGT-0011', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-07-30', 5, 50, 1850, true),
  ('WGT-0012', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '2026-08-06', 6, 50, 2400, true),
  ('WGT-0013', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-07-22', 1, 50, 180, true),
  ('WGT-0014', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-07-29', 2, 50, 430, true),
  ('WGT-0015', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '2026-08-05', 3, 50, 800, true),
  ('WGT-0016', '15f68c39-e28e-52ac-872d-ff2e032f0fda', '2026-08-08', 1, 50, 180, true);

-- Health
insert into public.health_entries (code, flock_id, product_id, entry_date, dosage_given, route, is_active) values
  ('HLTH-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', '2026-05-21', '1 drop/bird', 'Eye Drop', true),
  ('HLTH-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'd7b88c0a-1af5-5ec1-bfeb-20168ace3352', '2026-06-03', 'Per label / 1000 birds', 'Drinking Water', true),
  ('HLTH-0003', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '3146cefd-e8b6-5ef9-a5fc-41f4cd379861', '2026-05-22', '1 ml/L water', 'Drinking Water', true),
  ('HLTH-0004', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', '2026-06-26', '1 drop/bird', 'Eye Drop', true),
  ('HLTH-0005', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'd7b88c0a-1af5-5ec1-bfeb-20168ace3352', '2026-07-09', 'Per label / 1000 birds', 'Drinking Water', true),
  ('HLTH-0006', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'b9fcae06-91cd-527d-b3ba-f74b4f057076', '2026-07-15', '2 ml/L water x 5 days', 'Drinking Water', true),
  ('HLTH-0007', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '3146cefd-e8b6-5ef9-a5fc-41f4cd379861', '2026-06-27', '1 ml/L water', 'Drinking Water', true),
  ('HLTH-0008', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', '2026-07-16', '1 drop/bird', 'Eye Drop', true),
  ('HLTH-0009', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'd7b88c0a-1af5-5ec1-bfeb-20168ace3352', '2026-07-29', 'Per label / 1000 birds', 'Drinking Water', true),
  ('HLTH-0010', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '3146cefd-e8b6-5ef9-a5fc-41f4cd379861', '2026-07-17', '1 ml/L water', 'Drinking Water', true),
  ('HLTH-0011', '15f68c39-e28e-52ac-872d-ff2e032f0fda', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', '2026-08-02', '1 drop/bird', 'Eye Drop', true),
  ('HLTH-0012', '15f68c39-e28e-52ac-872d-ff2e032f0fda', '3146cefd-e8b6-5ef9-a5fc-41f4cd379861', '2026-08-03', '1 ml/L water', 'Drinking Water', true);

-- Medicine lots
insert into public.medicine_lots (code, flock_id, product_id, supplier_id, lot_number, expiry_date, quantity_received, quantity_used, unit_cost, is_active) values
  ('MED-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', 'MRK-2612', '2027-03-01', 600, 600, 0, true),
  ('MED-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'd7b88c0a-1af5-5ec1-bfeb-20168ace3352', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', 'NCD-2614', '2027-01-20', 500, 500, 1.2, true),
  ('MED-0003', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'b9fcae06-91cd-527d-b3ba-f74b4f057076', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', 'AMX-0091', '2026-12-15', 1000, 350, 0.85, true),
  ('MED-0004', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', 'MRK-2701', '2027-06-10', 600, 0, 0, true),
  ('MED-0005', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', 'MRK-2733', '2027-07-20', 500, 500, 0, true),
  ('MED-0006', '15f68c39-e28e-52ac-872d-ff2e032f0fda', 'e7eca6fa-1917-5be8-a933-d71f7fafbdd7', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', 'MRK-2801', '2027-08-15', 600, 600, 0, true);

-- Sales
insert into public.sales (code, flock_id, customer_id, entry_date, birds_dispatched, live_weight_kg, price_per_kg, price_per_bird, transport_cost, amount_paid, invoice_no, is_active) values
  ('SALE-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '18a2184a-c8fe-5906-9929-46556d21ade0', '2026-07-01', 3000, 6750, 42.5, 0, 350, 287225, 'INV-2026-0142', true),
  ('SALE-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'b4a01f52-473d-57d7-97e7-24ef54faab9e', '2026-07-01', 1950, 4387.5, 41, 0, 300, 150000, 'INV-2026-0143', true);

-- Expenses
insert into public.expenses (code, flock_id, supplier_id, entry_date, category, quantity, unit_cost, payment_method, payment_ref, approved_by, is_active) values
  ('EXP-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '1218763d-287d-5520-a2f3-667873667e07', '2026-05-19', 'Bedding/Litter', 1, 1800, 'Mobile Money', 'PMT-1001', 'A. Mwansa', true),
  ('EXP-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-05-20', 'Day-Old Chicks', 5000, 4.5, 'Bank Transfer', 'PMT-1002', 'A. Mwansa', true),
  ('EXP-0003', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', '2026-06-10', 'Veterinary', 1, 950, 'Cash', 'PMT-1005', 'B. Tembo', true),
  ('EXP-0004', '1bb9b6cf-68a4-5f67-b05d-180311651abf', NULL, '2026-06-28', 'Transport', 1, 1200, 'Cash', 'PMT-1009', 'A. Mwansa', true),
  ('EXP-0005', '1bb9b6cf-68a4-5f67-b05d-180311651abf', NULL, '2026-06-30', 'Labour', 1, 2400, 'Mobile Money', 'PMT-1010', 'A. Mwansa', true),
  ('EXP-0006', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '1218763d-287d-5520-a2f3-667873667e07', '2026-06-24', 'Bedding/Litter', 1, 1800, 'Mobile Money', 'PMT-1011', 'A. Mwansa', true),
  ('EXP-0007', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-06-25', 'Day-Old Chicks', 5000, 4.6, 'Bank Transfer', 'PMT-1012', 'A. Mwansa', true),
  ('EXP-0008', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'ebc3f02b-6982-5a74-8dbe-9c8045d8b71d', '2026-07-15', 'Veterinary', 1, 1100, 'Cash', 'PMT-1018', 'B. Tembo', true),
  ('EXP-0009', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', NULL, '2026-07-28', 'Labour', 1, 2400, 'Mobile Money', 'PMT-1024', 'A. Mwansa', true),
  ('EXP-0010', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '1218763d-287d-5520-a2f3-667873667e07', '2026-07-14', 'Bedding/Litter', 1, 1450, 'Cash', 'PMT-1026', 'A. Mwansa', true),
  ('EXP-0011', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-07-15', 'Day-Old Chicks', 4000, 4.5, 'Bank Transfer', 'PMT-1027', 'A. Mwansa', true),
  ('EXP-0012', '16add6e3-6cac-52a2-9d73-ca5c868177fe', NULL, '2026-08-01', 'Labour', 1, 2000, 'Mobile Money', 'PMT-1032', 'B. Tembo', true),
  ('EXP-0013', '15f68c39-e28e-52ac-872d-ff2e032f0fda', '1218763d-287d-5520-a2f3-667873667e07', '2026-07-31', 'Bedding/Litter', 1, 1800, 'Cash', 'PMT-1035', 'A. Mwansa', true),
  ('EXP-0014', '15f68c39-e28e-52ac-872d-ff2e032f0fda', 'f719fe71-4ff1-5500-87a0-90e60f399572', '2026-08-01', 'Day-Old Chicks', 5000, 4.5, 'Bank Transfer', 'PMT-1036', 'A. Mwansa', true),
  ('EXP-0015', NULL, NULL, '2026-08-01', 'Utilities', 1, 3200, 'Bank Transfer', 'PMT-1037', 'A. Mwansa', true);

-- Other income
insert into public.other_income (code, entry_date, source, description, amount, payment_method, received_by, is_active) values
  ('INC-0001', '2026-07-22', 'Manure Sales', 'Sold manure from House 1', 450, 'Cash', 'G. Tembo', true),
  ('INC-0002', '2026-08-01', 'Empty Bag Sales', 'Sold used feed bags', 120, 'Cash', 'G. Tembo', true),
  ('INC-0003', '2026-08-05', 'Manure Sales', 'Sold manure from House 2', 380, 'Mobile Money', 'G. Tembo', true);

-- Environment
insert into public.environment_readings (code, house_id, entry_date, reading_time, temperature_c, humidity_pct, ammonia_ppm, is_active) values
  ('ENV-0001', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-05-20', '07:00', 32, 62, 8, true),
  ('ENV-0002', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-05-25', '07:00', 31.2, 62, 8, true),
  ('ENV-0003', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-05-30', '07:00', 30.5, 62, 8, true),
  ('ENV-0004', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-06-04', '07:00', 29.8, 62, 8, true),
  ('ENV-0005', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-06-09', '07:00', 29, 62, 8, true),
  ('ENV-0006', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-06-14', '07:00', 28.2, 62, 8, true),
  ('ENV-0007', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-06-19', '07:00', 27.5, 62, 8, true),
  ('ENV-0008', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-06-24', '07:00', 26.8, 62, 8, true),
  ('ENV-0009', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-06-29', '07:00', 26, 62, 8, true),
  ('ENV-0010', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-06-25', '07:00', 32, 62, 8, true),
  ('ENV-0011', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-06-30', '07:00', 31.2, 62, 8, true),
  ('ENV-0012', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-07-05', '07:00', 30.5, 62, 8, true),
  ('ENV-0013', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-07-10', '07:00', 29.8, 62, 8, true),
  ('ENV-0014', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-07-15', '07:00', 29, 62, 8, true),
  ('ENV-0015', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-07-20', '07:00', 28.2, 62, 8, true),
  ('ENV-0016', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-07-25', '07:00', 27.5, 62, 8, true),
  ('ENV-0017', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-07-30', '07:00', 26.8, 62, 8, true),
  ('ENV-0018', '51ab42c2-4d82-5260-89a5-94832a20b202', '2026-08-04', '07:00', 26, 62, 8, true),
  ('ENV-0019', '5cd08494-410b-5da3-8c2a-2ed534c6a23e', '2026-07-15', '07:00', 32, 62, 8, true),
  ('ENV-0020', '5cd08494-410b-5da3-8c2a-2ed534c6a23e', '2026-07-20', '07:00', 31.2, 62, 8, true),
  ('ENV-0021', '5cd08494-410b-5da3-8c2a-2ed534c6a23e', '2026-07-25', '07:00', 30.5, 62, 8, true),
  ('ENV-0022', '5cd08494-410b-5da3-8c2a-2ed534c6a23e', '2026-07-30', '07:00', 29.8, 62, 8, true),
  ('ENV-0023', '5cd08494-410b-5da3-8c2a-2ed534c6a23e', '2026-08-04', '07:00', 29, 62, 8, true),
  ('ENV-0024', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-08-01', '07:00', 32, 62, 8, true),
  ('ENV-0025', 'dd5e189d-3b8c-5070-93ca-90cdd68cee40', '2026-08-06', '07:00', 31.2, 62, 8, true);

-- Daily routines
insert into public.daily_routines (code, flock_id, employee_id, entry_date, temperature_c, humidity_pct, water_available, feed_available, drinkers_cleaned, litter_condition, ventilation, sick_birds_observed, notes, is_active) values
  ('RTN-0001', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-05-20', 32, 62, 'Yes', 'Yes', 'No', 'Damp', 'Fair', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0002', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-05-23', 31.6, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0003', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-05-26', 31.1, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0004', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-05-29', 30.6, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0005', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-01', 30.2, 62, 'Yes', 'Yes', 'No', 'Dry', 'Good', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0006', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-04', 29.8, 60, 'Yes', 'Yes', 'Yes', 'Damp', 'Good', 0, 'All normal', true),
  ('RTN-0007', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-06-07', 29.3, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Fair', 0, 'All normal', true),
  ('RTN-0008', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-10', 28.9, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0009', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-13', 28.4, 62, 'Yes', 'Yes', 'No', 'Dry', 'Good', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0010', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-06-16', 27.9, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0011', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-19', 27.5, 62, 'Yes', 'Yes', 'Yes', 'Damp', 'Good', 0, 'All normal', true),
  ('RTN-0012', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-22', 27.1, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0013', '1bb9b6cf-68a4-5f67-b05d-180311651abf', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-06-25', 26.6, 62, 'Yes', 'Yes', 'No', 'Dry', 'Fair', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0014', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-28', 26.1, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0015', '1bb9b6cf-68a4-5f67-b05d-180311651abf', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-01', 25.7, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0016', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-06-25', 32, 62, 'Yes', 'Yes', 'No', 'Damp', 'Fair', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0017', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-06-28', 31.6, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0018', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-01', 31.1, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0019', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-07-04', 30.6, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0020', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-07', 30.2, 62, 'Yes', 'Yes', 'No', 'Dry', 'Good', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0021', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-10', 29.8, 60, 'Yes', 'Yes', 'Yes', 'Damp', 'Good', 0, 'All normal', true),
  ('RTN-0022', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-07-13', 29.3, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Fair', 0, 'All normal', true),
  ('RTN-0023', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-16', 28.9, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0024', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-19', 28.4, 62, 'Yes', 'Yes', 'No', 'Dry', 'Good', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0025', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-07-22', 27.9, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0026', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-25', 27.5, 62, 'Yes', 'Yes', 'Yes', 'Damp', 'Good', 0, 'All normal', true),
  ('RTN-0027', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-28', 27.1, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0028', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-07-31', 26.6, 62, 'Yes', 'Yes', 'No', 'Dry', 'Fair', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0029', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-08-03', 26.1, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0030', 'b9d1c764-2c99-5dfe-87bb-e4f152f755fc', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-08-06', 25.7, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0031', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-07-15', 32, 62, 'Yes', 'Yes', 'No', 'Damp', 'Fair', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0032', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-18', 31.6, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0033', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-21', 31.1, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0034', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-07-24', 30.6, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0035', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-27', 30.2, 62, 'Yes', 'Yes', 'No', 'Dry', 'Good', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0036', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-07-30', 29.8, 60, 'Yes', 'Yes', 'Yes', 'Damp', 'Good', 0, 'All normal', true),
  ('RTN-0037', '16add6e3-6cac-52a2-9d73-ca5c868177fe', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-08-02', 29.3, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Fair', 0, 'All normal', true),
  ('RTN-0038', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-08-05', 28.9, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0039', '16add6e3-6cac-52a2-9d73-ca5c868177fe', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-08-08', 28.4, 62, 'Yes', 'Yes', 'No', 'Dry', 'Good', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0040', '15f68c39-e28e-52ac-872d-ff2e032f0fda', 'c52440d4-9eee-5f61-8430-7c5f3e84558d', '2026-08-01', 32, 62, 'Yes', 'Yes', 'No', 'Damp', 'Fair', 1, 'Minor issue noted, resolved same day', true),
  ('RTN-0041', '15f68c39-e28e-52ac-872d-ff2e032f0fda', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-08-04', 31.6, 60, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true),
  ('RTN-0042', '15f68c39-e28e-52ac-872d-ff2e032f0fda', '35ee5a7b-cd82-5a71-b744-f1b4568f73a7', '2026-08-07', 31.1, 62, 'Yes', 'Yes', 'Yes', 'Dry', 'Good', 0, 'All normal', true);

-- Restore Closed status from Excel
update public.flocks set status = 'Closed' where code = 'FLK-001';

-- Align code counters with imported IDs

update public.entry_counters c set last_value = s.n
from (values
  ('FLK', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.flocks)),
  ('MORT', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.mortality_entries)),
  ('FEED', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.feed_consumption)),
  ('FPO', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.feed_purchases)),
  ('WGT', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.weekly_weights)),
  ('HLTH', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.health_entries)),
  ('SALE', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.sales)),
  ('EXP', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.expenses)),
  ('ENV', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.environment_readings)),
  ('INC', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.other_income)),
  ('RTN', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.daily_routines)),
  ('MED', (select coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 0) from public.medicine_lots))
) as s(prefix, n)
where c.prefix = s.prefix;

commit;