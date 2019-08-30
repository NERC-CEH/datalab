# Code Climate

[Code climate](https://codeclimate.com/github/NERC-CEH/datalab) is used to track the code
quality in the data labs code base. Rule sets are applied for:

* ~~ESLint~~ (Currently assessed via TravisCI)
* CSS
* Markdown
* Code Duplication

## Run Code Climate locally

When resolving issues it can be useful to run code climate locally rather than have to
commit and push a branch. [Code climate CLI](https://github.com/codeclimate/codeclimate)
is shipped as a docker container so provided docker is installed it can be run with

```bash
docker run \
  --interactive --tty --rm \
  --env CODECLIMATE_CODE="$PWD" \
  --volume "$PWD":/code \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume /tmp/cc:/tmp/cc \
  codeclimate/codeclimate analyze
```
