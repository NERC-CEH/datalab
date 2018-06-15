# Testing View

This section details the platform architecture from the view-point of its testing.

* **[Overall strategy](#overall-strategy)**

# Overall strategy

There are many different components to the Datalabs system. This requires a complex testing strategy involving a mix of unit, integration, system and manual testing. This sections covers the testing strategy for each component giving the details of the types of testing that should be performed and the tools and libraries which should be used.

Wherever possible automated testing should be configured to run in both the developer environment and on the continuous integration server using the same scripts. This is to ensure that we conform to the principle that coding in the CI tool should be avoided.

## Unit testing

Code level tests for smallest functional units individually and independently. All dependencies of the unit should be mocked to isolate the behavior of the unit under test. These tests should not have any runtime dependencies (e.g. on a database).

## Front End Unit Testing

All Front End React components should have unit tests. To achieve this in a sustainable
way it is necessary to create small, independent, stateless components as these can then
be tested in isolation. Jest provides a **snapshot** testing utility that makes this
type of test far easier to write. In addition, the use of the Enzyme library will allow
for shallow rendering of components.

In order to facilitate unit testing for containers (or stateful containers bound to the
redux store) the containers provide an additional `Pure` export of their functionality
that is not bound to the redux state.

## Integration and System Testing

All integration and system testing for datalabs is performed through manual tests as the
team has prioritised building the system to a proof of concept level. This should be
addressed if the project moves into a second phase and continues to extend the system.

## Infrastructure Testing

A large part of the datalabs project has been configuring and managing the underlying
infrastructure to give the Kubernetes foundation required for the project. It is possible
to write automated tests for Ansible roles using
[Molecule](https://molecule.readthedocs.io/en/latest/) and this may be a good investment
in later stages of the project.

[Goss](https://github.com/aelsabbahy/goss) is another tool that could be used to put
basic checks on the underlying infrastructure to ensure that any divergence from the
desired state can be easily discovered.
