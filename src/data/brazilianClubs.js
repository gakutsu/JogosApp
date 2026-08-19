import { assetUrl } from '../utils/assetUrl.js'

export const BRAZILIAN_CLUBS = [
  { id: 'aguasanta', name: 'Água Santa', logo: assetUrl('/img/logos/aguasanta.png') },
  { id: 'athleticopr', name: 'Athletico Paranaense', logo: assetUrl('/img/logos/athleticopr.svg') },
  { id: 'atleticogo', name: 'Atlético Goianiense', logo: assetUrl('/img/logos/atleticogo.png') },
  { id: 'atleticomg', name: 'Atlético Mineiro', logo: assetUrl('/img/logos/atleticomg.png') },
  { id: 'bahia', name: 'Bahia', logo: assetUrl('/img/logos/bahia.webp') },
  { id: 'botafogo', name: 'Botafogo', logo: assetUrl('/img/logos/botafogo.png') },
  { id: 'botafogosp', name: 'Botafogo-SP', logo: assetUrl('/img/logos/botafogosp.png') },
  { id: 'capivariano', name: 'Capivariano', logo: assetUrl('/img/logos/capivariano.png') },
  { id: 'ceara', name: 'Ceará', logo: assetUrl('/img/logos/ceara.svg') },
  { id: 'chapecoense', name: 'Chapecoense', logo: assetUrl('/img/logos/chapecoense.webp') },
  { id: 'corinthians', name: 'Corinthians', logo: assetUrl('/img/logos/corinthians.png') },
  { id: 'coritiba', name: 'Coritiba', logo: assetUrl('/img/logos/coritiba.png') },
  { id: 'cruzeiro', name: 'Cruzeiro', logo: assetUrl('/img/logos/cruzeiro.png') },
  { id: 'flamengo', name: 'Flamengo', logo: assetUrl('/img/logos/flamengo.png') },
  { id: 'fluminense', name: 'Fluminense', logo: assetUrl('/img/logos/fluminense.webp') },
  { id: 'fortaleza', name: 'Fortaleza', logo: assetUrl('/img/logos/fortaleza.png') },
  { id: 'gremio', name: 'Grêmio', logo: assetUrl('/img/logos/gremio.webp') },
  { id: 'guarani', name: 'Guarani', logo: assetUrl('/img/logos/guarani.png') },
  { id: 'internacional', name: 'Internacional', logo: assetUrl('/img/logos/internacional.png') },
  { id: 'juventude', name: 'Juventude', logo: assetUrl('/img/logos/juventude.png') },
  { id: 'mirassol', name: 'Mirassol', logo: assetUrl('/img/logos/mirassol.png') },
  { id: 'novorizontino', name: 'Novorizontino', logo: assetUrl('/img/logos/novorizontino.png') },
  { id: 'palmeiras', name: 'Palmeiras', logo: assetUrl('/img/logos/palmeiras.png') },
  { id: 'rbbragantino', name: 'Red Bull Bragantino', logo: assetUrl('/img/logos/rbbragantino.png') },
  { id: 'remo', name: 'Remo', logo: assetUrl('/img/logos/remo.png') },
  { id: 'santos', name: 'Santos', logo: assetUrl('/img/logos/santos.png') },
  { id: 'saobernardo', name: 'São Bernardo', logo: assetUrl('/img/logos/saobernardo.png') },
  { id: 'saopaulo', name: 'São Paulo', logo: assetUrl('/img/logos/saopaulo.webp') },
  { id: 'sport', name: 'Sport', logo: assetUrl('/img/logos/sport.png') },
  { id: 'vasco', name: 'Vasco da Gama', logo: assetUrl('/img/logos/vasco.png') },
  { id: 'vitoria', name: 'Vitória', logo: assetUrl('/img/logos/vitoria.png') },
  { id: 'votuporanguense', name: 'Votuporanguense', logo: assetUrl('/img/logos/votuporanguense.png') },
]

export const DEFAULT_MATCH_TEAMS = {
  left: BRAZILIAN_CLUBS.find((club) => club.id === 'vasco'),
  right: BRAZILIAN_CLUBS.find((club) => club.id === 'corinthians'),
}

export function findBrazilianClub(id, fallback) {
  return BRAZILIAN_CLUBS.find((club) => club.id === id) ?? fallback
}
