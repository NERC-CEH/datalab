# Accessibility Review

Conducted on 17th November 2020.

## Common Issues

These are issues that are found on multiple pages, usually due to reuse of components.

### From lighthouse tests

* Stack card More menu button failing for no accessible name.
* User initials in top right failing for not having an alt attribute for the gravitar image.
* All Primary coloured action buttons failing for low contrast.
* Lists do not contain only `<li>` elements and script supporting elements (`<script>` and `<template>`).
  Failing elements: Current Project Lighthouse Testing (LHOUSE) info_outline Information ANALYSI… `<ul class="MuiList-root jss50 MuiList-padding">`.
  Looks like this is to do with the project picker in the project side bar.
* Following div failing for not having a unique ARIA ID (think this is the stack card more menu)
  `<div role="presentation" class="MuiPopover-root" id="more-menu" aria-hidden="true" style="position: fixed; z-index: 1300; inset: 0px; visibility: hidden;">`.
  Looks like it is the `id=more-menu` that is the issue.

### From manual testing

* Very hard to tell when the top nav buttons have focus.
* Top nav admin and project button don't get keyboard focus when tabbing through site.
* Can't close create project form using escape key. Can navigate to cancel button and press this though.
* "Cannot be opened until resource is ready" tooltip shows when the Open button on stack card has focus.
* User initials in top right doesn't get key board focus: this would stop someone from logging out.
* More menu button needs an aria-label so it is announced properly.
* When opening more menu, the focus does not go to the first item in the menu meaning you can't navigate the menu using the keyboard.
* Fields in the create project form don't seem to have their name read out.
  Some of the text fields in the create notebook form do so would be good to look at.
* The error label on the form fields doesn't seem to be linked to the field it is describing.
* Pagination buttons are only announced as `button`. They need something else to make them read that they are next/previous page.
* The pagination current page text field doesn't get announced with a descriptive label.
* The `<main>` tag contains the side bar as well as the main page content which it probably shouldn't.
* The top and side bar navigation panes don't contain `<nav>` landmarks.
* Unable to navigate side nav buttons with keyboard.
* When selecting the quick change project selector the screen reader was reading that there are 10 items when there were only three in the list.
  Upon activating the list, it knows that there are only three items.

#### Questions

* Should open and more-menu buttons reference the project/notebook/etc. that they belong to?
* How would we make stack card status accessible?
  Would it need some form of aria label?
* Stack card open button isn't focusable with keyboard when it is disabled. Should it be?

## Projects page

### From lighthouse tests

* Project filter box failing for not having an associated label.

### From manual testing

* Not clear that the "My Projects" button is a toggle.
* Creat Project button is read as "Add" by screen reader.

## Project info page

Nothing to add over common issues.

## Project notebooks page

Nothing to add over common issues.

## Project dask page

Nothing to add over common issues.

## Project spark page

Nothing to add over common issues.

## Project spark page

Nothing to add over common issues.

## Project settings page

### From lighthouse testing

* Some elements have invalid aria attributes. See report file for more information.
* Remove user buttons do not have accessible names.
* Project info text fields do not have associated labels.
* Check boxes in user permissions tables do not have labels.

### From manual testing
* Cannot select names of users from dropdown using only the keyboard.

## Admin resources page

### From lighthouse

* Buttons to toggle collapsing of sections might not be labeled properly.
  They might also want to be labeled in a way that indicates they are for collapsing/expanding sections.

### From manual testing

Nothing to add over common issues.
