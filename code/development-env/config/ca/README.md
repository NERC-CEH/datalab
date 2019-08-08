# Certificate Authority

## Generate CA root key

```bash
openssl genrsa -out ./config/ca/rootCA.key 2048
```

## Generate website tls certificate key

```bash
openssl genrsa -out ./config/ca/datalab.localhost.key 2048
```

## Create website certificate request

* Give user readable details for dev cert; `O`, `OU`.
* Give correct address for CN; `*.datalabs.localhost`.

```bash
openssl req -new -key ./config/ca/datalab.localhost.key -out ./config/ca/datalab.localhost.csr
```

## Add subject alternate name

Chrome expects valid certificates to have a correctly set `subjectAltName` field.

* Set `subjectAltName` to match the `CN` set above

```bash
cat <<EOF > ./config/ca/datalab.localhost.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName=DNS:*.datalabs.localhost
EOF
```

## Create website tls x509 certificate

```bash
openssl x509 -req -in ./config/ca/datalab.localhost.csr -CA ./config/ca/rootCA.pem -CAkey ./config/ca/rootCA.key -CAcreateserial -out ./config/ca/datalab.localhost.crt -days 500 -sha256 -extfile ./config/ca/datalab.localhost.ext
```

This certificate will need to added as a tls-secret in Kubernetes, this is outlined in the Minikube section.

## Make development CA root certificate trusted for host system (MacOS)

* Open `keychain access` and drag `rootCA.pem` file into window
* Double click the newly install DataLabs certificate and set trust to `Always Trust`
