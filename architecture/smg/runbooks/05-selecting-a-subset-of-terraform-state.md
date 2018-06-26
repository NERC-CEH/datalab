# Selecting a subset of Terraform state

Terraform allows the targeting of specific resources for the `plan` and `apply`
stages, this permits the rebuilding of selected components in isolation. This
has been of particular use when the Terraform state has been lost.

``` bash
terraform plan -target=openstack_compute_instance_v2.k8s_node
terraform plan -target=openstack_compute_volume_attach_v2.k8s_node_volume
```

Components of the Terraform managed resources can be marked for rebuild using
the `taint` command. This command can only be run on a named single component
rather than a entire resource group.

```bash
terraform taint openstack_compute_instance_v2.k8s_node.1
```
