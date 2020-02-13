resource "openstack_blockstorage_volume_v2" "k8s_master_volume" {
  name        = "${var.cluster_name}-k8s-master-${count.index+1}-volume-1"
  count       = "var.number_of_k8s_masters
  description = "Volume for Kubernetes Master Volume ${count.index+1} (Ephemeral)"
  size        = 100
  metadata = {
    mount_point = "/data"
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "k8s_master_volume" {
  count       = var.number_of_k8s_masters
  instance_id = openstack_compute_instance_v2.rke_k8s_master.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.k8s_master_volume.*.id[count.index]
}

resource "openstack_blockstorage_volume_v2" "k8s_node_volume" {
  name        = "${var.cluster_name}-k8s-node-${count.index+1}-volume-1"
  count       = var.number_of_k8s_nodes
  description = "Volume for Kubernetes Volume ${count.index+1} (Ephemeral)"
  size        = 100
  metadata = {
    mount_point = "/data"
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "k8s_node_volume" {
  count       = var.number_of_k8s_nodes
  instance_id = openstack_compute_instance_v2.rke_k8s_node.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.k8s_node_volume.*.id[count.index]
}

resource "openstack_blockstorage_volume_v2" "gluster_node_volume" {
  name        = "${var.cluster_name}-glusterfs-node-${count.index+1}-volume-1"
  count       = "var.number_of_gluster_nodes
  description = "Volume for Gluster Node ${count.index+1} (Persistent)"
  size        = 100
  metadata = {
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "gluster_node_volume" {
  count       = var.number_of_gluster_nodes
  instance_id = openstack_compute_instance_v2.gluster_node.*.id[count.index]
  volume_id   = openstack_blockstorage_volume_v2.gluster_node_volume.*.id[count.index]
}