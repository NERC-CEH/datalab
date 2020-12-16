targetNamespace=devtest
tempDir='./tmp'
privateKeyFile=private_key.pem
publicKeyFile=public_key.pem

kubectl create secret generic mongo-password-secret -n $targetNamespace --from-literal secret=$MONGODB_ROOT_PASSWORD

# Create auth-signing-key secret
mkdir $tempDir
cd $tempDir
openssl genpkey -algorithm RSA -out $privateKeyFile -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in $privateKeyFile -out $publicKeyFile
kubectl create secret generic auth-signing-key -n $targetNamespace --from-file=private="$privateKeyFile" --from-file=public="$publicKeyFile"
cd -
rm -r $tempDir
