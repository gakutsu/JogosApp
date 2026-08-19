export const BRAZILIAN_CLUBS = [
  { id: 'aguasanta', name: 'Água Santa', logo: '/img/logos/aguasanta.png' },
  { id: 'athleticopr', name: 'Athletico Paranaense', logo: '/img/logos/athleticopr.svg' },
  { id: 'atleticogo', name: 'Atlético Goianiense', logo: '/img/logos/atleticogo.png' },
  { id: 'atleticomg', name: 'Atlético Mineiro', logo: '/img/logos/atleticomg.png' },
  { id: 'bahia', name: 'Bahia', logo: '/img/logos/bahia.webp' },
  { id: 'botafogo', name: 'Botafogo', logo: '/img/logos/botafogo.png' },
  { id: 'botafogosp', name: 'Botafogo-SP', logo: '/img/logos/botafogosp.png' },
  { id: 'capivariano', name: 'Capivariano', logo: '/img/logos/capivariano.png' },
  { id: 'ceara', name: 'Ceará', logo: '/img/logos/ceara.svg' },
  { id: 'chapecoense', name: 'Chapecoense', logo: '/img/logos/chapecoense.webp' },
  { id: 'corinthians', name: 'Corinthians', logo: '/img/logos/corinthians.png' },
  { id: 'coritiba', name: 'Coritiba', logo: '/img/logos/coritiba.png' },
  { id: 'cruzeiro', name: 'Cruzeiro', logo: '/img/logos/cruzeiro.png' },
  { id: 'flamengo', name: 'Flamengo', logo: '/img/logos/flamengo.png' },
  { id: 'fluminense', name: 'Fluminense', logo: '/img/logos/fluminense.webp' },
  { id: 'fortaleza', name: 'Fortaleza', logo: '/img/logos/fortaleza.png' },
  { id: 'gremio', name: 'Grêmio', logo: '/img/logos/gremio.webp' },
  { id: 'guarani', name: 'Guarani', logo: '/img/logos/guarani.png' },
  { id: 'internacional', name: 'Internacional', logo: '/img/logos/internacional.png' },
  { id: 'juventude', name: 'Juventude', logo: '/img/logos/juventude.png' },
  { id: 'mirassol', name: 'Mirassol', logo: '/img/logos/mirassol.png' },
  { id: 'novorizontino', name: 'Novorizontino', logo: '/img/logos/novorizontino.png' },
  { id: 'palmeiras', name: 'Palmeiras', logo: '/img/logos/palmeiras.png' },
  { id: 'rbbragantino', name: 'Red Bull Bragantino', logo: '/img/logos/rbbragantino.png' },
  { id: 'remo', name: 'Remo', logo: '/img/logos/remo.png' },
  { id: 'santos', name: 'Santos', logo: '/img/logos/santos.png' },
  { id: 'saobernardo', name: 'São Bernardo', logo: '/img/logos/saobernardo.png' },
  { id: 'saopaulo', name: 'São Paulo', logo: '/img/logos/saopaulo.webp' },
  { id: 'sport', name: 'Sport', logo: '/img/logos/sport.png' },
  { id: 'vasco', name: 'Vasco da Gama', logo: '/img/logos/vasco.png' },
  { id: 'vitoria', name: 'Vitória', logo: '/img/logos/vitoria.png' },
  { id: 'votuporanguense', name: 'Votuporanguense', logo: '/img/logos/votuporanguense.png' },
]

export const DEFAULT_MATCH_TEAMS = {
  left: BRAZILIAN_CLUBS.find((club) => club.id === 'vasco'),
  right: BRAZILIAN_CLUBS.find((club) => club.id === 'corinthians'),
}

export function findBrazilianClub(id, fallback) {
  return BRAZILIAN_CLUBS.find((club) => club.id === id) ?? fallback
}
