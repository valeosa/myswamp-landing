alter table emails
add column if not exists confirmation_token_hash text;

create unique index if not exists emails_confirmation_token_hash_unique
on emails (confirmation_token_hash)
where confirmation_token_hash is not null;
