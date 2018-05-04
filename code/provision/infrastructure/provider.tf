terraform {
  backend "http" {
    address = "http://<ip_address>/state/datalabs"
    lock_address = "http://<ip_address>/state/datalabs"
    unlock_address = "http://<ip_address>/state/datalabs"
    username = "username"
    password = "password"
  }
}

provider "openstack" {
  cloud = "jasmin"
  insecure = true
}
