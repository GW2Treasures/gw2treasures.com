-- enable extension
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- create hypertable TradingPostHistory
SELECT create_hypertable('"TradingPostHistory"', by_range('time'), migrate_data => true, create_default_indexes => false);

-- enable compression
ALTER TABLE "TradingPostHistory" SET (timescaledb.compress, timescaledb.compress_orderby = 'time DESC', timescaledb.compress_segmentby = '"itemId"');

-- add compression policy
SELECT add_compression_policy('"TradingPostHistory"', INTERVAL '60d');
