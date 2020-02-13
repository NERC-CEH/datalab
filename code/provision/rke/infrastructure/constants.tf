locals {
  ssh_user = "ubuntu"
  flavours = {        #|   RAM | Disk | VCPUs |
    j1_tiny   = 11    #|   512 |    4 |     1 |
    j1_small  = 12    #|  1024 |   10 |     2 |
    j1_medium = 13    #|  2048 |   16 |     4 |
    j2_medium = 14    #|  4096 |   16 |     4 |
    j3_medium = 15    #|  8192 |   16 |     4 |
    j1_large  = 16    #|  4096 |   16 |     8 |
    j2_large  = 17    #|  8192 |   16 |     8 |
    j3_large  = 18    #| 16348 |   16 |     8 |
    j4_large  = 19    #| 32768 |   16 |     8 |
  }
}