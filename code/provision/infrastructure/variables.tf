variable "openstack_keypair" {
    description = "The keypair to be used."
    default  = "llogr-c9834a39ddef2dd489d7bd976d0ac79c"
}

variable "cluster_name" {
  default = "test-cluster"
}

variable "number_of_bastions" {
  default = 1
}

variable "number_of_k8s_masters" {
  default = 1
}

variable "number_of_k8s_nodes" {
  default = 3
}

variable "flavor_bastion" {
  description = "The bastion flavour"
  default     = 11
}

variable "flavor_load_balancer" {
  description = "The load balancer flavour"
  default     = 12
}

variable "flavor_k8s_master" {
  description = "The bastion flavour"
  default     = 14
}

variable "flavor_k8s_node" {
  description = "The bastion flavour"
  default     = 15
}