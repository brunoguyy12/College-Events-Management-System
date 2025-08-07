-- PostgreSQL function to auto-complete events
CREATE OR REPLACE FUNCTION auto_complete_events()
RETURNS TRIGGER AS $$
BEGIN
  -- Update events that have ended
  UPDATE "Event" 
  SET status = 'COMPLETED'
  WHERE status IN ('PUBLISHED', 'ONGOING') 
    AND "endDate" < NOW();
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger that runs on any event table change
CREATE TRIGGER auto_complete_trigger
  AFTER INSERT OR UPDATE ON "Event"
  FOR EACH STATEMENT
  EXECUTE FUNCTION auto_complete_events();
