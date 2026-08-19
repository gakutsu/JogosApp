# JogosApp Brasileiro

Projeto React + Vite para gerenciamento visual de partidas entre clubes brasileiros.

## Cronômetro da partida

- 4 minutos reais equivalem a 45 minutos de jogo.
- 1º tempo: 00:00 até 45:00.
- 2º tempo: 45:00 até 90:00.
- Acréscimos independentes para cada tempo, de 0 a 15 minutos.
- O cronômetro continua além de 45:00/90:00 quando houver acréscimos.
- Pausa e retomada do relógio.
- Transição automática para Intervalo após o 1º tempo.
- Transição automática para Fim de jogo após o 2º tempo + acréscimos.
- O estado do cronômetro é preservado no navegador.
- Nova partida limpa cronômetro, acréscimos, placar e eventos.

## Executar

```powershell
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173/`.

## Compilar

```powershell
npm run build
```


## Ajuste de layout do cronômetro
O cronômetro foi movido para um painel independente abaixo do placar, preservando o alinhamento original dos times, placar e status da partida.

## GitHub Pages

Esta versão está preparada para publicação no GitHub Pages.

1. Faça push para a branch `main`.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment > Source**, selecione **GitHub Actions**.
4. Aguarde o workflow **Deploy Vite to GitHub Pages** em **Actions**.
5. O link final aparecerá em **Settings > Pages**.

A configuração usa `base: './'` e `import.meta.env.BASE_URL` para evitar tela branca quando o repositório é publicado em `https://usuario.github.io/repositorio/`.
