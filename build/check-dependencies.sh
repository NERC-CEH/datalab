#!/bin/bash
set -e
cd ./docs && yarn audit --level=high --groups dependencies
