-- Add migration-specific work item statuses
ALTER TYPE work_item_status ADD VALUE IF NOT EXISTS 'waiting_on_approval';
ALTER TYPE work_item_status ADD VALUE IF NOT EXISTS 'waiting_on_carrier';
ALTER TYPE work_item_status ADD VALUE IF NOT EXISTS 'waiting_on_spruce';
