# Live Cal.com booking (how the agent books on a call)

The agent books real appointments by calling Cal.com tools that ElevenLabs creates
when you connect the Cal.com integration. It books into Cal.com, which syncs to the
owner's Google Calendar.

## One-time setup (dashboard)

1. ElevenLabs → the agent → **Tools** → add the **Cal.com** integration, connect your
   Cal.com account (paste your Cal.com API key). This creates 6 tools in the workspace:
   `calcom_get_available_slots`, `calcom_create_booking`, `calcom_find_bookings_by_attendee`,
   `calcom_get_booking`, `calcom_get_all_bookings`, `calcom_cancel_booking`.
2. Attach those tools to the agent (they show up in the agent's tool list).
3. Find your event type's numeric id: Cal.com → **Event Types** → the event → the URL is
   `app.cal.com/event-types/<ID>?...`. Put that `<ID>` in `config.json` (`calcom.event_type_id`)
   and in `system-prompt.md` wherever it says `eventTypeId`.

## The flow (encoded in system-prompt.md)

1. Collect a full lead record in conversation (name, business, **email**, phone, city/state,
   what they want, reason).
2. `calcom_get_available_slots` with the event id → real open times → offer 2-3.
3. `calcom_create_booking` with:
   - `eventTypeId` = your event id
   - `start` = the EXACT ISO timestamp returned by the slots tool (never invented)
   - `attendee` = `{ name, email, phoneNumber, timeZone }`
   - `bookingFieldsResponses` = a `notes` summary (business, city, product, reason, website)
     so the extra context lands on the calendar event
4. Read the time back to confirm.

## Where the data lands

- **The booking** → Cal.com → the owner's Google Calendar (with the notes summary).
- **The full record** → ElevenLabs **Data Collection** (see `config.json`), captured on every
  call and visible per-conversation in the dashboard / queryable via the API. Add a post-call
  webhook in ElevenLabs settings to push it to a sheet / CRM / Supabase if you want.

## Gotchas

- `eventTypeId` MUST be provided (prompt or tool constant); the tool refuses to guess it.
- Editing the agent in the **dashboard can overwrite** API-set prompt changes. Re-run
  `setup.mjs` after dashboard edits if needed.
- English agents are limited to `turbo` / `flash v2` / `v3_conversational` TTS models.
