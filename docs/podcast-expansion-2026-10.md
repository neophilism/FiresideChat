# October 2026: congressional and presidential podcast coverage expansion

This tranche adds 11 previously absent eligible officials and 12 distinct podcast feeds: Ron Paul, Matt Gaetz (two different programs), Adam Kinzinger, Heidi Heitkamp, Jon Tester, Hillary Clinton, Bill Clinton, Tulsi Gabbard, Joe Scarborough, Sean Duffy, and Sherrod Brown.

Source and canonical-feed verification notes for each entry appear in `src/data/podcast-registry.ts`. Each is a show-specific feed, rather than a mixed network feed with episodes that should not be assigned to the official. Publishing status is separate from ingestion status so ended programs remain eligible for historical archiving.

## Remaining identified candidates

Claire McCaskill (shared RSS), Peter Roskam (shared RSS), Cori Bush/Jamaal Bowman (video/audio feed discovery), Paul Hodes (host-date restrictions), Jon Porter, Patrick J. Murphy, Denver Riggleman, and existing candidates (Mike Levin, Bernie Sanders' second series, Lisa Murkowski, Barack Obama's *Renegades*, Andy Biggs, Jeff Crank). The registry records precise reasons each awaits reliable automated ingestion.

## Production application and verification

Once merged, `npm run registry:validate`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` must pass. The application's production startup seeds the registry automatically; a deployment or run of `npm run db:seed` adds the 12 shows to PostgreSQL. Then run `npm run sync:archive` to load their episodes and inspect `/admin` and `npm run archive:status` for failed feed requests. An RSS address being present in the registry is not evidence of successful live ingestion. If an individual feed is unavailable, correct that feed and preserve its public source provenance.

## Longer-term completeness

The current-member census is not an exhaustive list of former members; expand discovery against a historical congressional roster (Biographical Directory + presidents) with cross-references to podcast directories. Preserve show history, verify individual hosting relationships, and distinguish historical programs, multi-show people, and guest-only appearances. Never attach a general news/feed podcast to a person if the feed includes episodes the person did not host; add host-date/show filters first.
