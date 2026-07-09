-- Seed default companies for Work Command Center
-- Remove placeholder/demo companies from early setup
DELETE FROM companies
WHERE name IN ('Acme Corp', 'Stellar Labs', 'JXH Billing', 'Apex Creatives', 'Personal Admin');

INSERT INTO companies (name, color, description)
SELECT v.name, v.color, v.description
FROM (
  VALUES
    ('360 Medical', '#00A3FF', 'Medical technology and automation'),
    ('WoundCare 360', '#A855F7', 'Wound care solutions and operations'),
    ('BCMD', '#F97316', 'Billing and practice management'),
    ('OAF Nation', '#22C55E', 'Media, content, and community')
) AS v(name, color, description)
WHERE NOT EXISTS (
  SELECT 1 FROM companies c WHERE c.name = v.name
);
