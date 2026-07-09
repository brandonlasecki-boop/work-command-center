-- Add WC360 cost governance work item statuses
ALTER TYPE work_item_status ADD VALUE IF NOT EXISTS 'waiting_on_vendor';
ALTER TYPE work_item_status ADD VALUE IF NOT EXISTS 'waiting_on_internal_owner';
