# MindLenses Public Repository

Public distribution and community layer for MindLenses.

Website/app code is intentionally private.

## Purpose

This repo is not the hosting base for the website.

It exists for three public jobs:

1. Lens distribution via downloadable `.mindlens` files
2. Open format documentation and usage guides
3. Community-driven Lens requests via GitHub Issues

## Repository Structure

```text
mindlenses/
	lenses/          # downloadable .mindlens files
	docs/            # format docs and usage guides
	requests/        # issue workflow entry docs
	.github/
		ISSUE_TEMPLATE/
	CONTRIBUTING.md
	README.md
```

## Download Lenses

See `lenses/` for currently published files.

## Documentation

- `docs/what-is-a-mindlens.md`
- `docs/how-to-use.md`
- `docs/format-spec.md`
- `docs/contributing.md`

## Request a New Lens

Open a public issue:

- https://github.com/aaronpfuetzner/mindlenses/issues/new/choose

This enables transparent discussion, community signaling, and prioritization.

## Scope Boundary

What belongs in this public repo:

- consented and publishable `.mindlens` files
- format and usage documentation
- public request discussions

What does not belong here:

- private website or app source code
- intake/payment/business logic
- raw sensitive source material
- secrets, env files, infra credentials
- non-consented lens content

## Product Website

- https://mindlenses.app
