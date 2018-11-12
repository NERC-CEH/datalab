terraform {
  backend "http" {
    address = "http://<ip_address>/state/ceh-datalabs"
    lock_address = "http://<ip_address>/state/ceh-datalabs"
    unlock_address = "http://<ip_address>/state/ceh-datalabs"
    username = "username"
    password = "password"
  }
}

provider "openstack" {
  cloud = "jasmin"
  insecure = true
}
