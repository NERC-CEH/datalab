terraform {
  backend "http" {
    address = "http://<ip_address>/state/cehsos"
    lock_address = "http://<ip_address>/state/cehsos"
    unlock_address = "http://<ip_address>/state/cehsos"
    username = "username"
    password = "password"
  }
}

provider "openstack" {
  cloud = "jasmin"
  insecure = true
}
