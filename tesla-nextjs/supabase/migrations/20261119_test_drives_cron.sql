-- 30 минутын дотор төлөөгүй туршилтын жолоодлогыг 5 минут тутам цуцалж, цагийг чөлөөлнө.
-- Supabase → SQL Editor дээр, test_drives.sql-ийн ДАРАА нэг удаа ажиллуулна.
--
-- ⚠ Доорх <CRON_SECRET>-ийг Vercel-д оруулсан CRON_SECRET-тэй ЯГ ижил утгаар солино.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Дахин ажиллуулбал хуучныг нь солино
select cron.unschedule('expire-test-drives')
where exists (select 1 from cron.job where jobname = 'expire-test-drives');

select cron.schedule(
  'expire-test-drives',
  '*/5 * * * *',
  $$
  select net.http_get(
    url := 'https://teslarelumee5-seven.vercel.app/api/test-drive/expire',
    headers := jsonb_build_object('Authorization', 'Bearer <CRON_SECRET>')
  );
  $$
);
