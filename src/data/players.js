import { assetUrl } from '../utils/assetUrl.js'

export const AVAILABLE_PLAYERS = [
  { id: 'andreysantos', name: 'Andrey Santos', image: assetUrl('/img/jogadores/andreysantos.png') },
  { id: 'ayrtonlucas', name: 'Ayrton Lucas', image: assetUrl('/img/jogadores/ayrtonlucas.png') },
  { id: 'bastos', name: 'Bastos', image: assetUrl('/img/jogadores/bastos.jpg') },
  { id: 'bernardosilva', name: 'Bernardo Silva', image: assetUrl('/img/jogadores/bernardosilva.png') },
  { id: 'bidu', name: 'Bidu', image: assetUrl('/img/jogadores/bidu.png') },
  { id: 'ceballos', name: 'Ceballos', image: assetUrl('/img/jogadores/ceballos.jpg') },
  { id: 'claudinho', name: 'Claudinho', image: assetUrl('/img/jogadores/claudinho.jpg') },
  { id: 'denner', name: 'Denner', image: assetUrl('/img/jogadores/denner.jpg') },
  { id: 'dodi', name: 'Dodi', image: assetUrl('/img/jogadores/dodi.jpg') },
  { id: 'ederson', name: 'Éderson', image: assetUrl('/img/jogadores/ederson.jpg') },
  { id: 'everton', name: 'Éverton', image: assetUrl('/img/jogadores/everton.png') },
  { id: 'franciscosilva', name: 'Francisco Silva', image: assetUrl('/img/jogadores/franciscosilva.png') },
  { id: 'ghenrique', name: 'Gustavo Henrique', image: assetUrl('/img/jogadores/ghenrique.jpg') },
  { id: 'gmagalhaes', name: 'Gabriel Magalhães', image: assetUrl('/img/jogadores/gmagalhaes.png') },
  { id: 'helinho', name: 'Helinho', image: assetUrl('/img/jogadores/helinho.png') },
  { id: 'hugosouza', name: 'Hugo Souza', image: assetUrl('/img/jogadores/hugosouza.jpg') },
  { id: 'igorjesus', name: 'Igor Jesus', image: assetUrl('/img/jogadores/igorjesus.png') },
  { id: 'ivan', name: 'Ivan', image: assetUrl('/img/jogadores/ivan.png') },
  { id: 'jacare', name: 'Jacaré', image: assetUrl('/img/jogadores/jacare.png') },
  { id: 'joaogomes', name: 'João Gomes', image: assetUrl('/img/jogadores/joaogomes.png') },
  { id: 'kaiocesar', name: 'Kaio César', image: assetUrl('/img/jogadores/kaiocesar.png') },
  { id: 'kaue', name: 'Kauê', image: assetUrl('/img/jogadores/kaue.jpg') },
  { id: 'malcom', name: 'Malcom', image: assetUrl('/img/jogadores/malcom.png') },
  { id: 'marquinhos', name: 'Marquinhos', image: assetUrl('/img/jogadores/marquinhos.jpg') },
  { id: 'martinelli', name: 'Martinelli', image: assetUrl('/img/jogadores/martinelli.png') },
  { id: 'matheusmartins', name: 'Matheus Martins', image: assetUrl('/img/jogadores/matheusmartins.png') },
  { id: 'matheuzinho', name: 'Matheuzinho', image: assetUrl('/img/jogadores/matheuzinho.jpg') },
  { id: 'pedrolima', name: 'Pedro Lima', image: assetUrl('/img/jogadores/pedrolima.png') },
  { id: 'pedromilans', name: 'Pedro Milans', image: assetUrl('/img/jogadores/pedromilans.png') },
  { id: 'plata', name: 'Plata', image: assetUrl('/img/jogadores/plata.png') },
  { id: 'ramalho', name: 'André Ramalho', image: assetUrl('/img/jogadores/ramalho.png') },
  { id: 'raniele', name: 'Raniele', image: assetUrl('/img/jogadores/raniele.png') },
  { id: 'rodrigomuniz', name: 'Rodrigo Muniz', image: assetUrl('/img/jogadores/rodrigomuniz.png') },
  { id: 'rodriguinho', name: 'Rodriguinho', image: assetUrl('/img/jogadores/rodriguinho.jpg') },
  { id: 'rugani', name: 'Rugani', image: assetUrl('/img/jogadores/rugani.png') },
  { id: 'tchoca', name: 'Tchoca', image: assetUrl('/img/jogadores/tchoca.webp') },
  { id: 'villasanti', name: 'Mathias Villasanti', image: assetUrl('/img/jogadores/villasanti.jpg') },
  { id: 'viveros', name: 'Kevin Viveros', image: assetUrl('/img/jogadores/viveros.webp') },
  { id: 'yancouto', name: 'Yan Couto', image: assetUrl('/img/jogadores/yancouto.png') },
]

export function findPlayerByName(name) {
  const normalized = name.trim().toLocaleLowerCase('pt-BR')
  return AVAILABLE_PLAYERS.find((player) => player.name.toLocaleLowerCase('pt-BR') === normalized)
}
