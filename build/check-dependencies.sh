#!/bin/bash

EXIT_INFO=1; 
EXIT_LOW=2; 
EXIT_MODERATE=4; 
EXIT_HIGH=8; 
EXIT_CRITICAL=16; 

SEVERITY=$EXIT_HIGH

(cd ./code && yarn audit --level=high --groups dependencies)
t1=$?
echo "Yarn audit result $t1"
if [ $t1 -ge $SEVERITY ]; then
  echo "Failed audit check";
  exit 1;
fi

exit 0;