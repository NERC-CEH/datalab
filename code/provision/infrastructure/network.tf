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

resource "openstack_compute_secgroup_v2" "load_balancer" {
  name        = "${var.cluster_name}-load-balancer"
  description = "${var.cluster_name} - Load Balancer"

  rule {
    ip_protocol = "tcp"
    from_port   = "80"
    to_port     = "80"
    cidr        = "0.0.0.0/0"
  }

  rule {
    ip_protocol = "tcp"
    from_port   = "443"
    to_port     = "443"
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

resource "openstack_compute_secgroup_v2" "gluster" {
  name        = "${var.cluster_name}-gluster"
  description = "${var.cluster_name} - Gluster"

  # Ports from https://www.jamescoyle.net/how-to/457-glusterfs-firewall-rules
  rule {
    ip_protocol = "icmp"
    from_port   = "-1"
    to_port     = "-1"
    cidr        = "0.0.0.0/0"
  }

  rule {
    ip_protocol = "tcp"
    from_port   = "111"
    to_port     = "111"
    self        = true
  }

  # Gluster Daemon
  rule {
    ip_protocol = "tcp"
    from_port   = "24007"
    to_port     = "24008"
    self        = true
  }

  # Gluster Volume Ports (one per volume assigning recommended range)
  rule {
    ip_protocol = "tcp"
    from_port   = "49152"
    to_port     = "49251"
    self        = true
  }

  # Gluster NFS service (38465-38476)
  rule {
    ip_protocol = "tcp"
    from_port   = "38465"
    to_port     = "38467"
    self        = true
  }

  rule {
    ip_protocol = "udp"
    from_port   = "111"
    to_port     = "111"
    self        = true
  }

  rule {
    ip_protocol = "icmp"
    from_port   = "-1"
    to_port     = "-1"
    self        = true
  }
}

resource "openstack_compute_secgroup_v2" "discourse" {
  name        = "${var.cluster_name}-discourse"
  description = "${var.cluster_name} - Discourse"

  rule {
    ip_protocol = "tcp"
    from_port   = "80"
    to_port     = "80"
    cidr        = "0.0.0.0/0"
  }
}

resource "openstack_compute_floatingip_associate_v2" "bastion" {
  count       = "${var.number_of_bastions}"
  floating_ip = "${local.bastion_fips[count.index]}"
  instance_id = "${element(openstack_compute_instance_v2.bastion.*.id, count.index)}"
}

resource "openstack_compute_floatingip_associate_v2" "load_balancer" {
  floating_ip = "${local.load_balancer_fip}"
  instance_id = "${openstack_compute_instance_v2.load_balancer.id}"
}

#resource "openstack_compute_floatingip_associate_v2" "test_load_balancer" {
#  floating_ip = "${local.test_load_balancer_fip}"
#  instance_id = "${openstack_compute_instance_v2.test_load_balancer.id}"
#}
