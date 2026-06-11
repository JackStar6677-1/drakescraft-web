import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';


const app = Fastify({ logger: true, trustProxy: true });
const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
const counterFile = path.join(dataDir, 'visits.json');
const quoteFile = path.join(dataDir, 'store-quotes.jsonl');
const discordUrl = 'https://discord.com/api/guilds/699391897369575476/widget.json';
let discordCache = { expiresAt: 0, value: null };
let visits = 0;

const storeCatalog = {
  updatedAt: '2026-06-11',
  currency: 'CLP',
  payment: {
    mode: 'ticket',
    discord: 'https://discord.gg/rR7FbfCt9Y',
    paypal: 'https://paypal.me/jackstar6677',
    mercadoPago: 'https://link.mercadopago.cl/drakescraft'
  },
  categories: [
    { id: 'monthly', label: 'Rangos VIP', tagline: 'Identidad griega, utilidad progresiva y kits fuertes.' },
    { id: 'roles', label: 'Roles de Juego', tagline: 'Subrangos con prefijo secundario y kit diario.' },
    { id: 'kits', label: 'Kits y equipo', tagline: 'Resumen de lo que trae cada línea de rango.' },
    { id: 'protection', label: 'Protecciones', tagline: 'Territorio VIP para bases, gremios y proyectos.' },
    { id: 'utility', label: 'Utilidad', tagline: 'Dragmas de plata y beneficios de economía.' },
    { id: 'economy-kits', label: 'Kits del Survival', tagline: 'Kits comprables in-game usando Dragmas (₯).' },
    { id: 'custom', label: 'Especiales', tagline: 'Cotizaciones manuales sin romper el balance.' }
  ],
  products: [
    { id: 'hercules', category: 'monthly', tier: 1, name: 'Hércules', badge: 'Entrada VIP', clp: 4990, usd: 4.99, featured: false, accent: 'bronze', summary: 'El primer gran paso en tu odisea. Ideal para empezar tu aventura con comodidad y estilo.', includes: ['3 homes y 5 warps de jugador (/pw)', 'Chat con formato de colores y comando /hat', 'Comando /clearinventory (/ci) para limpieza', '2 regiones de protección personal de 49x49', 'Kit (24h): Diamante Protec VIII, Irromp V', 'Espada Sharpness X, Saqueo V', 'Herramientas Eficiencia VIII, Fortuna VI', '48 zanahorias doradas, 64 filetes, 4 gapples, 1 Tótem', '$25,000 ₯ al reclamar el kit'] },
    { id: 'hestia', category: 'monthly', tier: 2, name: 'Hestia', badge: 'Social', clp: 7990, usd: 7.99, featured: false, accent: 'rose', summary: 'Diseñado para constructores sociales y jugadores que disfrutan de personalizar su entorno.', includes: ['5 homes y comando /nick', 'Hora (/ptime) y clima (/pweather) personal', 'Comando /ext para apagarte al instante', '3 regiones de protección personal de 81x81', 'Kit (24h): Diamante Protec X, Irromp VI, Espinas III', 'Espada Sharpness XII, Saqueo VI', 'Arco del Olimpo Poder X, Infinidad', 'Herramientas Eficiencia X, Silk Touch', '1 Shulker, 6 gapples, 2 Tótems', '$50,000 ₯ al reclamar. Hereda Hércules'] },
    { id: 'hermes', category: 'monthly', tier: 3, name: 'Hermes', badge: 'Recomendado', clp: 10990, usd: 10.99, featured: true, accent: 'violet', summary: '¡Movilidad absoluta! Explora el mapa a toda velocidad y viaja sin límites.', includes: ['Vuelo con /fly y velocidad con /speed', '/workbench y /enderchest virtuales', '/back para retornar (y al morir)', '/compass y /wild (RTP instantáneo)', '4 regiones de protección de 113x113', 'Kit (24h): Alas de Ícaro (Elytra) incluidas', 'Armadura Protec XII, Irromp VII, Soul Speed IV, Feather Falling X', 'Espada Sharpness XIV, Saqueo VII', 'Arco del Olimpo Poder XII, Infinidad', 'Herramientas Eficiencia XII, Fortuna VIII', '1 Shulker, 64 cohetes, 10 gapples, 3 Tótems', '$100,000 ₯ al reclamar. Hereda anteriores'] },
    { id: 'hefesto', category: 'monthly', tier: 4, name: 'Hefesto', badge: 'Técnico', clp: 15990, usd: 15.99, featured: false, accent: 'ember', summary: 'El rango predilecto para los creadores de granjas, mineros técnicos y entusiastas del metal.', includes: ['8 homes y comando /feed', '/anvil, /grindstone, /loom, /stonecutter, /smithingtable virtuales', 'Comando /condense para compactar recursos', '5 regiones de protección de 177x177', '/wild (RTP) sin cooldown', 'Kit (24h): Primer kit con NETHERITA completa', 'Armadura Netherita Protec XVI, Irromp VIII', 'Espada Netherita Sharpness XVIII, Saqueo VIII, Knockback I', 'Pico Netherita Eficiencia XIV, Fortuna X', '1 Beacon, 1 Shulker, 14 gapples, 1 notch apple, 4 Tótems', '$175,000 ₯ al reclamar. Hereda anteriores'] },
    { id: 'artemisa', category: 'monthly', tier: 5, name: 'Artemisa', badge: 'Exploración', clp: 22990, usd: 22.99, featured: false, accent: 'cyan', summary: 'Equipamiento mítico y verticalidad. Conquista los cielos y los abismos marinos sin temor a la muerte.', includes: ['12 warps de jugador (/pw) y comando /jump', 'Conserva tu XP al morir (keepxp)', '5 regiones de protección de 241x241', 'Kit (24h): Tridente Impaling XII, Loyalty VIII, Channeling I', 'Armadura Netherita Protec XVIII, Irromp IX, Feather Falling XIV', 'Espada Netherita Sharpness XX, Saqueo IX', 'Herramientas Netherita Eficiencia XVI, Fortuna XII', '1 Beacon, 1 Shulker, 18 gapples, 2 notch apples, 6 Tótems', '$300,000 ₯ al reclamar. Hereda anteriores'] },
    { id: 'afrodita', category: 'monthly', tier: 6, name: 'Afrodita', badge: 'Economía', clp: 31990, usd: 31.99, featured: false, accent: 'pink', summary: 'Domina la economía del servidor. Repara tus armas gratis, vende al instante y abre tiendas sin pagar tarifas.', includes: ['12 homes y 15 warps de jugador (/pw)', 'Comando /repair gratis para reparar en mano', 'Comando /sell para vender al server', 'Abre ChestShop sin pagar fee inicial ($100 ₯)', '6 regiones de protección de 353x353', 'Kit (24h): Elytra mítica Unbreaking V, Mending IV', 'Armadura Netherita Protec XXII, Irromp X, Espinas VII', 'Espada Netherita Sharpness XXIV, Saqueo X', 'Herramientas Netherita Eficiencia XVIII, Fortuna XIV', '2 Beacons, 2 Shulkers, 24 gapples, 3 notch apples, 8 Tótems', '$500,000 ₯ al reclamar. Hereda anteriores'] },
    { id: 'zeus', category: 'monthly', tier: 7, name: 'Zeus', badge: 'Rango top', clp: 44990, usd: 44.99, featured: true, accent: 'gold', summary: 'El rango insignia de DrakesCraft. El poder total del Olimpo bajo tu control.', includes: ['20 homes, 25 warps de jugador (/pw)', '/repair all y /heal al instante', '/near y conserva inventario al morir (keepinv)', 'Exención de impuestos en transacciones ChestShop', '7 regiones de protección de 481x481', 'Kit (24h): Netherita definitiva Protec XXX, Irromp XII, Espinas X', 'Espada del Olimpo Sharpness XXX, Saqueo XII, Fire Aspect V, Knockback III', 'Pico Efic XX + Fortune XVI y Pico Efic XX + Silk Touch', 'Arco del Olimpo Poder XX, Infinidad y Elytra Unbreaking V + Mending IV', '3 Beacons, 3 Shulkers, 32 gapples, 8 notch apples, 12 Tótems', '$1,000,000 ₯ al reclamar. Hereda anteriores'] },
    
    { id: 'minero', category: 'roles', tier: 3, name: 'Rol: Minero', badge: 'Subrango', clp: 2990, usd: 2.99, featured: false, accent: 'bronze', summary: 'El devorador de minas. Ideal para recolectores masivos. Agrega prefijo secundario en el chat.', includes: ['Prefijo [⛏ MINERO] secundario en el chat', 'Kit (24h): Pico Explosivo Élite (3x3 Slimefun) Eficiencia X + Irrompibilidad X (Irrompible)', 'Poción de Prisa Minera II (Haste II) de larga duración', 'Poción de Visión Nocturna', 'Materiales: 64 Hierros crudos, 64 Carbones, 32 Oros crudos, 8 Diamantes'] },
    { id: 'cazador', category: 'roles', tier: 3, name: 'Rol: Cazador', badge: 'Subrango', clp: 2990, usd: 2.99, featured: false, accent: 'rose', summary: 'El azote de los monstruos. Ideal para granjas de mobs y caza.', includes: ['Prefijo [⚔ CAZADOR] secundario en el chat', 'Kit (24h): 2 Atrapamobs Místicos de Slimefun', 'Espada del Cazador de Diamante Sharpness VII, Saqueo V', 'Arco con Poder VII y Retroceso II (Punch II)', 'Poción de Fuerza II y 128 Flechas'] },
    { id: 'constructor', category: 'roles', tier: 3, name: 'Rol: Constructor', badge: 'Subrango', clp: 2990, usd: 2.99, featured: false, accent: 'violet', summary: 'Diseñado para arquitectos de imperios y constructores.', includes: ['Prefijo [⚒ CONSTRUCTOR] secundario en el chat', 'Kit (24h): 1 Varita del Constructor de Slimefun', 'Materiales: 128 Hormigón Blanco, 128 Cristales, 128 Ladrillos de Piedra y madera variada'] },
    { id: 'lenador', category: 'roles', tier: 3, name: 'Rol: Leñador', badge: 'Subrango', clp: 2990, usd: 2.99, featured: false, accent: 'ember', summary: 'El destructor de bosques. Talarás madera en segundos.', includes: ['Prefijo [🪓 LEÑADOR] secundario en el chat', 'Kit (24h): Hacha del Leñador Loco de netherita con Eficiencia X, Irrompibilidad X y Sharpness VIII', '1 Grifo de Árbol (Tree Tap) de Slimefun para extraer savias', 'Materiales: 128 Troncos de roble y 128 de abeto'] },
    { id: 'alquimista', category: 'roles', tier: 3, name: 'Rol: Alquimista', badge: 'Subrango', clp: 2990, usd: 2.99, featured: false, accent: 'cyan', summary: 'El maestro de las pócimas y brebajes.', includes: ['Prefijo [🧪 ALQUIMISTA] secundario en el chat', 'Kit (24h): 1 Alambique y 64 botellas de vidrio', 'Reactivos: 32 Blaze Powder, 32 Nether Wart, 32 Glowstone', '32 Redstone, 16 Gunpowder y 4 Aliento de Dragón', 'Pociones de Velocidad II, Regeneración II y Fuerza II'] },
    { id: 'nomada', category: 'roles', tier: 3, name: 'Rol: Nómada', badge: 'Subrango', clp: 2990, usd: 2.99, featured: false, accent: 'pink', summary: 'El jinete errante. Ideal para explorar y viajar a caballo.', includes: ['Prefijo [⛺ NÓMADA] secundario en el chat', 'Kit (24h): Montura de caballo, armadura dorada para caballo, rienda y catalejo', '48 zanahorias doradas para tu montura', 'Armadura del Nómada de cuero con Protección VIII, Irrompibilidad X y Feather Falling X'] },

    { id: 'kit-hermes', category: 'kits', tier: 3, name: 'Kit Hermes', badge: 'Movilidad', clp: 5990, usd: 5.99, featured: true, accent: 'violet', summary: 'Equipo de diamante premium bendecido por Hermes, enfocado en viajar.', includes: ['Botas con Feather Falling X y Soul Speed IV', 'Pico Eficiencia XII + Fortune VIII', 'Arco Power XII + Infinity', 'Shulker, cohetes, totems y comida premium'] },
    { id: 'kit-zeus', category: 'kits', tier: 7, name: 'Kit Zeus', badge: 'Mítico', clp: 14990, usd: 14.99, featured: true, accent: 'gold', summary: 'Netherita del Olimpo con herramientas extremas de línea alta.', includes: ['Protección XXX y Espinas X', 'Sharpness XXX + Looting XII', 'Doble pico Eficiencia XX', 'Beacons, shulkers, totems y recursos premium'] },
    { id: 'protection-177', category: 'protection', tier: 4, name: 'Protección 177x177', badge: 'Base seria', clp: 3990, usd: 3.99, featured: false, accent: 'ember', summary: 'Terreno consagrado (177x177) para bases y templos medianos.', includes: ['Área cuadrada de 177x177 bloques', 'Pensada para farms y almacenes técnicos', 'Entrega rápida por staff en el servidor', 'Revisión y ayuda de ubicación incluida'] },
    { id: 'protection-481', category: 'protection', tier: 7, name: 'Protección 481x481', badge: 'Colosal', clp: 11990, usd: 11.99, featured: true, accent: 'gold', summary: 'Territorio colosal (481x481) para acrópolis, ciudades o gremios.', includes: ['Área cuadrada de 481x481 bloques', 'Ideal para clanes o ciudades grandiosas', 'Entrega manual supervisada por admin', 'No invade claims activos existentes'] },
    
    { id: 'utility-economy', category: 'utility', tier: 6, name: 'Economía Premium', badge: 'Perks', clp: 6990, usd: 6.99, featured: false, accent: 'pink', summary: 'Beneficios comerciales perpetuos para mercaderes hábiles.', includes: ['Creación de ChestShop sin pagar fee inicial', 'Menor fricción y mejores tasas para vender', 'Soporte prioritario ante bugs de economía', 'Beneficio estético y chat con color'] },
    { id: 'dragmas-saco', category: 'utility', tier: 3, name: 'Saco de Dragmas (50.000 ₯)', badge: 'Comercio', clp: 1990, usd: 1.99, featured: false, accent: 'bronze', summary: 'Un saco mediano de dragmas de plata para impulsar tu economía.', includes: ['50.000 Dragmas (₯) depositados en el juego', 'Comercio instantáneo en tiendas de jugadores', 'Ideal para compra de materias primas', 'Entrega automatizada vía comando o ticket'] },
    { id: 'dragmas-cofre', category: 'utility', tier: 5, name: 'Cofre de Dragmas (250.000 ₯)', badge: 'Popular', clp: 7990, usd: 7.99, featured: true, accent: 'violet', summary: 'Cofre robusto de dragmas con un 20% de descuento incluido.', includes: ['250.000 Dragmas (₯) depositados en el juego', 'Mayor capital para comprar claims o máquinas', 'Descuento por volumen pre-aplicado', 'Entrega automatizada vía comando o ticket'] },
    { id: 'dragmas-anfora', category: 'utility', tier: 7, name: 'Ánfora de Dragmas (1.000.000 ₯)', badge: 'Olimpo', clp: 24990, usd: 24.99, featured: true, accent: 'gold', summary: 'La ánfora colosal del templo para los más influyentes. Ahorra 37%.', includes: ['1.000.000 Dragmas (₯) depositados en el juego', 'Máximo poder adquisitivo en el servidor', 'Comercio pesado y compra de items míticos', 'Entrega automatizada vía comando o ticket'] },

    { id: 'economy-comida', category: 'economy-kits', tier: 1, name: 'Kit Comida', badge: 'Survival In-Game', clp: null, usd: null, coins: 1000, featured: false, accent: 'bronze', summary: 'Provisiones básicas de comida para tus viajes. Adquirible en el juego.', includes: ['32 Filetes cocinados', '16 Zanahorias doradas', '32 Panes', '16 Galletas', 'Cooldown de uso: 30 minutos'] },
    { id: 'economy-madera', category: 'economy-kits', tier: 1, name: 'Kit Madera', badge: 'Survival In-Game', clp: null, usd: null, coins: 2000, featured: false, accent: 'rose', summary: 'Lote de madera variada para construcción. Adquirible en el juego.', includes: ['64 Troncos de roble', '64 Troncos de abeto', '64 Troncos de abedul', '64 Troncos de roble oscuro', 'Cooldown de uso: 30 minutos'] },
    { id: 'economy-piedra', category: 'economy-kits', tier: 1, name: 'Kit Piedra', badge: 'Survival In-Game', clp: null, usd: null, coins: 2000, featured: false, accent: 'violet', summary: 'Bloques de piedra labrada para tus estructuras. Adquirible en el juego.', includes: ['64 Smooth Stone', '64 Stone Bricks', '64 Mossy Stone Bricks', '64 Deepslate Bricks', 'Cooldown de uso: 30 minutos'] },
    { id: 'economy-armadura', category: 'economy-kits', tier: 1, name: 'Kit Armadura', badge: 'Survival In-Game', clp: null, usd: null, coins: 5000, featured: false, accent: 'ember', summary: 'Set de armadura de hierro reforzado para supervivencia. Adquirible en el juego.', includes: ['Casco de hierro con Protección V, Irromp V', 'Pechera de hierro con Protección V, Irromp V', 'Grebas de hierro con Protección V, Irromp V', 'Botas de hierro con Protección V, Irromp V', 'Cooldown de uso: 1 hora'] },

    { id: 'custom-slimefun', category: 'custom', tier: 5, name: 'Encargo Slimefun (Cotización)', badge: 'Manual', clp: null, usd: null, featured: false, accent: 'cyan', summary: 'Encargos específicos de máquinas avanzadas o componentes técnicos.', includes: ['Precio final calculado post-evaluación', 'Apertura de ticket en Discord requerida', 'Viabilidad técnica revisada por admins', 'Precios de referencia: 50k a 300k Dragmas'] },
    { id: 'custom-guild', category: 'custom', tier: 5, name: 'Pack de Gremio (Cotización)', badge: 'Manual', clp: null, usd: null, featured: false, accent: 'violet', summary: 'Paquete personalizado de claims contiguos, canales de Discord VIP y perks para grupos.', includes: ['Cotización en base al número de integrantes', 'Entrevista inicial obligatoria con el Staff', 'No se aprueba contenido pay-to-win', 'Coordinación directa para la entrega'] }
  ]
};

async function loadVisits() {
  try {
    const stored = JSON.parse(await fs.readFile(counterFile, 'utf8'));
    visits = Number.isFinite(stored.visits) ? stored.visits : 0;
  } catch (error) {
    if (error.code !== 'ENOENT') app.log.warn(error, 'No se pudo leer el contador');
  }
}

async function saveVisits() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(counterFile, JSON.stringify({ visits }), 'utf8');
  } catch (error) {
    app.log.error(error, 'No se pudo guardar el contador');
  }
}

async function getDiscord() {
  if (discordCache.value && discordCache.expiresAt > Date.now()) return discordCache.value;
  const response = await fetch(discordUrl, {
    headers: { 'User-Agent': 'DrakesCraft-Web/2.0' },
    signal: AbortSignal.timeout(7000)
  });
  if (!response.ok) throw new Error(`Discord respondio ${response.status}`);
  const source = await response.json();
  const value = {
    name: source.name,
    invite: source.instant_invite,
    online: source.presence_count || 0,
    listed: Array.isArray(source.members) ? source.members.length : 0,
    channels: (source.channels || []).slice(0, 12).map(({ id, name }) => ({ id, name })),
    members: (source.members || []).slice(0, 16).map(({ username, status, avatar_url, game }) => ({
      username,
      status,
      avatarUrl: avatar_url,
      activity: game?.name || null
    }))
  };
  discordCache = { value, expiresAt: Date.now() + 45_000 };
  return value;
}

await loadVisits();

app.addHook('onSend', async (_request, reply) => {
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  reply.header('X-Frame-Options', 'SAMEORIGIN');
  reply.header('X-XSS-Protection', '1; mode=block');
  reply.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src * data:; font-src 'self' data:; connect-src 'self' https://discord.com;");
});

app.get('/api/health', async () => ({
  status: 'ok',
  service: 'drakescraft-web',
  uptimeSeconds: Math.round(process.uptime())
}));

app.get('/api/overview', async (request, reply) => {
  const seen = request.headers.cookie?.includes('drakes_seen=1');
  if (!seen) {
    visits += 1;
    await saveVisits();
    reply.header('Set-Cookie', 'drakes_seen=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure');
  }
  return {
    visits,
    region: request.headers['cf-region'] || request.headers['cf-ipcountry'] || 'La Odisea',
    city: request.headers['cf-ipcity'] || null,
    deployment: 'star',
    transport: 'Cloudflare Tunnel'
  };
});

app.get('/api/discord', async (_request, reply) => {
  try {
    return await getDiscord();
  } catch (error) {
    app.log.warn(error, 'Discord no disponible');
    reply.code(503);
    return { error: 'Discord no disponible temporalmente' };
  }
});

app.get('/api/store', async () => {
  const monthly = storeCatalog.products.filter((product) => product.category === 'monthly');
  const minPrice = Math.min(...monthly.map((product) => product.clp).filter(Number.isFinite));
  const maxPrice = Math.max(...monthly.map((product) => product.clp).filter(Number.isFinite));
  return {
    ...storeCatalog,
    summary: {
      products: storeCatalog.products.length,
      monthlyRanks: monthly.length,
      minPrice,
      maxPrice
    }
  };
});

app.post('/api/store/quote', async (request, reply) => {
  const body = request.body || {};
  const selectedIds = Array.isArray(body.items) ? body.items.slice(0, 12) : [];
  const validIds = new Set(storeCatalog.products.map((product) => product.id));
  const items = selectedIds.filter((id) => validIds.has(id));
  const nick = String(body.nick || '').trim().slice(0, 40);
  const contact = String(body.contact || '').trim().slice(0, 80);
  const notes = String(body.notes || '').trim().slice(0, 500);

  if (!items.length) return reply.code(400).send({ error: 'Selecciona al menos un producto.' });
  if (body.website) return reply.code(204).send();

  const quote = {
    id: `dq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    ipCountry: request.headers['cf-ipcountry'] || null,
    nick,
    contact,
    items,
    notes
  };

  await fs.mkdir(dataDir, { recursive: true });
  await fs.appendFile(quoteFile, `${JSON.stringify(quote)}\n`, 'utf8');

  const selected = storeCatalog.products.filter((product) => items.includes(product.id));
  const total = selected.reduce((sum, product) => sum + (Number.isFinite(product.clp) ? product.clp : 0), 0);

  // Notificar cotización manual por Discord webhook
  await notifyQuoteDiscord({
    type: 'Nueva Solicitud (Ticket Manual)',
    quoteId: quote.id,
    items: selected,
    nick,
    contact,
    notes,
    total,
    currency: 'CLP'
  });

  return {
    ok: true,
    quoteId: quote.id,
    discordUrl: storeCatalog.payment.discord,
    total,
    ticketMessage: [
      `Solicitud tienda DrakesCraft ${quote.id}`,
      nick ? `Nick: ${nick}` : null,
      contact ? `Contacto: ${contact}` : null,
      `Items: ${selected.map((product) => product.name).join(', ')}`,
      notes ? `Notas: ${notes}` : null
    ].filter(Boolean).join('\n')
  };
});

async function notifyQuoteDiscord({ type, quoteId, items, nick, contact, notes, total, currency }) {
  const webhook = process.env.DISCORD_PAYMENTS_WEBHOOK;
  if (!webhook) return;

  const names = items.map(p => p.name).join(', ');
  const formattedAmount = currency === 'CLP' 
    ? `$${total.toLocaleString('es-CL')} CLP` 
    : `$${total.toFixed(2)} USD`;
  
  let emoji = '📝';
  let color = 10181046; // Violeta para cotización manual
  
  if (type.includes('Mercado Pago')) {
    color = 40675; // Celeste Mercado Pago
    emoji = '🔵';
  } else if (type.includes('PayPal')) {
    color = 12423; // Azul PayPal
    emoji = '🟡';
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'DrakesCraft · Portal',
        avatar_url: 'https://web.drakescraft.cl/assets/logo-drakescraft.png',
        embeds: [{
          title: `${emoji} ${type}`,
          description: `Se ha generado una solicitud para adquirir: **${names}**`,
          color,
          thumbnail: { url: 'https://web.drakescraft.cl/assets/logo-drakescraft.png' },
          fields: [
            { name: '🎮 Nick de Minecraft', value: `\`${nick || 'No especificado'}\``, inline: true },
            { name: '💬 Medio de Contacto', value: `\`${contact || 'No especificado'}\``, inline: true },
            { name: '💰 Valor Estimado', value: `**${formattedAmount}**`, inline: true },
            { name: '🔑 ID de Solicitud', value: `\`${quoteId}\``, inline: false },
            { name: '📝 Notas Adicionales', value: notes ? `>>> ${notes}` : '*Sin comentarios.*', inline: false },
          ],
          footer: { text: `DrakesCraft · Portal de Pagos · ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}` }
        }]
      })
    });
    if (!res.ok) {
      const text = await res.text();
      app.log.warn({ status: res.status, text }, 'Discord webhook returned non-2xx response');
    }
  } catch (err) {
    app.log.error(err, 'Error sending to Discord webhook');
  }
}



// ─── MercadoPago Configuration ───────────────────────────────────────────────
const mpAccessToken = process.env.MP_ACCESS_TOKEN;
let mp = null;
if (mpAccessToken) {
  mp = new MercadoPagoConfig({ accessToken: mpAccessToken });
}

// ─── PayPal Configuration ───────────────────────────────────────────────────
const paypalClientId = process.env.PAYPAL_CLIENT_ID;
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
const paypalMode = process.env.PAYPAL_MODE || 'live'; // por defecto live
const paypalBaseUrl = paypalMode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function getPaypalAccessToken() {
  if (!paypalClientId || !paypalClientSecret) {
    throw new Error('PayPal Client ID o Secret no configurados');
  }
  const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
  const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error al obtener access token de PayPal: ${errText}`);
  }
  const data = await response.json();
  return data.access_token;
}

async function notifyPaymentDiscord({ platform, paymentId, status, items, nick, contact, amount, currency }) {
  const webhook = process.env.DISCORD_PAYMENTS_WEBHOOK;
  if (!webhook) return;

  const names = items.map(p => p.name).join(', ');
  const isApproved = status === 'approved' || status === 'COMPLETED';
  const emoji = isApproved ? '🟢' : '🔴';
  const statusLabel = isApproved ? 'Aprobado / Completado' : `Pendiente/Rechazado (${status})`;
  const color = isApproved ? 3066993 : 15158332; // Verde esmeralda (#2ecc71) o Rojo/naranja (#e74c3c)
  const formattedAmount = currency === 'CLP' 
    ? `$${amount.toLocaleString('es-CL')} CLP` 
    : `$${amount.toFixed(2)} USD`;

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'DrakesCraft · Pagos',
        avatar_url: 'https://web.drakescraft.cl/assets/logo-drakescraft.png',
        embeds: [{
          title: `${emoji} Pago Recibido — ${platform}`,
          description: `¡Se ha completado una transacción con éxito para: **${names}**!`,
          color,
          thumbnail: { url: 'https://web.drakescraft.cl/assets/logo-drakescraft.png' },
          fields: [
            { name: '🎮 Nick del Jugador', value: `\`${nick || '—'}\``, inline: true },
            { name: '💬 Contacto', value: `\`${contact || '—'}\``, inline: true },
            { name: '💰 Monto Pagado', value: `**${formattedAmount}**`, inline: true },
            { name: '🏦 Pasarela', value: `\`${platform}\``, inline: true },
            { name: '📊 Estado del Pago', value: `\`${statusLabel}\``, inline: true },
            { name: '🔑 ID de Transacción', value: `\`${paymentId}\``, inline: false },
          ],
          footer: { text: `DrakesCraft · Portal de Pagos · ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}` }
        }]
      })
    });
    if (!res.ok) {
      const text = await res.text();
      app.log.warn({ status: res.status, text }, 'Discord payments webhook returned non-2xx response');
    }
  } catch (err) {
    app.log.error(err, 'Error sending payment to Discord webhook');
  }
}

// POST /api/store/checkout — crea preferencia de pago en MP y devuelve init_point
app.post('/api/store/checkout', async (request, reply) => {
  const body = request.body || {};
  const selectedIds = Array.isArray(body.items) ? body.items.slice(0, 12) : [];
  const validIds = new Set(storeCatalog.products.map(p => p.id));
  const items = storeCatalog.products.filter(p => selectedIds.includes(p.id) && validIds.has(p.id) && Number.isFinite(p.clp));
  const nick = String(body.nick || '').trim().slice(0, 40);
  const contact = String(body.contact || '').trim().slice(0, 80);
  const notes = String(body.notes || '').trim().slice(0, 500);

  if (body.website) return reply.code(204).send();
  if (!items.length) return reply.code(400).send({ error: 'Selecciona al menos un producto con precio.' });
  if (!mp) return reply.code(503).send({ error: 'Pagos locales con Mercado Pago no configurados.' });

  const quoteId = `dq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  
  try {
    const pref = new Preference(mp);
    const prefData = await pref.create({ body: {
      external_reference: quoteId,
      items: items.map(p => ({
        id: p.id,
        title: `DrakesCraft — ${p.name}`,
        quantity: 1,
        unit_price: p.clp,
        currency_id: 'CLP'
      })),
      payer: { name: nick || undefined, email: contact?.includes('@') ? contact : undefined },
      back_urls: {
        success: 'https://web.drakescraft.cl/store.html?payment=success',
        failure: 'https://web.drakescraft.cl/store.html?payment=failure',
        pending: 'https://web.drakescraft.cl/store.html?payment=pending'
      },
      auto_return: 'approved',
      notification_url: 'https://web.drakescraft.cl/api/mp/webhook',
      metadata: { nick, contact, notes, quoteId }
    }});

    const quote = { id: quoteId, createdAt: new Date().toISOString(), nick, contact, items: items.map(p => p.id), notes, mpPrefId: prefData.id };
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(quoteFile, `${JSON.stringify(quote)}\n`, 'utf8');

    // Notificar a Discord la intención de pago
    const totalClp = items.reduce((sum, p) => sum + p.clp, 0);
    await notifyQuoteDiscord({
      type: 'Nueva Intención de Pago (Mercado Pago)',
      quoteId,
      items,
      nick,
      contact,
      notes,
      total: totalClp,
      currency: 'CLP'
    });

    return { ok: true, quoteId, init_point: prefData.init_point };
  } catch (err) {
    app.log.error(err, 'mp preference creation error');
    return reply.code(500).send({ error: 'Error al generar preferencia de Mercado Pago.' });
  }
});

// POST /api/mp/webhook — recibe notificaciones de pago de MercadoPago
app.post('/api/mp/webhook', async (request, reply) => {
  reply.code(200).send('ok'); // responder rápido a MP
  const body = request.body || {};
  if (body.type !== 'payment' || !body.data?.id || !mp) return;

  try {
    const paymentApi = new Payment(mp);
    const payment = await paymentApi.get({ id: String(body.data.id) });
    const logFile = path.join(dataDir, 'mp-payments.jsonl');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(logFile, `${JSON.stringify({ ts: new Date().toISOString(), ...payment })}\n`, 'utf8');

    if (payment.status === 'approved' || payment.status === 'in_process') {
      const meta = payment.metadata || {};
      const nick = meta.nick || payment.external_reference || '';
      const contact = meta.contact || '';
      const itemIds = Array.isArray(payment.additional_info?.items)
        ? payment.additional_info.items.map(i => i.id)
        : [];
      const items = storeCatalog.products.filter(p => itemIds.includes(p.id));
      await notifyPaymentDiscord({
        platform: 'Mercado Pago',
        paymentId: payment.id,
        status: payment.status,
        items,
        nick,
        contact,
        amount: payment.transaction_amount,
        currency: 'CLP'
      });

      // Agregar a la cola de entregas automáticas
      if (payment.status === 'approved') {
        const pending = await loadPendingPurchases();
        for (const item of items) {
          const txnId = `mp_${payment.id}_${item.id}`;
          if (!pending.some(p => p.id === txnId)) {
            pending.push({
              id: txnId,
              nick,
              productId: item.id,
              productName: item.name,
              timestamp: new Date().toISOString()
            });
          }
        }
        await savePendingPurchases(pending);
      }
    }
  } catch (err) {
    app.log.warn(err, 'mp webhook error');
  }
});

// POST /api/store/paypal/checkout — crea preferencia de pago en PayPal y devuelve init_point
app.post('/api/store/paypal/checkout', async (request, reply) => {
  const body = request.body || {};
  const selectedIds = Array.isArray(body.items) ? body.items.slice(0, 12) : [];
  const validIds = new Set(storeCatalog.products.map(p => p.id));
  const items = storeCatalog.products.filter(p => selectedIds.includes(p.id) && validIds.has(p.id) && Number.isFinite(p.usd));
  const nick = String(body.nick || '').trim().slice(0, 40);
  const contact = String(body.contact || '').trim().slice(0, 80);
  const notes = String(body.notes || '').trim().slice(0, 500);

  if (body.website) return reply.code(204).send();
  if (!items.length) return reply.code(400).send({ error: 'Selecciona al menos un producto con precio en USD.' });
  if (!paypalClientId || !paypalClientSecret) {
    return reply.code(503).send({ error: 'Pagos internacionales con PayPal no configurados.' });
  }

  const totalUsd = items.reduce((sum, p) => sum + p.usd, 0);
  const quoteId = `dq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  try {
    const accessToken = await getPaypalAccessToken();
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: quoteId,
          amount: {
            currency_code: 'USD',
            value: totalUsd.toFixed(2)
          },
          description: `DrakesCraft — ${items.map(p => p.name).join(', ')}`,
          custom_id: JSON.stringify({ nick, contact, notes, quoteId })
        }],
        application_context: {
          brand_name: 'DrakesCraft',
          locale: 'es-ES',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: 'https://web.drakescraft.cl/store.html?payment=paypal-success',
          cancel_url: 'https://web.drakescraft.cl/store.html?payment=paypal-cancel'
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      app.log.warn({ errText }, 'Error al crear orden de PayPal');
      return reply.code(500).send({ error: 'Error al crear orden en la pasarela de PayPal.' });
    }

    const order = await response.json();
    const approveLink = order.links.find(l => l.rel === 'approve')?.href;

    const quote = { id: quoteId, createdAt: new Date().toISOString(), nick, contact, items: items.map(p => p.id), notes, paypalOrderId: order.id };
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(quoteFile, `${JSON.stringify(quote)}\n`, 'utf8');

    // Notificar a Discord la intención de pago
    await notifyQuoteDiscord({
      type: 'Nueva Intención de Pago (PayPal)',
      quoteId,
      items,
      nick,
      contact,
      notes,
      total: totalUsd,
      currency: 'USD'
    });

    return { ok: true, quoteId, init_point: approveLink, orderId: order.id };
  } catch (err) {
    app.log.error(err, 'paypal checkout creation error');
    return reply.code(500).send({ error: 'Error interno de PayPal.' });
  }
});

// POST /api/store/paypal/capture — captura el pago de PayPal una vez aprobado
app.post('/api/store/paypal/capture', async (request, reply) => {
  const body = request.body || {};
  const orderId = body.orderId;
  if (!orderId) return reply.code(400).send({ error: 'Falta orderId' });

  try {
    const accessToken = await getPaypalAccessToken();
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      app.log.warn({ errText }, 'Error al capturar orden de PayPal');
      return reply.code(500).send({ error: 'No se pudo capturar el pago en la pasarela de PayPal.' });
    }

    const order = await response.json();
    const logFile = path.join(dataDir, 'paypal-payments.jsonl');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(logFile, `${JSON.stringify({ ts: new Date().toISOString(), ...order })}\n`, 'utf8');

    if (order.status === 'COMPLETED') {
      const purchaseUnit = order.purchase_units?.[0] || {};
      const customId = purchaseUnit.custom_id;
      let nick = '';
      let contact = '';
      let notes = '';
      let quoteId = '';

      try {
        if (customId) {
          const meta = JSON.parse(customId);
          nick = meta.nick || '';
          contact = meta.contact || '';
          notes = meta.notes || '';
          quoteId = meta.quoteId || '';
        }
      } catch (_) {}

      const captureDetails = purchaseUnit.payments?.captures?.[0] || {};
      const total = parseFloat(captureDetails.amount?.value || 0);

      // Cargar items de la cotización si es posible
      let items = [];
      try {
        const quotesContent = await fs.readFile(quoteFile, 'utf8');
        for (const line of quotesContent.split('\n')) {
          if (!line.trim()) continue;
          const q = JSON.parse(line);
          if (q.id === quoteId || q.paypalOrderId === orderId) {
            items = storeCatalog.products.filter(p => q.items.includes(p.id));
            break;
          }
        }
      } catch (_) {}

      // Si no los pudimos mapear, usar descripcion o nombres genericos
      if (!items.length) {
        items = [{ name: `Pedido PayPal (${orderId})` }];
      }

      await notifyPaymentDiscord({
        platform: 'PayPal',
        paymentId: order.id,
        status: order.status,
        items,
        nick,
        contact,
        amount: total,
        currency: 'USD'
      });

      // Agregar a la cola de entregas automáticas
      const pending = await loadPendingPurchases();
      for (const item of items) {
        if (!item.id) continue;
        const txnId = `pp_${order.id}_${item.id}`;
        if (!pending.some(p => p.id === txnId)) {
          pending.push({
            id: txnId,
            nick,
            productId: item.id,
            productName: item.name,
            timestamp: new Date().toISOString()
          });
        }
      }
      await savePendingPurchases(pending);

      return { ok: true, status: 'COMPLETED', orderId: order.id };
    }

    return { ok: false, status: order.status };
  } catch (err) {
    app.log.error(err, 'paypal capture error');
    return reply.code(500).send({ error: 'Error interno al capturar pago de PayPal.' });
  }
});

const storeApiKey = process.env.STORE_API_KEY || 'drakescraft-default-secret-key-12345';
const pendingPurchasesFile = path.join(dataDir, 'pending-purchases.json');

async function loadPendingPurchases() {
  try {
    const data = await fs.readFile(pendingPurchasesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code !== 'ENOENT') app.log.warn(error, 'No se pudo leer las compras pendientes');
    return [];
  }
}

async function savePendingPurchases(list) {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(pendingPurchasesFile, JSON.stringify(list, null, 2), 'utf8');
  } catch (error) {
    app.log.error(error, 'No se pudo guardar las compras pendientes');
  }
}

// GET /api/store/pending
app.get('/api/store/pending', async (request, reply) => {
  const key = request.headers['x-api-key'] || request.query.key;
  if (!key || key !== storeApiKey) {
    return reply.code(401).send({ error: 'No autorizado' });
  }
  const pending = await loadPendingPurchases();
  return pending;
});

// POST /api/store/confirm
app.post('/api/store/confirm', async (request, reply) => {
  const key = request.headers['x-api-key'] || request.query.key;
  if (!key || key !== storeApiKey) {
    return reply.code(401).send({ error: 'No autorizado' });
  }
  const body = request.body || {};
  const id = body.id;
  if (!id) {
    return reply.code(400).send({ error: 'Falta id de transaccion' });
  }
  const pending = await loadPendingPurchases();
  const filtered = pending.filter(p => p.id !== id);
  await savePendingPurchases(filtered);
  return { ok: true };
});

await app.register(fastifyStatic, {
  root,
  wildcard: false,
  index: ['index.html'],
  maxAge: '1h',
  immutable: false,
  allowedPath: (pathname) => {
    const publicFiles = new Set([
      'index.html',
      'rules.html',
      'store.html',
      'styles-3-2.css',
      'script-3-2.js',
      'styles-3-3.css',
      'script-3-3.js',
      'bannerdrakes.jpg',
      'dragon_fly.png',
      'logodrakescraft.png',
      'previewdiscord1.png',
      'previewdiscord2.png'
    ]);
    const normalized = pathname.replace(/^[/\\]+/, '').replaceAll('\\', '/');
    return publicFiles.has(normalized) || normalized.startsWith('assets/');
  }
});

app.setNotFoundHandler((request, reply) => {
  if (request.raw.url?.startsWith('/api/')) return reply.code(404).send({ error: 'Ruta no encontrada' });
  const requestedPath = request.raw.url?.split('?')[0] || '';
  if (path.extname(requestedPath)) return reply.code(404).send('Not found');
  return reply.sendFile('index.html');
});

try {
  await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT || 8080) });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
