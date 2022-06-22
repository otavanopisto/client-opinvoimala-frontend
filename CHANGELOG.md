# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2022-06-22

### Fixed

- OPI-88: Added image null check to prevent crash
- OPI-88: Fixed goals done count not updating when marking goal done

## [0.3.0] - 2022-06-22

### Added

- OPI-92: Users can delete own accounts and related data
- OPI-95: Card component can have image
- OPI-97: Test outcomes are printable (=downloadable)
- OPI-88: User goals (users can set and manage goals for themselves)
- OPI-90: Events
- OPI-93: Admin/Appointments (Manage appointments as a specialist)
- OPI-94: User interests (users can get recommendations according to chosen tags)
- OPI-91: Feedback component to content pages & tests
- OPI-101: Admin/Roles Specialists can manage own roles

### Changed

- OPI-96/OPI-98/OPI-90: Accessibility/UI updates & fixes

### Fixed

- OPI-99: Initialize Pym.js if embedded pym content is found

## [0.2.11] - 2022-01-25

### Added

- OPI-83: Added Kuormitusmittari scripts

### Changed

- OPI-82: Save AUTH_TOKEN to the local storage (instead of the session storage)

### Fixed

- OPI-81: Exercises have different text than "reqular" tests
- OPI-81: Removed watermark from frontpage

## [0.2.10] - 2022-01-17

### Added

- OPI-80: Test categories can have custom links to point category page
- OPI-80: Toggle test summary on/off in well-being-profile
- OPI-80: Default texts for test summary

## [0.2.9] - 2022-01-04

### Changed

- Show chat only for logged-in-users
- Watermark is hidden for screen readers
- Moved asterisk-annotation on top of each form
- Performance optimization: "Lazy load" all views
- Performance optimization: Use fonts internally from app assets instead of external import

### Added

- aria-hidden attribute to all Divider components
- Cookiebot declaration view

### Fixed

- Set focus to question heading when question changed
- Focus outline colors

## [0.2.8] - 2021-12-23

### Changed

- Add also page/test slug to document title
- Removed probably unnecessary route tracker (GA does this automatically?)

## [0.2.7] - 2021-12-23

### Added

- Asterisk is required annotation
- User sees which tests affecs well being profile

### Changed

- Set focus to selected day when making appointments
- Hide hero's watermark on smaller screens
- Consider image alignment

## [0.2.6] - 2021-12-21

### Added

- Maintenance page

## [0.2.5] - 2021-12-21

### Changed

- Site meta description

## [0.2.4] - 2021-12-20

### Added

- Added changelog
- OPI-71: Card component to content page

### Changed

- OPI-66: Date picker behaviour on month change

### Fixed

- OPI-72: Fixed "watermark" positioning

## [0.2.3] - 2021-12-16

### Added

- Google Analytics
- Giosg Chat

### Fixed

- Cookiebot setup
- Some test fixes

## [0.2.2] - 2021-11-30

### Added

- Cookiebot
- Google Analytics
- Giosg Chat settings
- Some test fixes

### Added

- Tests
- Well being profile

## [0.2.0] - 2021-11-29

### Added

- Tests
- Well being profile

## [0.1.0] - 2021-10-27

### Added

- Initial layout
- Frontpage
- Content pages
- Appointments
- ...
