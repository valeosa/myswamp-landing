alter table emails
add column if not exists created_at timestamptz default now(),
add column if not exists confirmed_at timestamptz,
add column if not exists status text default 'pending',
add column if not exists confirmation_token text,
add column if not exists confirmation_sent_at timestamptz;

create unique index if not exists emails_email_unique
on emails (lower(email));

alter table emails
drop constraint if exists emails_status_check;

alter table emails
add constraint emails_status_check check (status in ('pending', 'confirmed'));

create unique index if not exists emails_confirmation_token_unique
on emails (confirmation_token)
where confirmation_token is not null;
