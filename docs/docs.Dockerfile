FROM rust:1.37-stretch AS builder

ENV MDBOOK_VERSION v0.3.1

RUN mkdir -p /usr/src/docs \
  && wget https://github.com/rust-lang-nursery/mdBook/releases/download/${MDBOOK_VERSION}/mdbook-${MDBOOK_VERSION}-x86_64-unknown-linux-gnu.tar.gz \
  && tar -C /usr/local/bin -xzvf mdbook-${MDBOOK_VERSION}-x86_64-unknown-linux-gnu.tar.gz \
  && rm mdbook-${MDBOOK_VERSION}-x86_64-unknown-linux-gnu.tar.gz

COPY . /usr/src/docs
COPY ./version.md /usr/src/docs/src

WORKDIR /usr/src/docs

RUN mdbook build

FROM nginx:1.17

LABEL maintainer "joshua.foster@stfc.ac.uk"

COPY --from=builder /usr/src/docs/book /usr/share/nginx/html
