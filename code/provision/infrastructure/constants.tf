locals {
  server_image = "ubuntu-1604-20180518"
  tenant_network = "ceh-datalab-U-internal"
  ssh_user = "ubuntu"
  flavours = {        #|   RAM | Disk | VCPUs |
    j1_tiny   = 11    #|   512 |    4 |     1 |
    j1_small  = 12    #|  1024 |   10 |     2 |
    j1_medium = 13    #|  2048 |   16 |     4 |
    j2_medium = 14    #|  4096 |   16 |     4 |
    j3_medium = 15    #|  8192 |   16 |     4 |
    j1_large  = 16    #|  8192 |   16 |     8 |
    j2_large  = 17    #| 16384 |   32 |     8 |
  }

  bastion_fips           = ["192.171.139.245"]
  #test_load_balancer_fip = "192.171.139.197"
  load_balancer_fip      = "192.171.139.246"
  #spare_fip              = "192.171.139.187" //Not in use but assigned to us
}
