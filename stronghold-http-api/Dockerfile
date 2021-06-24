FROM node:14.16.0 as build
ENV PATH="/root/.cargo/bin:${PATH}"

COPY ./ ./

RUN \
    apt-get update && \
    apt-get install rsync -y && \
    curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y && \
    ./stronghold-http-api/scripts/build.sh

FROM node:14.16.0
EXPOSE 8000:8000

WORKDIR /usr/src
COPY --from=build /stronghold-http-api/build.api/stronghold-http-api ./app

ENV NODE_ENV production
WORKDIR /usr/src/app
ENTRYPOINT ["yarn"]
CMD ["start"]
