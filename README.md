# Atlas Path

## Requirements
- `nvm` (eg: `brew install nvm`)
- `pnpm` (eg: `npm install -g pnpm`)
- `docker` (eg: `brew install orbstack`)

## Development

Provide envs adding missing secrets:
```sh
cp .env.sample .env
```

Then:
```sh
nvm install # install specific node version
pnpm install # install deps
export $(grep -v '^#' .env | xargs) # loads envs
pnpm env:down # clean up services services
pnpm env:up # start services
pnpm -F api db:migrate # run migrations
pnpm -F api db:seed # seed the database
```

Run services:
```sh
pnpm -F api start:dev
pnpm -F admin build:dev
```

API is served at <http://localhost>.  
Admin app is served at <http://localhost:3001>.  

Lint and typecheck codebase:
```sh
pnpm lint ./services
pnpm tsc
```

Test services:
```sh
pnpm -F api test
```

Run interaction tests (`storybook`):
```sh
pnpm -F ui storybook
```

## Deployment

CI/CD is powered by GitHub Actions workflows defined in [.github](./github) folder:
- PR on `main` branch are tested but not deployed to any environment.
- Commits on `main` branch are tested then deployed to development environment.
- Commits on `staging` branch are tested then deployed to staging environment.
- Commits on `production` branch are tested then deployed to production environment.
