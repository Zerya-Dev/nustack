default: install

install:
    pnpm install

build:
    pnpm  build

test:
    pnpm test

typecheck:
    pnpm typecheck

lint:
    pnpm lint

format:
    pnpm lint:fix

check: lint typecheck test