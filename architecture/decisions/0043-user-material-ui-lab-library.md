# 43. Use Material UI Lab library

Date: 2019-12-05

## Status

Accepted

## Context

The core [Material UI React component library](https://material-ui.com/) is used for much of
the DataLabs UI. Before new components make it into the core library, they pass through
["The Lab"](https://material-ui.com/components/about-the-lab/). This provides a platform
for the new components to be tested in real world applications.

At the time of writing, the [Autocomplete](https://material-ui.com/components/autocomplete/)
component would be beneficial to use but it is currently in the lab. Therefore, a decision
needs to be made about whether we are happy to use components from the lab. The
key considerations are as follows.

### Pros

* Gives us access to components that will reduce development effort required to
  implement functionality.
* Gives components that have a simpler interface to the components they would be replacing
  (e.g. [Downshift](https://github.com/downshift-js/downshift) in the case of Autocomplete)
  making them easier to maintain and adapt.

### Cons

* Components in the lab are free to have breaking changes on a more regular basis
  compared to the ones in the core library.
* The components being used might not migrate from the lab into the core library.

## Decision

We will use the Material UI Lab component library. The ease to develop and maintain the
user interface using the components in the lab outweighs the downsides. We don't have to
update the lab package if a new version removes a component that is currently in use
or introduces breaking changes into the component.
