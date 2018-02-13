# Create CA root key
openssl genrsa -out rootCA.key 2048

# Create CA root certificate
# Give user readable details for root cert; CN, O, OU
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem

# Create website tls key
openssl genrsa -out datalab.local.key 2048

# Create website certificate request
# Give user readable details for dev cert; O, OU
# Give correct address for CN; *.datalabs.local
openssl req -new -key datalab.local.key -out datalab.local.csr

# Valid certificates must have subjectAltName
# Set this to match the CN
cat <<EOF > datalab.local.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName=DNS:*.datalabs.local
EOF

# Create website tls certificate
openssl x509 -req -in datalab.local.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out datalab.local.crt -days 500 -sha256 -extfile datalab.local.ext 

# Install ssl certificate to web browser

# Start APP/API in insecure mode
NODE_TLS_REJECT_UNAUTHORIZED=0 yarn start

