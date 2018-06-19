# Development View

This section details the platform architecture from the view-point of its development.

* **[Language choices](#language-choices)**
* **[Technology choices](#technology-choices)**
* **[Design and Build Process](#design-and-build-process)**
* **[Development Tooling and Process](#development-tooling-and-process)**

## Language choices

We are primarily using JavaScript (ES6) as our development language for both front end
code and back end services running in Node.js.

## Technology choices

We have selected a number of technologies to help us build and host services effectively:

### Platform hosting

| Name | Role | Reason for use |
| ---- | ----------- | -------------- |
| **OpenStack**  | Cloud hosting platform | STFC use OpenStack for their cloud platform and provide our infrastructure tenancy. Very little in the code base is OpenStack specific and only a small amount of work should be required to move to a different provider. |
| **Terraform** | Infrastructure provisioning | We need to automate the building of our estate, so that we can repeatably build and deploy environments. We will provision all infrastructure using Terraform with state stored in an HTTP backend. The state storage and plan features of Terraform will give us greater confidence that the changes we are applying are those that were expected. |
| **Ansible** | Software provisioning | Ansible is a software provisioning tool that provides building blocks of modules to perform common software configuration tasks in an idempotent way.  |
| **Docker** | Containerisation | We will use containerisation as it gives us light-weight, isolated components that can be run with confidence across different environments. Docker is the leading technology for containerisation.
| **Kubernetes** | Container orchestration | Kubernetes is the leading tool for managing the complexity of running a resilient set of containers. |
| **kubeadm** | Kubernetes cluster management | Getting a Kubernetes cluster deployed is complicated; kubeadm provides help in this process. |
| **Helm** | Kubernetes manifests management | Deployment of resources to Kubernetes is performed through manifest files. Helm is the standard tool for managing these. |
| **DockerHub** | Container repository | We are deploying all of our services as Docker containers. Given this we need a central Docker repository to allow us to publish and manage our containers. DockerHub is a SaaS container repository that is free for
Open Source Projects. |
| **TravisCI** | Continuous Integration | We have decided to use Travis for our CI as it is free for Open Source projects and provides a simple way to configure builds through a configuration file at the base of the repository. |

### Platform infrastructure

| Name | Role | Reason for use |
| ---- | ----------- | -------------- |
| **Auth0** | Authentication | Auth0 gives us an easy way to provide an authentication framework with user management features and is free to Open Source projects. |
| **MongoDB** | Non-relational data store | Much of the data in the platform will have patterns of use and structures which suit a non-relational data store. MongoDB is the leading database for storing data as unstructured or semi-structured JSON. |
| **EFK Logging** | Log Aggregation | In a containerised, services architecture it is important to provide an easy way to view logs across all running containers. The ElasticSearch, Fluentd, Kibana stack provides this capability. |
| **Prometheus** | Platform monitoring and alerting | It is vital that we monitor our services and infrastructure so that performance can be actively tracked, and issues can be diagnosed. Prometheus is the leading open-source toolkit for systems monitoring and alerting. |

## Development Tooling and Process

Development of Datalabs requires a 'nix based system as Windows lags in the
Docker and Kubernetes space. Microsoft are trying to close the gap but the Linux
subsystem in Windows is a poor substitute for the real thing. MacOS is recommended as a
trade between the two.

The datalabs system has many moving parts and while it is possible to develop all of them
in isolation, it is also useful to be able to integration test in a realistic local
environment. **Minikube** can be used to provide local single node Kubernetes in a VM
but additional configuration is required to get ingress and storage working correctly
for datalabs.

A lot of time has been invested in improving the development environment and given this
is regularly refined and updated details are included in the
[repository](https://github.com/NERC-CEH/datalab/tree/master/code/development-env).
