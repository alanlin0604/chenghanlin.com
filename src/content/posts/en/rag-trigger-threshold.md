---
title: "Grounding an LLM with RAG: the hard part is deciding when to retrieve"
description: Retrieval stops a model inventing clinical advice. The harder question is when to retrieve at all — and the two ways of getting that threshold wrong cost very different things.
pubDatetime: 2026-08-15T10:00:00+08:00
tags:
  - rag
  - llm
---

In a mental-health context, letting a language model generate advice freely is
not acceptable. It will produce something that reads as professional, well
structured and warm, and that may be entirely invented. It is more dangerous
than obvious nonsense precisely because it is plausible.

Retrieval-augmented generation solves that: pull relevant passages from trusted
documents first, then require the model to answer only from what was retrieved.
That part is standard practice.

What took most of my thinking time was not RAG itself. It was a question that
looks much smaller: when should retrieval fire at all?

## Why not retrieve every time

The intuitive answer is to retrieve every time. That answer has three problems.

The first is cost. Every retrieval is a vector query, and it makes the prompt —
the text handed to the model — substantially longer. On a self-hosted GPU
inference service that is real latency and real compute.

The second is quality. A longer prompt is not a better answer. When someone
writes "a bit tired today", forcing three passages of WHO stress-management
guidance into the context produces a response in clinical language that does not
address what they wrote.

The third is trust, and it matters most. If the system cites psychological
literature in response to every ordinary complaint, users learn to skip that
section. A prompt that gets skipped is a prompt that does not exist.

That third point deserves stating plainly: in a system like this,
over-triggering is not the safer side. It is a different failure, one that just
fails more quietly. Not a missed signal — alerts so frequent that none of them carries weight.

## The two errors cost different things

Where the threshold sits is a trade between two errors.

Set it high, so retrieval fires easily, and the system reaches for clinical
documents at minor mood fluctuations. The cost is that it feels preachy, gets
ignored, and eventually gets turned off.

Set it low, so retrieval rarely fires, and entries that are written obliquely but
genuinely need catching slip past. The cost is a missed low patch that could
have been noticed.

These costs are asymmetric, but the asymmetry runs opposite to intuition. On
high-stress-day forecasting I deliberately pushed recall — the share of genuine
high-stress days the system catches — to 88%, accepting false alarms rather than
misses, because there the trade is one unnecessary nudge against one missed low
patch.

But on "should this cite clinical literature", the cost of over-triggering is not
one redundant nudge — it is the credibility of the whole feature. Tolerance for
"here we go again" is far lower than tolerance for occasional silence.

## Where I put it: −0.4

Sentiment scores run from −1 to +1, and the threshold ended up at −0.4. The full
path:

1. The user writes an entry
2. The model reads sentiment and returns a score
3. Scores below −0.4 trigger retrieval
4. The seven clinical documents (WHO, APA, NHS, NIMH) are indexed ahead of time
   as BGE-M3 embeddings — numeric representations of meaning — and ChromaDB
   returns the three passages closest to the entry
5. The model must generate feedback within what was retrieved

This puts clearly negative sentiment inside the trigger and ordinary daily
grumbling outside it.

## The part I have to be honest about

That number was judged, not measured.

I took real journal samples, looked at which category the entries at different
scores fell into, and picked a cut that looked reasonable. I ran no sensitivity analysis —
moving the threshold step by step and watching what changes — so I do not know
how much the false-trigger rate rises at −0.3, or how much would be missed at
−0.5.

That experiment would not have been expensive. I spent the time on features
instead, and that was a misjudgement. If I rebuilt this, quantifying the
threshold's effect would come early.

There is a more fundamental gap too: I never evaluated retrieval quality itself.

The entire value of RAG rests on the premise that the retrieved passages are
actually relevant, and I built no retrieval evaluation set and never measured
top-3 hit rate. A model citing a source is not the same as a model citing the
right source. It is the largest unverified assumption in the project.

## The transferable part

RAG tutorials usually stop at wiring retrieval into generation. In a real
product, deciding when *not* to retrieve matters as much as deciding how to
retrieve.

And the trigger condition is not a technical parameter — it is a product
decision, because it determines whether the user keeps reading your output at
all. That is not a question an embedding similarity score can answer.

The [full HeartBox case study](/en/projects/heartbox/) walks through six more
engineering decisions and what each one gave up.
