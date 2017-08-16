# Bara

A tool to deploy to kubernetes from manifest templates. The tool merges deployment
templates with a configuration file and deploys to Kubernetes using `kubectl` with
the environment configuration for `KUBECONFIG`.

## Installation

The tools is developed as an NPM package and must be built and installed locally.

To build

```$bash
yarn install
npm pack
npm install bara-1.0.0.tgz -g
```

## Usage

The tool is self documenting so the best place to find the details of how to 
use flags is by running the tool.

```$bash
bara help
``` 

### Deploy a single template

```$bash
bara deploy -t <template_path> -c <config_path>
```

### Deploy a directory

```$bash
bara deploy -t <template_directory> -c <config_path>
```
