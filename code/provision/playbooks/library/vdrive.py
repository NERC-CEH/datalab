#!/usr/bin/python

DOCUMENTATION = '''
---
module: vdrive
short_description: create a volume in a vcloud environment
description:
  - Create a volume in a vcloud environment
version_added: "2.0"
options:
    volume_info:
      description:
        - The volumes to create
      required: true
      default: None
    size:
      description:
        - The size of the volume in GB
      required: true
      default: None
    username:
      description:
        - The vca username or email address, if not set the environment variable VCA_USER is checked for the username.
      required: false
      default: None
    password:
      description:
        - The vca password, if not set the environment variable VCA_PASS is checked for the password
      required: false
      default: None
    org:
      description:
        - The org to login to for creating vapp, mostly set when the service_type is vdc.
      required: false
      default: None
    host:
      description:
        - The authentication host to be used when service type  is vcd.
      required: true
      default: None
    verify_certs:
      description:
        - If the certificates of the authentication is to be verified
      required: false
      default: True
'''

EXAMPLES = '''

#create a new drive in a vdc environment

- hosts: localhost
  connection: local
  tasks:
   - vdrive:
      volume_name: "DriveName"
      size: 10
      org: "organisation"
      host: "mycloud.vmware.net"
      vdc_name: "Name"
      username: username
      password: password
'''


import time, json, xmltodict

HAS_PYVCLOUD = False
try:
    from pyvcloud.vcloudair import VCA
    HAS_PYVCLOUD = True
except ImportError:
        pass

def vca_login(module=None):
    username        = module.params.get('username')
    password        = module.params.get('password')
    instance        = module.params.get('instance_id')
    org             = module.params.get('org')
    vdc_name        = module.params.get('vdc_name')
    verify          = module.params.get('verify_certs')
    version         = module.params.get('api_version')

    host = module.params.get('host')

    if not username or not password:
        module.fail_json(msg = "Either the username or password is not set, please check")

    if not version:
        version == '5.5'

    vca = VCA(host=host, username=username, service_type='vcd', version=version, verify=verify)

    if not vca.login(password=password, org=org):
        module.fail_json(msg = "Login Failed: Please check username or password or host parameters")
    if not vca.login(password=password, org=org):
        module.fail_json(msg = "Failed to get the token", error=vca.response.content)
    if not vca.login(token=vca.token, org=org, org_url=vca.vcloud_session.org_url):
        module.fail_json(msg = "Failed to login to org", error=vca.response.content)
    return vca

def create_volume(vca=None, module=None):
  volume_info = module.params.get('volume_info')
  vdc_name    = module.params.get('vdc_name')

  vdc = vca.get_vdc(vdc_name)
  if not vdc:
      module.fail_json(msg = "Error getting the vdc, Please check the vdc name", errors=vca.response.content)

  volume_identifiers = []
  changed = False
  for volume in volume_info:
    matching_volumes = filter(lambda existing_volume: volume['name'] == existing_volume.get_name(), vca.get_diskRefs(vdc))
    if len(matching_volumes) == 0:
      result = vca.add_disk(vdc_name, volume['name'], volume['size'] * 1024 * 1024 * 1024)
      changed = True
      if result is None or len(result) == 0:
        module.fail_json(msg=volume)
      else:
        volume_identifiers.append(result[1].get_name())

  module.exit_json(changed=changed, msg="Volumes created", volume_details=volume_identifiers)

def main():
    module = AnsibleModule(
        argument_spec=dict(
            volume_info         = dict(default=None, type='list'),
            size                = dict(default=None, type='int'),
            username            = dict(default=None),
            password            = dict(default=None),
            org                 = dict(default=None),
            host                = dict(default=None),
            vdc_name            = dict(default=None),
            api_version         = dict(default='5.5'),
            verify_certs        = dict(default=True, type='bool'),
        )
    )

    vdc_name        = module.params.get('vdc_name')
    org             = module.params.get('org')
    host            = module.params.get('host')

    if not HAS_PYVCLOUD:
        module.fail_json(msg="python module pyvcloud is needed for this module")

    vca = vca_login(module)
    vdc = vca.get_vdc(vdc_name)
    if not vdc:
        module.fail_json(msg = "Error getting the vdc, Please check the vdc name")

    create_volume(vca, module)

# import module snippets
from ansible.module_utils.basic import *
if __name__ == '__main__':
        main()
