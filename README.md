# Welcome to Caesar.Team 👋

![Version](https://img.shields.io/badge/version-1.4.1-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D12.13-blue.svg)
[![Code quality: A](https://img.shields.io/lgtm/grade/javascript/github/caesar-team/caesar-web-client?label=Code%20quality&logo=lgtm)](https://lgtm.com/projects/g/caesar-team/caesar-web-client/context:javascript)
![CodeQL](https://github.com/caesar-team/caesar-web-client/workflows/CodeQL/badge.svg)
[![Documentation](https://img.shields.io/badge/documentation-yes-green.svg)](https://docs.caesar.team)
[![License: PolyForm Internal Use](https://img.shields.io/badge/license-Polyform%20Internal%20Use-yellow)](https://polyformproject.org/licenses/internal-use/1.0.0/)
[![Twitter: CaesarTeamApp](https://img.shields.io/twitter/follow/CaesarTeamApp.svg?style=social)](https://twitter.com/CaesarTeamApp)

> Caesar is the open-source solution for safe work with sensitive data (passwords, passports, docs etc )

### 🏠 [Homepage](https://caesar.team)

## Prerequisites

- node >=12.13

## Stack

- react: ^16.8.6
- redux: ^4.0.4
- next: ^9.0.5
- express: ^4.17.1
- styled-components: ^4.3.2
- openpgp: ^4.10.7

## Installation

This project uses yarn as a package manager. You should install [yarn](https://yarnpkg.com/en/docs/install).

# Web application

1. Update .env:
   1. Create a config file .env.development (for local development)
      `cp packages/web-app/.env.dist packages/web-app/.env.development`
      or .env.production (for production build)
      `cp packages/web-app/.env.dist packages/web-app/.env.production`
      by .env.dist
   2. Fill required values by instruction inside .env
2. Install project dependencies
   `yarn`
3. Run nextjs-server for local development
   `yarn dev`
4. To open project just go to http://localhost:3000/

Build for remote server

1. Create production build
   `build:production`
2. Run production build on local server
   `start:production`
3. To open project just go to http://localhost:3000/

# Secure application

1. Update .env:
   1. Create a config file .env.development (for local development)
      `cp packages/secure-app/.env.dist packages/secure-app/.env.development`
      or .env.production (for production build)
      `cp packages/secure-app/.env.dist packages/secure-app/.env.production`
      by .env.dist
   2. Fill required values by instruction inside .env
2. Install project dependencies
   `yarn`
3. Run nextjs-server for local development
   `yarn secure:dev`
4. To open project just go to http://localhost:3000/

Build for remote server

1. Create production build
   `secure:build:production`
2. Run production build on local server
   `secure:start:production`
3. To open project just go to http://localhost:3000/

## Author

👤 **ave@caesar.team**

- Twitter: [@CaesarTeamApp](https://twitter.com/CaesarTeamApp)
- Github: [@caesar-team](https://github.com/caesar-team)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/caesar-team/caesar.team/issues).

## 📝 License

Copyright © 2020 [ave@caesar.team](https://github.com/caesar-team).

This project is [PolyForm Internal Use](https://polyformproject.org/licenses/internal-use/1.0.0/) licensed.
