resource "openstack_compute_secgroup_v2" "k8s_master" {
  name        = "${var.cluster_name}-k8s-master"
  description = "${var.cluster_name} - Kubernetes Master"

  rule {
    ip_protocol = "tcp"
    from_port   = "6443"
    to_port     = "6443"
    cidr        = "0.0.0.0/0"
  }
}

resource "openstack_compute_secgroup_v2" "bastion" {
  name        = "${var.cluster_name}-bastion"
  description = "${var.cluster_name} - Bastion Server"

  rule {
    ip_protocol = "tcp"
    from_port   = "22"
    to_port     = "22"
    cidr        = "0.0.0.0/0"
  }
}

resource "openstack_compute_secgroup_v2" "k8s" {
  name        = "${var.cluster_name}-k8s"
  description = "${var.cluster_name} - Kubernetes"

  rule {
    ip_protocol = "icmp"
    from_port   = "-1"
    to_port     = "-1"
    cidr        = "0.0.0.0/0"
  }

  rule {
    ip_protocol = "tcp"
    from_port   = "1"
    to_port     = "65535"
    self        = true
  }

  rule {
    ip_protocol = "udp"
    from_port   = "1"
    to_port     = "65535"
    self        = true
  }

  rule {
    ip_protocol = "icmp"
    from_port   = "-1"
    to_port     = "-1"
    self        = true
  }
}

resource "openstack_compute_instance_v2" "bastion" {
  name       = "${var.cluster_name}-bastion-${count.index+1}"
  count      = "${var.number_of_bastions}"
  image_name = "${local.server_image}"
  flavor_id  = "${var.flavor_bastion}"
  key_pair   = "${var.openstack_keypair}"

  network {
    name = "${local.tenant_network}"
  }

  security_groups = ["${openstack_compute_secgroup_v2.k8s.name}",
    "${openstack_compute_secgroup_v2.bastion.name}",
    "default",
  ]

  metadata = {
    ssh_user         = "${local.ssh_user}"
    kubespray_groups = "bastion"
    depends_on       = "${local.tenant_network}"
  }

  provisioner "local-exec" {
    command = "sed s/USER/${local.ssh_user}/ ansible_bastion_template.txt | sed s/BASTION_ADDRESS/${local.bastion_fips[0]}/ > group_vars/no-floating.yml"
  }

}

resource "openstack_compute_instance_v2" "k8s_master" {
  name       = "${var.cluster_name}-k8s-master-${count.index+1}"
  count      = "${var.number_of_k8s_masters}"
  image_name = "${local.server_image}"
  flavor_id  = "${var.flavor_k8s_master}"
  key_pair   = "${var.openstack_keypair}"

  network {
    name = "${local.tenant_network}"
  }

  security_groups = ["${openstack_compute_secgroup_v2.k8s_master.name}",
    "${openstack_compute_secgroup_v2.k8s.name}",
    "default",
  ]

  metadata = {
    ssh_user         = "${local.ssh_user}"
    kubespray_groups = "etcd,kube-master,k8s-cluster,vault,no-floating"
    depends_on       = "${local.tenant_network}"
  }

}

resource "openstack_compute_instance_v2" "k8s_node" {
  name       = "${var.cluster_name}-k8s-node-${count.index+1}"
  count      = "${var.number_of_k8s_nodes}"
  image_name = "${local.server_image}"
  flavor_id  = "${var.flavor_k8s_node}"
  key_pair   = "${var.openstack_keypair}"

  network {
    name = "${local.tenant_network}"
  }

  security_groups = ["${openstack_compute_secgroup_v2.k8s.name}",
    "default",
  ]

  metadata = {
    ssh_user         = "${local.ssh_user}"
    kubespray_groups = "kube-node,k8s-cluster,no-floating"
    depends_on       = "${local.tenant_network}"
  }

}

resource "openstack_compute_floatingip_associate_v2" "bastion" {
  count       = "${var.number_of_bastions}"
  floating_ip = "${local.bastion_fips[count.index]}"
  instance_id = "${element(openstack_compute_instance_v2.bastion.*.id, count.index)}"
}

# resource "openstack_compute_floatingip_associate_v2" "k8s_master" {
#   count       = "${var.number_of_k8s_masters}"
#   instance_id = "${element(openstack_compute_instance_v2.k8s_master.*.id, count.index)}"
#   floating_ip = "${var.k8s_master_fips[count.index]}"
# }

# resource "openstack_compute_floatingip_associate_v2" "k8s_node" {
#   count       = "${var.number_of_k8s_nodes}"
#   floating_ip = "${var.k8s_node_fips[count.index]}"
#   instance_id = "${element(openstack_compute_instance_v2.k8s_node.*.id, count.index)}"
# }

# resource "openstack_blockstorage_volume_v2" "glusterfs_volume" {
#   name        = "${var.cluster_name}-glusterfs_volume-${count.index+1}"
#   count       = "${var.number_of_gfs_nodes_no_floating_ip}"
#   description = "Non-ephemeral volume for GlusterFS"
#   size        = "${var.gfs_volume_size_in_gb}"
# }

# resource "openstack_compute_instance_v2" "glusterfs_node_no_floating_ip" {
#   name       = "${var.cluster_name}-gfs-node-nf-${count.index+1}"
#   count      = "${var.number_of_gfs_nodes_no_floating_ip}"
#   image_name = "${var.image_gfs}"
#   flavor_id  = "${var.flavor_gfs_node}"
#   key_pair   = "${openstack_compute_keypair_v2.k8s.name}"

#   network {
#     name = "${var.network_name}"
#   }

#   security_groups = ["${openstack_compute_secgroup_v2.k8s.name}",
#     "default",
#   ]

#   metadata = {
#     ssh_user         = "${var.ssh_user_gfs}"
#     kubespray_groups = "gfs-cluster,network-storage,no-floating"
#     depends_on       = "${var.network_id}"
#   }

# }

# resource "openstack_compute_volume_attach_v2" "glusterfs_volume" {
#   count       = "${var.number_of_gfs_nodes_no_floating_ip}"
#   instance_id = "${element(openstack_compute_instance_v2.glusterfs_node_no_floating_ip.*.id, count.index)}"
#   volume_id   = "${element(openstack_blockstorage_volume_v2.glusterfs_volume.*.id, count.index)}"
# }
