#!/usr/bin/env bash

echo "REACT_APP_BASE_API_URL=$(terraform output base_url)" > frontend/.env