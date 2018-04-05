resource "openstack_blockstorage_volume_v2" "k8s_master_volume" {
  name        = "${var.cluster_name}-k8s-master-${count.index+1}-volume-1"
  count       = "${var.number_of_k8s_masters}"
  description = "Volume for Kubernetes Master (Ephemeral)"
  size        = 100
  metadata = {
    mount_point = "/data"
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "k8s_master_volume" {
  count       = "${var.number_of_k8s_masters}"
  instance_id = "${element(openstack_compute_instance_v2.k8s_master.*.id, count.index)}"
  volume_id   = "${element(openstack_blockstorage_volume_v2.k8s_master_volume.*.id, count.index)}"
}

resource "openstack_blockstorage_volume_v2" "k8s_node_volume" {
  name        = "${var.cluster_name}-k8s-node-${count.index+1}-volume-1"
  count       = "${var.number_of_k8s_nodes}"
  description = "Volume for Kubernetes Volume ${count.index+1} (Ephemeral)"
  size        = 100
  metadata = {
    mount_point = "/data"
    attached_mode = "rw"
    readonly = "False"
  }
}

resource "openstack_compute_volume_attach_v2" "k8s_node_volume" {
  count       = "${var.number_of_k8s_nodes}"
  instance_id = "${element(openstack_compute_instance_v2.k8s_node.*.id, count.index)}"
  volume_id   = "${element(openstack_blockstorage_volume_v2.k8s_node_volume.*.id, count.index)}"
}
