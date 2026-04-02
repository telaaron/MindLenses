# MindLens Format Specification (v1)

Status: Draft standard

## File Extension

- `.mindlens`

## Encoding

- UTF-8 text

## Canonical Structure

A MindLens SHOULD follow this top-level structure:

```text
# <Expert Name> - MindLens

## Metadata
- id: <slug>
- version: <semver>
- language: <BCP-47 or short code>
- source_policy: public_sources_only
- consent_status: consented | public-domain | licensed
- generated_at: <ISO 8601>

## Cognitive Fingerprint
- worldview
- decision rules
- rhetorical patterns
- preferred metaphors
- anti-patterns

## Core Principles
- principle entries

## Frameworks
- named frameworks with steps

## Response Style Contract
- voice
- tone
- sentence rhythm
- do/don't list

## Domain Knowledge
- distilled insights

## Usage Prompt
- ready-to-paste prompt snippet

## Provenance
- source categories
- citation policy
```

## Required Fields

A valid `.mindlens` file MUST include:

- title line (`# ... - MindLens`)
- identifiable expert id or name
- version signal
- usage instructions
- provenance block

## Legal and Compliance Requirements

A distributable lens MUST satisfy all of the following:

- no private or confidential sources
- no disallowed copyrighted full-text dumps when redistribution is not permitted
- only consented, public-domain, or properly licensed source usage
- clear provenance and rights posture

## Compatibility Goal

The format targets AI-chat attachment workflows first.

Future versions may add machine-readable sidecar metadata (for example `.json`) while preserving backward compatibility for plain text attachments.
