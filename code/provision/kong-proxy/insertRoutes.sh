# SSL certificates
curl -i -X POST http://localhost:8001/certificates \
    -F "cert=@/etc/ssl/certs/datalabs.pem" \
    -F "key=@/etc/ssl/private/datalabskey.pem" \
    -F "snis=datalab.datalabs.nerc.ac.uk,datalab-api.datalabs.nerc.ac.uk,datalab-docs.datalabs.nerc.ac.uk,datalab-minio.datalabs.nerc.ac.uk,datalab-jupyter.datalabs.nerc.ac.uk,datalab-zeppelin.datalabs.nerc.ac.uk,datalab-dask.datalabs.nerc.ac.uk"

# api - 32706
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-api' \
  --data 'hosts=datalab-api.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:32706' \
  --data 'https_only=true'

# app 31646
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-app' \
  --data 'hosts=datalab.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:31646' \
  --data 'https_only=true'

# docs - 32441
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-docs' \
  --data 'hosts=datalab-docs.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:32441' \
  --data 'https_only=true'

# jupyter - 30329
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-jupyter' \
  --data 'hosts=datalab-jupyter.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:30329' \
  --data 'preserve_host=true' \
  --data 'https_only=true'

# minio - 30994
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-minio' \
  --data 'hosts=datalab-minio.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:30994' \
  --data 'https_only=true'

# zeppelin - 32548
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-zeppelin' \
  --data 'hosts=datalab-zeppelin.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:32548' \
  --data 'https_only=true'

# dask - 32168
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-dask' \
  --data 'hosts=datalab-dask.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:32168' \
  --data 'https_only=true'

# zeppelin-connect - 31947
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-zeppelin-connect' \
  --data 'hosts=datalab-zeppelin.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:31947' \
  --data 'uris=/connect' \
  --data 'strip_uri=true' \
  --data 'https_only=true'

# minio-connect - 30463
curl -i -X POST \
  --url http://localhost:8001/apis \
  --data 'name=datalab-minio-connect' \
  --data 'hosts=datalab-minio.datalabs.nerc.ac.uk' \
  --data 'upstream_url=http://192.168.3.6:30463' \
  --data 'uris=/connect' \
  --data 'strip_uri=true' \
  --data 'https_only=true'
