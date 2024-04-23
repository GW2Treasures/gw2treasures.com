SELECT add_continuous_aggregate_policy('"PageView_daily"',
  start_offset => INTERVAL '1 month',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
