variable "openstack_keypair" {
    description = "The keypair to be used."
    default  = "olaawe-d20a3d59-9433-4b79-8726-20b431d89c78"
}

variable "cluster_name" {
  default = "ceh-datalabs"
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

variable "number_of_gluster_nodes" {
  default = 4
}

variable "flavor_bastion" {
  description = "The bastion flavour"
  default     = "j1_tiny"
}

variable "flavor_load_balancer" {
  description = "The load balancer flavour"
  default     = "j1_small"
}

variable "flavor_k8s_master" {
  description = "The K8s master flavour"
  default     = "j2_medium"
}

variable "flavor_k8s_node" {
  description = "The K8s worker flavour"
  default     = "j2.large"
}

variable "flavor_gluster_node" {
  description = "The Gluster flavour"
  default     = "j2_medium"
}

variable "flavor_discourse" {
  description = "The discourse flavour"
  default     = "j1_medium"
}
