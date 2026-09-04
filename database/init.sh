#!/usr/bin/env bash
set -e
psql "$DATABASE_URL" -f schema.sql
psql "$DATABASE_URL" -f seed.sql
