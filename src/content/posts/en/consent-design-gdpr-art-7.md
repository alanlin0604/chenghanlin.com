---
title: "Consent is not a checkbox: designing for highly sensitive data"
description: GDPR Art. 7 requires consent to be specific and freely given. The real bar is not more explanatory text — it is whether your product still works properly after someone refuses.
pubDatetime: 2026-08-15T11:00:00+08:00
tags:
  - privacy
  - compliance
---

Building a mood-journalling platform, the consent flow was the part I rewrote
most. Not because it was technically difficult — there is nothing technically
difficult about it — but because I started out treating it as a legal
requirement and only later understood it as a product design problem.

This is about one small-looking test that decides whether the whole thing holds.

## What the system collects

Worth scoping first, or the rest of the discussion drifts:

- Journal entries, meaning the raw text a user writes
- Sentiment scores and a stress index derived from them by the model
- Optional health data: steps, heart rate, HRV (heart-rate variability), sleep

The first item is the crux. A mood journal is among the most private writing a
person produces, and it differs from other sensitive data in one important way:
medical records can be de-identified, journals cannot. The details of a life,
written down, *are* identifying information.

## Why one checkbox is not enough

The common approach is a single terms-of-service document with one "I have read
and agree".

GDPR Art. 7 requires that consent be given for specific purposes and be capable
of being refused independently. Taiwan's Personal Data Protection Act, Art. 7,
imposes a comparable specific-purpose requirement. The product is Taiwanese;
both regimes point the same way on what consent means, and designing to the
stricter of the two costs nothing.

A single all-encompassing consent fails the first of those. The user agreed to
"use this service", but never separately agreed that "my journal entries may be
used to train a model". Those two things are different enough in kind that they
should not share a checkbox.

So it splits into three:

1. How data is used: what is collected, how it is stored, what is never done
2. Consent to AI model training, as its own question
3. Age confirmation, with a separate path for minors

## The real test: what happens after refusal

Splitting it in three is not the hard part. Most implementations stop there and
feel finished.

But separated consent whose refusal degrades functionality is not, in law,
freely given. When a user faces "agree or you cannot use this", what they are
doing is not consenting — it is accepting terms.

That single condition changes the design problem entirely. It means that if I
want that training data, I cannot use the product experience as leverage.

So the second step says so explicitly: choosing "do not agree" will not affect
your access to any feature. And this is not a form of words — there is no path
in the system that narrows because of that choice.

The decision has a real cost. Allowing refusal means deliberately giving up a
portion of otherwise-available training data, and the person building this
product happens to need Traditional Chinese mental-health text quite badly. That
cost is the price of the decision, and I think it is worth paying.

## Two-step verification for minors

Users aged 13 to 17 take an extra path: the system emails a confirmation link to
a parent or guardian, and AI features unlock once it is clicked.

There is a design choice here worth spelling out. What unlocks is the AI
features, not the service. While waiting for that confirmation, a minor can
still write entries and read their own history.

The reasoning is the same as the previous section: locking the whole product
turns "wait for a parent to click a link" into a wall that pushes people away,
and what actually needs protecting is a minor's journal entries being fed to a
model — not a minor writing journal entries.

## The conversion cost

Three steps instead of one click will lower signup conversion. That is true, and
I have not quantified by how much.

But this cost differs in kind from other product costs: it is the condition on
which the product can exist honestly. A system that asks users to hand over
their most private writing, and then cuts corners on consent, has not earned
belief in any of its other promises either.

## The transferable part

If only one thing is worth keeping: to judge whether separated consent is really
separated, do not count the checkboxes in the interface. Look at what is left
after a user refuses all of them.

If the product got harder to use, it was never separated consent. It was one
consent form cut into three pages.

The [full HeartBox case study](/en/projects/heartbox/) covers this decision and
six other engineering trade-offs, including what each one gave up.
