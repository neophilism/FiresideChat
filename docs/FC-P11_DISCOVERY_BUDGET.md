# FC-P11 transcript discovery batch limits

Recovery inputs are now parsed as complete decimal integers with conservative
per-run ceilings: 500 publisher episodes, 100 page-discovery episodes, 10
attempts and 5 concurrent work items. Malformed, fractional, negative, zero,
oversized or suffix-bearing environment and caller values fall back to
conservative defaults instead of exhausting queues or bypassing retry budgets.

This is bounded operational protection only; it does not prove episode page
transcripts were discovered, or license automatic transcript generation.
Trusted provider fetch and media rights review, deduplicated recovery,
full performance acceptance and actual source evidence remain pending.
