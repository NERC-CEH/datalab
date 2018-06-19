# Maintenance

Datalabs is not a heavily used production system and long term maintenance requirements
are not yet full understood.

The only regular maintenance currently scheduled is a review of the health of all servers
on a weekly basis. This is primarily to check disk usage growth and to make sure that
updates are correctly applied.

Ansible can be used to automate commands across multiple hosts for regular maintenance.
To report disk usage for all server execute

```bash
ansible all -a "df -h" -u deploy
```

A full `/boot` is a common issue if regular maintenance isn't performed. Resolution is
described in a [runbook](./runbooks/02-full-boot-partition.md).