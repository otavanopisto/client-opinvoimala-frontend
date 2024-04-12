# Frontend for Opinvoimala

React project bootstrapped with [Create React App](https://github.com/facebook/create-react-app) & [Typescript](https://www.typescriptlang.org/docs/home.html).

**Relevant links/documentation**:

- [MobX state tree](https://mobx-state-tree.js.org/)
- [Styled components](https://styled-components.com/docs/basics)
- [Semantic UI](https://react.semantic-ui.com/)
- [React-i18next](https://github.com/i18next/react-i18next)
- [Prettier](https://prettier.io/docs/en/index.html)

## Setup

- **Manage API URLs** in `package.json`'s config/apiUrl section (these are used as a ENV-variables when starting/building the app)


## Commands

```sh
# Install dependencies
yarn

# Run dev version (against local API)
yarn start

# Run against staging version of the API
yarn start:stage

# Run against production version of the API
yarn start:production

# Build staging version
yarn build:stage

# Build production version
yarn build:production
```

## Branches

- `dev` - Finished features
- `master` - Production version

## Digital Ocean deploy

### Upgrade stage

Create & push new tag `*-stage` (e.g. yyyymmdd-HHMM-stage)

```sh
git checkout dev
# Make sure that all changes are merged into dev
git tag [tag]
git push origin dev --tags
```

_(It's recommend to deploy staging versions from dev branch)_

### Upgrade production

Please deploy production versions always from the master branch!

1. Update changelog & bump version number in package.json and commit changes
2. Create & push new tag `*-production` (e.g. 0.0.1-production)

```sh
git checkout master
# Make sure all changes are merged into master and
# Update changelog & package.json (and commit changes)
git tag [tag]
git push origin master --tags
```
