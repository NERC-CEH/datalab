# Unable to join Kubernetes Node

Error seen while trying to rebuild Kubernetes Cluster Nodes a period of time after the
original cluster was created.

```bash
fatal: [datalabs-k8s-node-3]: FAILED! => {"changed": true, "cmd": ["kubeadm", "join", "--discovery-token-unsafe-skip-ca-verification", "--token=", "192.168.3.95:6443"], "delta": "0:00:00.272117", "end": "2018-06-25 16:09:55.257574", "msg": "non-zero return code", "rc": 3, "start": "2018-06-25 16:09:54.985457", "stderr": "\t[WARNING FileExisting-crictl]: crictl not found in system path\n[discovery: Invalid value: \"\": DiscoveryToken or DiscoveryFile must be set, discovery: Invalid value: \"\": token [\"\"] was not of form [\"^([a-z0-9]{6})\\\\.([a-z0-9]{16})$\"], discovery: Invalid value: \"\": token must be of form '[a-z0-9]{6}.[a-z0-9]{16}']", "stderr_lines": ["\t[WARNING FileExisting-crictl]: crictl not found in system path", "[discovery: Invalid value: \"\": DiscoveryToken or DiscoveryFile must be set, discovery: Invalid value: \"\": token [\"\"] was not of form [\"^([a-z0-9]{6})\\\\.([a-z0-9]{16})$\"], discovery: Invalid value: \"\": token must be of form '[a-z0-9]{6}.[a-z0-9]{16}']"], "stdout": "[preflight] Running pre-flight checks.", "stdout_lines": ["[preflight] Running pre-flight checks."]}
```

The error is due to the fact that Kubernetes cluster join tokens are issued with a TTL
and the original token has expired.

Tokens can be viewed by logging on to the `k8s-master` node and executing:

```bash
sudo kubeadm token list
```

It is likely that the list is empty if you are facing this issue and it is possible to
issue a token using:

```bash
sudo kubeadm token create
```

This issue should have been resolved by the `kubernetes` role being updated to always
create a new token before trying to join new nodes.