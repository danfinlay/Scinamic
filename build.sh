#! /bin/bash

rm bundle.js && deno bundle src/index.ts >> bundle.js
