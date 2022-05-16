- [x] organizar os tipos das queries (aura-data)
- [x] padronizar mensagens de commit (commitzen)
- [x] gerar versao no pacote baseado no commit message
- [ ] checar se funciona com mudanca em pacotes distintos (aura-data - aura-ui)
- [ ] cleanup unused deps
- [ ] linter / husky -> se o commit foi feito pelo cz
- [ ] como publicar o aura-data e aura-ui como npm packages
- [ ] como definir o semver: commit messages - commitizen
- [ ] limpar erros do output
- [ ] atualizar dependencias

---

- npm sign-in
- build cada pacote: npm run build
- descobrir a versao: <- informacao do tipo de alteracao
- set version (pensar como usar o semver): npm version patch|minor|major
  - lerna
- npm publish

npm run publish-stable

npx lerna exec --no-bail -- npm publish
