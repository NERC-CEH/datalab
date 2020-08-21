#resource "openstack_blockstorage_volume_v2" "k8s_master_volume" {
#  name        = "${var.cluster_name}-k8s-master-${count.index+1}-volume-1"
#  count       = "${var.number_of_k8s_masters}"
#  description = "Volume for Kubernetes Master (Ephemeral)"
#  size        = 100
#  metadata = {
#    mount_point = "/data"
#    attached_mode = "rw"
#    readonly = "False"
#  }
#}
#
#resource "openstack_compute_volume_attach_v2" "k8s_master_volume" {
#  count       = 1
#  instance_id = openstack_compute_instance_v2.k8s_master.*.id[count.index]
#  volume_id   = openstack_blockstorage_volume_v2.k8s_master_volume.*.id[count.index]
#}
#
#resource "openstack_blockstorage_volume_v2" "k8s_node_volume" {
#  name        = "${var.cluster_name}-k8s-node-${count.index+1}-volume-1"
#  count       = var.number_of_k8s_nodes
#  description = "Volume for Kubernetes Volume ${count.index+1} (Ephemeral)"
#  size        = 100
#  metadata = {
#    mount_point = "/data"
#    attached_mode = "rw"
#    readonly = "False"
#  }
#}
#
#resource "openstack_compute_volume_attach_v2" "k8s_node_volume" {
#  count       = var.number_of_k8s_nodes
#  instance_id = openstack_compute_instance_v2.k8s_node.*.id[count.index]
#  volume_id   = openstack_blockstorage_volume_v2.k8s_node_volume.*.id[count.index]
#}
#
#resource "openstack_blockstorage_volume_v2" "k8s_node_volume_nov_2019" {
#  name        = "${var.cluster_name}-k8s-node-${count.index+4}-volume-1"
#  count       = var.number_of_k8s_nodes_nov_2019
#  description = "Volume for Kubernetes Volume ${count.index+4} (Ephemeral)"
#  size        = 200
#  metadata = {
#    mount_point = "/data"
#    attached_mode = "rw"
#    readonly = "False"
#  }
#}
#
#resource "openstack_compute_volume_attach_v2" "k8s_node_volume_nov_2019" {
#  count       = var.number_of_k8s_nodes_nov_2019
#  instance_id = openstack_compute_instance_v2.k8s_node_nov_2019.*.id[count.index]
#  volume_id   = openstack_blockstorage_volume_v2.k8s_node_volume_nov_2019.*.id[count.index]
#}
#
#resource "openstack_blockstorage_volume_v2" "k8s_node_swap_volume_nov_2019" {
#  name        = "${var.cluster_name}-k8s-node-${count.index+7}-volume-2"
#  count       = 1
#  description = "Volume for Kubernetes Volume ${count.index+8} (Ephemeral)"
#  size        = 32
#  metadata = {
#    mount_point = "/swap"
#    attached_mode = "rw"
#    readonly = "False"
#  }
#}
#
#resource "openstack_compute_volume_attach_v2" "k8s_node_swap_volume_nov_2019" {
#  count       = 1
#  instance_id = openstack_compute_instance_v2.k8s_node_nov_2019.*.id[3]
#  volume_id   = openstack_blockstorage_volume_v2.k8s_node_swap_volume_nov_2019.*.id[count.index]
#}
#
#resource "openstack_blockstorage_volume_v2" "gluster_node_volume" {
#  name        = "${var.cluster_name}-glusterfs-node-${count.index+1}-volume-1"
#  count       = var.number_of_gluster_nodes
#  description = "Volume for Gluster Node ${count.index+1} (Persistent)"
#  size        = 1000
#  metadata = {
#    attached_mode = "rw"
#    readonly = "False"
#  }
#}
#
#resource "openstack_compute_volume_attach_v2" "gluster_node_volume" {
#  count       = var.number_of_gluster_nodes
#  instance_id = openstack_compute_instance_v2.gluster_node.*.id[count.index]
#  volume_id   = openstack_blockstorage_volume_v2.gluster_node_volume.*.id[count.index]
#}
#
#resource "openstack_blockstorage_volume_v2" "gluster_node_volume_2" {
#  name        = "${var.cluster_name}-glusterfs-node-${count.index+1}-volume-2"
#  count       = "${var.number_of_gluster_nodes}"
#  description = "Volume 2 for Gluster Node ${count.index+1} (Persistent)"
#  size        = 2500
#  metadata = {
#    attached_mode = "rw"
#    readonly = "False"
#  }
#}
#
#resource "openstack_compute_volume_attach_v2" "gluster_node_volume_2" {
#  count       = "${var.number_of_gluster_nodes}"
#  instance_id = "${element(openstack_compute_instance_v2.gluster_node.*.id, count.index)}"
#  volume_id   = "${element(openstack_blockstorage_volume_v2.gluster_node_volume_2.*.id, count.index)}"
#}
#
resource "openstack_blockstorage_volume_v2" "rke_k8s_master_volume" {
  name        = "${var.cluster_name}-rke-k8s-master-${count.index+1}-volume-1"
  count       = "${var.number_of_rke_k8s_masters}"
  description = "Volume for Kubernetes Master (Ephemeral)"
  size        = 100
  metadata = {
    mount_point = "/data"
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "rke_k8s_master_volume" {
  count       = var.number_of_rke_k8s_masters
  instance_id = openstack_compute_instance_v2.rke_k8s_master.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.rke_k8s_master_volume.*.id[count.index]
}

resource "openstack_blockstorage_volume_v2" "rke_k8s_node_volume" {
  name        = "${var.cluster_name}-rke-k8s-node-${count.index+1}-volume-1"
  count       = var.number_of_rke_k8s_nodes
  description = "Volume for Kubernetes Volume ${count.index+1} (Ephemeral)"
  size        = 200
  metadata = {
    mount_point = "/data"
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "rke_k8s_node_volume" {
  count       = var.number_of_rke_k8s_nodes
  instance_id = openstack_compute_instance_v2.rke_k8s_node.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.rke_k8s_node_volume.*.id[count.index]
}


resource "openstack_blockstorage_volume_v2" "rke_k8s_node_volume_ext_1" {
  name        = "${var.cluster_name}-rke-k8s-node-${count.index+7}-volume-1"
  count       = 3
  description = "Volume for Kubernetes Volume ${count.index+1} (Ephemeral)"
  size        = 200
  metadata = {
    mount_point = "/data"
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "rke_k8s_node_volume_ext_1" {
  count       = 3
  instance_id = openstack_compute_instance_v2.rke_k8s_node_ext_1.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.rke_k8s_node_volume_ext_1.*.id[count.index]
}


resource "openstack_blockstorage_volume_v2" "rke_gluster_node_volume" {
  name        = "${var.cluster_name}-rke-glusterfs-node-${count.index+1}-volume-1"
  count       = var.number_of_rke_gluster_nodes
  description = "Volume for Gluster Node ${count.index+1} (Persistent)"
  size        = 1000
  metadata = {
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "rke_gluster_node_volume" {
  count       = var.number_of_rke_gluster_nodes
  instance_id = openstack_compute_instance_v2.rke_gluster_node.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.rke_gluster_node_volume.*.id[count.index]
}


resource "openstack_blockstorage_volume_v2" "rke_gluster_node_volume_2" {
  name        = "${var.cluster_name}-rke-glusterfs-node-${count.index+1}-volume-2"
  count       = var.number_of_rke_gluster_nodes
  description = "Volume 2 for Gluster Node ${count.index+1} (Persistent)"
  size        = 3000
  metadata = {
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "rke_gluster_node_volume_2" {
  count       = var.number_of_rke_gluster_nodes
  instance_id = openstack_compute_instance_v2.rke_gluster_node.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.rke_gluster_node_volume_2.*.id[count.index]
}
