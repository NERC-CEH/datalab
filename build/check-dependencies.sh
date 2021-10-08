#!/bin/bash
set -e
cd ./code && yarn audit --level=high --groups dependencies

