create policy "Authenticated users can insert their own activities" on public.activities for insert
to authenticated with check (auth.uid() = user_id);
