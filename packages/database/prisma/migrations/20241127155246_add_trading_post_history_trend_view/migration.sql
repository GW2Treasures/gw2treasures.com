CREATE VIEW "TradingPostHistory_Trend" AS
  SELECT * FROM "TradingPostHistory" WHERE time > NOW() - INTERVAL '7 day';
