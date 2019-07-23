variable "site" {
  type = string
  description = "The site name for the instances"
}

variable "openstack_keypair" {
  type = string
  description = "The keypair to be used."
}

variable "server_image" {
  type = string
  description = "The OpenStack server image name"
}

variable "tenant_network" {
  type = string
  description = "The OpenStack tenant network name"
}

variable "bastion_fips" {
  type = list(string)
  description = "Array of bastion IP addresses"
}

variable "terraform_fip" {
  type = string
  description = "Terraform state server IP address"
}

variable "test_load_balancer_fip" {
  type = string
  description = "Test Load Balancer IP address"
}

variable "load_balancer_fip" {
  type = string
  description = "Production Load Balancer IP address"
}

variable "cluster_name" {
  type = string
  default = "datalabs"
}

variable "number_of_bastions" {
  type = number
  default = 1
}

variable "number_of_k8s_nodes" {
  type = number
  default = 3
}

variable "number_of_gluster_nodes" {
  type = number
  default = 3
}

variable "flavor_bastion" {
  type = string
  description = "The bastion flavour"
  default     = "j1_tiny"
}

variable "flavor_load_balancer" {
  type = string
  description = "The load balancer flavour"
  default     = "j1_small"
}

variable "flavor_k8s_master" {
  type = string
  description = "The K8s master flavour"
  default     = "j2_medium"
}

variable "flavor_k8s_node" {
  type = string
  description = "The K8s worker flavour"
  default     = "j3.large"
}

variable "flavor_gluster_node" {
  type = string
  description = "The Gluster flavour"
  default     = "j2_medium"
}

variable "flavor_discourse" {
  type = string
  description = "The discourse flavour"
  default     = "j1_medium"
}
