/**
 * Monster mission data for the global hunt
 * SINGLE SOURCE OF TRUTH - exactly one pin per monster
 */

export interface Monster {
  id: string;
  name: string;
  country: string;
  continent: string;
  order: number;
  latitude: number;
  longitude: number;
  image: string;
  shortDescription: string;
}

export const MONSTERS: Monster[] = [
  {
    id: "bunyip",
    name: "Bunyip",
    country: "Australia",
    continent: "Australia",
    order: 1,
    latitude: -25.0,
    longitude: 133.0,
    image: "/monsters/bunyip.png",
    shortDescription:
      "Swamp-dwelling beast of Australian billabongs, said to drag unsuspecting travelers into the murky depths.",
  },
  {
    id: "yeti",
    name: "Himalayan Yeti",
    country: "Nepal",
    continent: "Asia",
    order: 3,
    latitude: 28.6,
    longitude: 84.0,
    image: "/monsters/yeti.png",
    shortDescription:
      "A towering ice guardian roaming the high passes of the Himalayas, wrapped in snow and ancient legend.",
  },
  {
    id: "kitsune",
    name: "Kitsune",
    country: "Japan",
    continent: "Asia",
    order: 2,
    latitude: 36.2,
    longitude: 138.0,
    image: "/monsters/kitsune.png",
    shortDescription:
      "A nine-tailed fox spirit that shifts between human and fox form, guarding sacred forests and shrines.",
  },
  {
    id: "el-coco",
    name: "El Coco",
    country: "Spain",
    continent: "Europe",
    order: 5,
    latitude: 40.4,
    longitude: -3.7,
    image: "/monsters/el_coco.png",
    shortDescription:
      "A shadowy rooftop stalker that slips between chimneys and balconies, whispering fear into sleeping towns.",
  },
  {
    id: "wendigo",
    name: "Wendigo",
    country: "USA",
    continent: "North America",
    order: 8,
    latitude: 40.0,
    longitude: -100.0,
    image: "/monsters/wendigo.png",
    shortDescription:
      "A gaunt, antlered spirit of hunger that prowls frozen forests, drawn to lost travelers and desperate souls.",
  },
  {
    id: "chupacabra",
    name: "Chupacabra",
    country: "Mexico",
    continent: "North America",
    order: 9,
    latitude: 23.6,
    longitude: -102.5,
    image: "/monsters/chupacabra.png",
    shortDescription: "A spined desert predator said to drain the life from livestock under the glow of the moon.",
  },
  {
    id: "mapinguari",
    name: "Mapinguari",
    country: "Brazil",
    continent: "South America",
    order: 10,
    latitude: -3.0,
    longitude: -60.0,
    image: "/monsters/mapinguari.png",
    shortDescription:
      "A one-eyed jungle colossus that crushes through the Amazon undergrowth, protecting the deepest forests.",
  },
  {
    id: "amaru",
    name: "Amaru",
    country: "Peru",
    continent: "South America",
    order: 11,
    latitude: -13.2,
    longitude: -72.0,
    image: "/monsters/amaru.png",
    shortDescription:
      "A two-headed serpent-dragon spiraling above ancient ruins, weaving storms over the Andes.",
  },
  {
    id: "embalabala",
    name: "Embalabala",
    country: "Uganda",
    continent: "Africa",
    order: 6,
    latitude: 1.4,
    longitude: 32.3,
    image: "/monsters/embalabala.png",
    shortDescription:
      "A were-leopard of the savanna, half human and half predator, hunting by the glow of a blood-red sunset.",
  },
  {
    id: "asanbosam",
    name: "Asanbosam",
    country: "Ghana",
    continent: "Africa",
    order: 7,
    latitude: 7.9,
    longitude: -1.0,
    image: "/monsters/asanbosam.png",
    shortDescription:
      "A tree-dwelling vampire with iron hooks for feet, dropping silently from the canopy onto passing travelers.",
  },
  {
    id: "ice-colossus",
    name: "Ice Colossus, Leviathan of the Frozen Deep",
    country: "Antarctica",
    continent: "Antarctica",
    order: 12,
    latitude: -82.0,
    longitude: 0.0,
    image: "/monsters/ice_colossus.png",
    shortDescription:
      "A towering titan of jagged ice rising from the fractured sea, final guardian of the world's frozen edge.",
  },
  {
    id: "kraken",
    name: "Kraken",
    country: "Denmark",
    continent: "Europe",
    order: 4,
    latitude: 55.7,
    longitude: 12.6,
    image: "/monsters/kraken.png",
    shortDescription:
      "A colossal sea monster said to rise from the Danish coasts, dragging ships and sailors into the depths.",
  },
];

