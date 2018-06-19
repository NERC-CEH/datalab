# Sealed Vault

When a Vault pod starts, it starts in a sealed state and has to be manually unlocked.
This is a security feature of Vault to ensure that secrets remain safe but is annoying if
the pod is resceduled.

> Note: This would be avoided if Vault has run HA as a pod would be able to rejoin
unsealed.

To unseal, the easiest way is to port forward a connection from a development machine.
The vault client should be on your path.

```bash
# Open a port-forward to the vault instance
kubectl port-forward <pod-name> 8201:8200 -n <namespace>
  
# Configure vault to connect
export VAULT_ADDR=http://localhost:8201
  
# Unseal the vault
vault unseal
  
# Supply first unseal key and then repeat to unseal the vault.
```

Unseal keys can be found with all other Datalabs passwords.