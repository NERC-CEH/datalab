# Development Certificate Authority

## Create CA root key

```bash
openssl genrsa -out rootCA.key 2048
```

## Create CA root certificate

- Give user readable details for root cert; `CN`, `O`, `OU`

```bash
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
```

## Create website tls key

```bash
openssl genrsa -out datalab.internal.key 2048
```

## Create website certificate request

- Give user readable details for dev cert; `O`, `OU`.
- Give correct address for CN; `*.datalabs.internal`.

```bash
openssl req -new -key datalab.internal.key -out datalab.internal.csr
```

## Add subject alternate name

Chrome expects valid certificates to have a correctly set `subjectAltName` field.

- Set `subjectAltName` to match the `CN` set above

```bash
cat <<EOF > datalab.internal.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName=DNS:*.datalabs.internal
EOF
```

## Create website tls certificate

```bash
openssl x509 -req -in datalab.internal.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out datalab.internal.crt -days 500 -sha256 -extfile datalab.internal.ext
```

## Create Kubernetes secret for certificates

- Create secret for website certificate
- This secret must be created __before__ add ingress rules

```bash
kubectl create secret tls tls-secret --key datalab.internal.key --cert datalab.internal.crt -n devtest
```

## Make development CA root certificate trusted for host system

### MacOS

- Open `keychain access` and drag `rootCA.pem` file into window
- Double click the newly install DataLabs certificate and set trust to `Always Trust`

## Running node with self-signed certificates

- Start APP/API in insecure mode

`NODE_TLS_REJECT_UNAUTHORIZED=0 yarn start`
