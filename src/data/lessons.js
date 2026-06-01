// ──────────────────────────────────────────────────────────────────────────
//  CURSO: SUECO PARA CAMAREROS de Strömstad Spa & Resort
//
//  Diseño PROGRESIVO estilo Duolingo:
//   · Sección 1-3 → palabras sueltas (saludos, sustantivos, verbos, números).
//   · Sección 4   → primeras frases CORTAS, hechas solo con palabras ya vistas.
//   · Sección 5-6 → el menú real, plato a plato.
//   · Sección 7   → bebidas (carta) y cierre de cuenta.
//
//  Cada item: { sv, es, hint? }
//    sv = sueco · es = español · hint = pista/precio/contexto
//  El motor genera los ejercicios (elegir, escuchar, emparejar, ordenar).
// ──────────────────────────────────────────────────────────────────────────

const baseUnits = [
  // ════════════════ SECCIÓN 1 · Primeras palabras ════════════════
  {
    id: 'saludos',
    section: '1 · Primeras palabras',
    title: 'Saludos',
    subtitle: 'Hej!',
    color: '#58cc02',
    icon: '👋',
    items: [
      { sv: 'Hej', es: 'Hola' },
      { sv: 'Hej hej', es: 'Hola (más cálido)' },
      { sv: 'God morgon', es: 'Buenos días' },
      { sv: 'God kväll', es: 'Buenas noches' },
      { sv: 'Hej då', es: 'Adiós' },
      { sv: 'Vi ses', es: 'Hasta luego' },
    ],
  },
  {
    id: 'cortesia',
    section: '1 · Primeras palabras',
    title: 'Cortesía',
    subtitle: 'Tack!',
    color: '#58cc02',
    icon: '🙏',
    items: [
      { sv: 'Tack', es: 'Gracias' },
      { sv: 'Tack så mycket', es: 'Muchas gracias' },
      { sv: 'Varsågod', es: 'Aquí tiene / De nada' },
      { sv: 'Ja', es: 'Sí' },
      { sv: 'Nej', es: 'No' },
    ],
  },
  {
    id: 'mas-cortesia',
    section: '1 · Primeras palabras',
    title: 'Disculpas',
    subtitle: 'Ursäkta',
    color: '#58cc02',
    icon: '🤝',
    items: [
      { sv: 'Ursäkta', es: 'Disculpe / Perdón' },
      { sv: 'Förlåt', es: 'Lo siento' },
      { sv: 'Välkommen', es: 'Bienvenido/a' },
      { sv: 'Välkomna', es: 'Bienvenidos (a varios)' },
      { sv: 'Ingen orsak', es: 'No hay de qué' },
    ],
  },

  // ════════════════ SECCIÓN 2 · En el restaurante ════════════════
  {
    id: 'mesa',
    section: '2 · En el restaurante',
    title: 'La mesa',
    subtitle: 'Ett bord',
    color: '#1cb0f6',
    icon: '🍽️',
    items: [
      { sv: 'Ett bord', es: 'Una mesa' },
      { sv: 'En stol', es: 'Una silla' },
      { sv: 'En meny', es: 'Una carta / un menú' },
      { sv: 'En gäst', es: 'Un/a cliente' },
      { sv: 'En servitör', es: 'Un/a camarero/a' },
      { sv: 'En tallrik', es: 'Un plato' },
    ],
  },
  {
    id: 'personas',
    section: '2 · En el restaurante',
    title: 'Personas',
    subtitle: 'Jag, du, ni',
    color: '#1cb0f6',
    icon: '🧑',
    items: [
      { sv: 'Jag', es: 'Yo' },
      { sv: 'Du', es: 'Tú' },
      { sv: 'Ni', es: 'Ustedes / usted (formal)' },
      { sv: 'Vi', es: 'Nosotros' },
      { sv: 'En kollega', es: 'Un/a colega' },
    ],
  },
  {
    id: 'numeros',
    section: '2 · En el restaurante',
    title: 'Números',
    subtitle: 'För hur många?',
    color: '#1cb0f6',
    icon: '🔢',
    items: [
      { sv: 'Ett', es: 'Uno' },
      { sv: 'Två', es: 'Dos' },
      { sv: 'Tre', es: 'Tres' },
      { sv: 'Fyra', es: 'Cuatro' },
      { sv: 'Fem', es: 'Cinco' },
      { sv: 'Sex', es: 'Seis' },
    ],
  },
  {
    id: 'bebidas-palabras',
    section: '2 · En el restaurante',
    title: 'Bebidas (palabras)',
    subtitle: 'Vatten, kaffe…',
    color: '#1cb0f6',
    icon: '🥤',
    items: [
      { sv: 'Vatten', es: 'Agua' },
      { sv: 'Kaffe', es: 'Café' },
      { sv: 'Te', es: 'Té' },
      { sv: 'Öl', es: 'Cerveza' },
      { sv: 'Vin', es: 'Vino' },
      { sv: 'Mjölk', es: 'Leche' },
    ],
  },
  {
    id: 'comida-palabras',
    section: '2 · En el restaurante',
    title: 'Comida (palabras)',
    subtitle: 'Mat, bröd…',
    color: '#1cb0f6',
    icon: '🍞',
    items: [
      { sv: 'Mat', es: 'Comida' },
      { sv: 'Bröd', es: 'Pan' },
      { sv: 'Ost', es: 'Queso' },
      { sv: 'Kött', es: 'Carne' },
      { sv: 'Fisk', es: 'Pescado' },
      { sv: 'Sallad', es: 'Ensalada' },
    ],
  },

  // ════════════════ SECCIÓN 3 · Palabras puente ════════════════
  {
    id: 'verbos',
    section: '3 · Palabras puente',
    title: 'Verbos clave',
    subtitle: 'Vill, ha, dricka',
    color: '#ce82ff',
    icon: '⚡',
    items: [
      { sv: 'Vill', es: 'Quiere / quiero', hint: 'jag vill = yo quiero' },
      { sv: 'Ha', es: 'Tener / tomar', hint: 'vill ha = querer/desear' },
      { sv: 'Dricka', es: 'Beber' },
      { sv: 'Äta', es: 'Comer' },
      { sv: 'Beställa', es: 'Pedir (un plato)' },
      { sv: 'Betala', es: 'Pagar' },
    ],
  },
  {
    id: 'preguntas',
    section: '3 · Palabras puente',
    title: 'Preguntar',
    subtitle: 'Vad? Hur?',
    color: '#ce82ff',
    icon: '❓',
    items: [
      { sv: 'Vad', es: 'Qué' },
      { sv: 'Hur', es: 'Cómo' },
      { sv: 'Hur många', es: 'Cuántos' },
      { sv: 'Något', es: 'Algo' },
      { sv: 'Redo', es: 'Listo/a' },
      { sv: 'Eller', es: 'O' },
    ],
  },
  {
    id: 'utiles',
    section: '3 · Palabras puente',
    title: 'Palabritas útiles',
    subtitle: 'Och, till, en…',
    color: '#ce82ff',
    icon: '🔗',
    items: [
      { sv: 'Och', es: 'Y' },
      { sv: 'Till', es: 'Para / de (postre)' },
      { sv: 'Med', es: 'Con' },
      { sv: 'Utan', es: 'Sin' },
      { sv: 'Strax', es: 'Enseguida' },
      { sv: 'Ett ögonblick', es: 'Un momento' },
    ],
  },

  // ════════════════ SECCIÓN 4 · Primeras frases ════════════════
  {
    id: 'frases-si-no',
    section: '4 · Primeras frases',
    title: 'Sí y no',
    subtitle: 'Ja tack / Nej tack',
    color: '#ff9600',
    icon: '💬',
    items: [
      { sv: 'Ja tack', es: 'Sí, gracias' },
      { sv: 'Nej tack', es: 'No, gracias' },
      { sv: 'Varsågod', es: 'Aquí tiene' },
      { sv: 'Den här vägen', es: 'Por aquí' },
      { sv: 'Jag kommer strax', es: 'Vengo enseguida', hint: 'jag + kommer + strax' },
    ],
  },
  {
    id: 'frases-recibir',
    section: '4 · Primeras frases',
    title: 'Recibir a la mesa',
    subtitle: 'Välkomna!',
    color: '#ff9600',
    icon: '🚪',
    items: [
      { sv: 'Hej och välkomna', es: 'Hola y bienvenidos' },
      { sv: 'För hur många', es: '¿Para cuántos?' },
      { sv: 'Ett bord för två', es: 'Una mesa para dos' },
      { sv: 'Den här vägen, tack', es: 'Por aquí, por favor' },
      { sv: 'Varsågod och sitt', es: 'Siéntense, por favor' },
    ],
  },
  {
    id: 'frases-beber',
    section: '4 · Primeras frases',
    title: 'Tomar la bebida',
    subtitle: 'Vad vill ni dricka?',
    color: '#ff9600',
    icon: '🍷',
    items: [
      { sv: 'Något att dricka', es: '¿Algo de beber?' },
      { sv: 'Vad vill ni dricka', es: '¿Qué desean beber?', hint: 'vad + vill + ni + dricka' },
      { sv: 'Vill ni ha vatten', es: '¿Desean agua?' },
      { sv: 'Öl eller vin', es: '¿Cerveza o vino?' },
      { sv: 'Ett glas vin, tack', es: 'Una copa de vino, por favor' },
    ],
  },
  {
    id: 'frases-pedido',
    section: '4 · Primeras frases',
    title: 'Tomar el pedido',
    subtitle: 'Redo att beställa?',
    color: '#ff9600',
    icon: '📝',
    items: [
      { sv: 'Är ni redo att beställa', es: '¿Están listos para pedir?' },
      { sv: 'Kan jag ta er beställning', es: '¿Puedo tomar su pedido?' },
      { sv: 'Vill ni ha en förrätt', es: '¿Desean un entrante?' },
      { sv: 'Och till efterrätt', es: '¿Y de postre?' },
      { sv: 'Vill ni ha något mer', es: '¿Desean algo más?' },
    ],
  },
  {
    id: 'frases-durante',
    section: '4 · Primeras frases',
    title: 'Durante la comida',
    subtitle: 'Smaklig måltid!',
    color: '#ff9600',
    icon: '😋',
    items: [
      { sv: 'Smaklig måltid', es: '¡Buen provecho!' },
      { sv: 'Smakar det bra', es: '¿Está bueno?' },
      { sv: 'Var det bra så', es: '¿Algo más? / ¿Era todo?' },
      { sv: 'Ett ögonblick, tack', es: 'Un momento, por favor' },
      { sv: 'Har ni några allergier', es: '¿Tienen alguna alergia?' },
    ],
  },

  // ════════════════ SECCIÓN 5 · El menú ════════════════
  {
    id: 'forratter',
    section: '5 · El menú',
    title: 'Entrantes',
    subtitle: 'Förrätter',
    color: '#ec4899',
    icon: '🥗',
    items: [
      { sv: 'Förrätt', es: 'Entrante' },
      { sv: 'Kummelceviche', es: 'Ceviche de merluza', hint: 'Con espino amarillo, pepino y maíz frito · 245 kr' },
      { sv: 'Vit sparris', es: 'Espárragos blancos', hint: 'Al horno con jamón curado · 205 kr' },
      { sv: 'Musselsoppa', es: 'Sopa de mejillones', hint: 'Con hinojo (fänkål) · 245 kr' },
      { sv: 'Rödbetor och getost', es: 'Remolacha y queso de cabra', hint: '255 kr' },
      { sv: 'Gurka', es: 'Pepino' },
      { sv: 'Äpple', es: 'Manzana' },
    ],
  },
  {
    id: 'huvudratter',
    section: '5 · El menú',
    title: 'Platos principales',
    subtitle: 'Huvudrätter',
    color: '#ec4899',
    icon: '🍖',
    items: [
      { sv: 'Huvudrätt', es: 'Plato principal' },
      { sv: 'Secreto sriracha', es: 'Secreto de cerdo con sriracha', hint: 'Con espárragos, maíz y salsa de trufa · 395 kr' },
      { sv: 'Grillad kycklingbröst', es: 'Pechuga de pollo a la parrilla', hint: '365 kr' },
      { sv: 'Helgrillad oxfilé', es: 'Solomillo de ternera a la parrilla', hint: 'El plato más caro · 480 kr' },
      { sv: 'Kummel', es: 'Merluza', hint: 'Con costra de hierbas y salsa de eneldo · 385 kr' },
      { sv: 'Grillad spetskål', es: 'Col puntiaguda a la parrilla', hint: 'Opción vegetariana · 315 kr' },
      { sv: 'Potatis', es: 'Patata' },
      { sv: 'Sås', es: 'Salsa' },
    ],
  },
  {
    id: 'efterratter',
    section: '5 · El menú',
    title: 'Postres',
    subtitle: 'Efterrätter',
    color: '#ec4899',
    icon: '🍰',
    items: [
      { sv: 'Efterrätt', es: 'Postre' },
      { sv: 'Chokladterrin', es: 'Terrina de chocolate', hint: 'Con frambuesa y maracuyá · 135 kr' },
      { sv: 'Svenska ostar', es: 'Quesos suecos', hint: '205 kr' },
      { sv: 'Vaniljpannacotta', es: 'Panna cotta de vainilla', hint: 'Con ruibarbo y fresa · 135 kr' },
      { sv: 'Glass och sorbet', es: 'Helado y sorbete', hint: '125 kr' },
      { sv: 'Hallon', es: 'Frambuesa' },
      { sv: 'Jordgubbar', es: 'Fresas' },
    ],
  },
  {
    id: 'klassiker',
    section: '5 · El menú',
    title: 'Clásicos del marisco',
    subtitle: 'Klassiker',
    color: '#ec4899',
    icon: '🦐',
    items: [
      { sv: 'Moules frites', es: 'Mejillones con patatas', hint: 'Mejillones azules con alioli · 295 kr' },
      { sv: 'Räksmörgås', es: 'Sándwich de gambas', hint: 'Con mayonesa de eneldo y pan de centeno · 275 kr' },
      { sv: 'Maritimusbuffé', es: 'Bufé Maritimus', hint: 'Solo los sábados · 695 kr' },
      { sv: 'Musslor', es: 'Mejillones' },
      { sv: 'Räkor', es: 'Gambas' },
      { sv: 'Pommes frites', es: 'Patatas fritas' },
      { sv: 'Aioli', es: 'Alioli' },
    ],
  },
  {
    id: 'barnmeny',
    section: '5 · El menú',
    title: 'Menú infantil',
    subtitle: 'Barnmeny',
    color: '#ec4899',
    icon: '🧒',
    items: [
      { sv: 'Barnmeny', es: 'Menú infantil' },
      { sv: 'Hamburgare', es: 'Hamburguesa', hint: 'Con pan y patatas · 155 kr' },
      { sv: 'Pasta bolognese', es: 'Pasta boloñesa', hint: '155 kr' },
      { sv: 'Fish & chips', es: 'Pescado con patatas', hint: '155 kr' },
      { sv: 'Pannkakor', es: 'Tortitas', hint: 'Con mermelada y nata · 155 kr' },
      { sv: 'Har ni en barnstol', es: '¿Tienen trona?' },
    ],
  },
  {
    id: 'pizza',
    section: '5 · El menú',
    title: 'Pizzería Dockyard',
    subtitle: 'Pizzor',
    color: '#ec4899',
    icon: '🍕',
    items: [
      { sv: 'Margherita', es: 'Margarita', hint: 'Tomate, mozzarella, albahaca · 185 kr' },
      { sv: 'Parma', es: 'Parma', hint: 'Jamón de Parma, parmesano, rúcula · 215 kr' },
      { sv: 'Capricciosa', es: 'Caprichosa', hint: 'Jamón cocido y champiñones · 195 kr' },
      { sv: 'Diavola', es: 'Diávola', hint: 'Pepperoni y chili tostado · 215 kr' },
      { sv: 'Strömstad Pizza', es: 'Pizza Strömstad', hint: 'Con mejillones, cangrejo y alga · 295 kr' },
      { sv: 'Champinjoner', es: 'Champiñones' },
      { sv: 'Skinka', es: 'Jamón (cocido)' },
    ],
  },
  {
    id: 'bar',
    section: '5 · El menú',
    title: 'Bar y aperitivos',
    subtitle: 'Barmeny',
    color: '#ec4899',
    icon: '🍔',
    items: [
      { sv: 'Ribeye burger', es: 'Hamburguesa ribeye', hint: 'Bacon y queso pepper jack · 275 kr' },
      { sv: 'Caesarsallad med kyckling', es: 'Ensalada César con pollo', hint: '235 kr' },
      { sv: 'Vegetarisk burgare', es: 'Hamburguesa vegetariana', hint: '255 kr' },
      { sv: 'Vitlöksbröd', es: 'Pan de ajo', hint: '105 kr' },
      { sv: 'Oliver', es: 'Aceitunas', hint: '95 kr' },
      { sv: 'Chips med löjrom', es: 'Patatas chips con hueva', hint: '125 kr' },
    ],
  },
  {
    id: 'allergener',
    section: '5 · El menú',
    title: 'Alérgenos',
    subtitle: 'Allergener',
    color: '#ff4b4b',
    icon: '⚠️',
    items: [
      { sv: 'Allergi', es: 'Alergia' },
      { sv: 'Gluten', es: 'Gluten', hint: 'G en la carta' },
      { sv: 'Ägg', es: 'Huevo', hint: 'E en la carta' },
      { sv: 'Skaldjur', es: 'Marisco / crustáceos', hint: 'S en la carta' },
      { sv: 'Nötter', es: 'Frutos secos', hint: 'N en la carta' },
      { sv: 'Vitlök', es: 'Ajo', hint: 'V en la carta' },
      { sv: 'Laktos', es: 'Lactosa' },
      { sv: 'Den är glutenfri', es: 'Es sin gluten' },
    ],
  },

  // ════════════════ SECCIÓN 6 · Bebidas (carta) ════════════════
  {
    id: 'viner',
    section: '6 · Bebidas (carta)',
    title: 'Vinos y espumosos',
    subtitle: 'Viner',
    color: '#a21caf',
    icon: '🍾',
    items: [
      { sv: 'Vitt vin', es: 'Vino blanco', hint: 'Copa desde 165 kr' },
      { sv: 'Rött vin', es: 'Vino tinto', hint: 'Copa desde 165 kr' },
      { sv: 'Rosé', es: 'Rosado' },
      { sv: 'Mousserande', es: 'Espumoso', hint: 'Cava / Prosecco' },
      { sv: 'Ett glas', es: 'Una copa', hint: 'Glas en la carta' },
      { sv: 'En hel flaska', es: 'Una botella entera', hint: '1/1 en la carta' },
      { sv: 'Vill ni se vinlistan', es: '¿Quieren ver la carta de vinos?' },
      { sv: 'Frankrike', es: 'Francia' },
      { sv: 'Spanien', es: 'España' },
      { sv: 'Italien', es: 'Italia' },
    ],
  },
  {
    id: 'ol',
    section: '6 · Bebidas (carta)',
    title: 'Cervezas y sidras',
    subtitle: 'Öl & cider',
    color: '#a21caf',
    icon: '🍺',
    items: [
      { sv: 'En stor öl', es: 'Una cerveza grande', hint: '0,50 l' },
      { sv: 'En liten öl', es: 'Una cerveza pequeña', hint: '0,33 l' },
      { sv: 'Öl på draft', es: 'Cerveza de barril', hint: 'desde 75 kr' },
      { sv: 'På flaska', es: 'En botella' },
      { sv: 'På burk', es: 'En lata' },
      { sv: 'Cider', es: 'Sidra', hint: 'Somersby desde 110 kr' },
      { sv: 'Glutenfri öl', es: 'Cerveza sin gluten' },
      { sv: 'Alkoholfri öl', es: 'Cerveza sin alcohol' },
    ],
  },
  {
    id: 'kaffe-cocktails',
    section: '6 · Bebidas (carta)',
    title: 'Café y cócteles',
    subtitle: 'Kaffe & cocktails',
    color: '#a21caf',
    icon: '☕',
    items: [
      { sv: 'Espresso', es: 'Espresso', hint: 'enkel 54 kr · dubbel 69 kr' },
      { sv: 'Cappuccino', es: 'Capuchino', hint: '63 kr' },
      { sv: 'Kaffe latte', es: 'Café con leche' },
      { sv: 'Varm choklad', es: 'Chocolate caliente', hint: '65 kr' },
      { sv: 'Enkel', es: 'Simple (un café)' },
      { sv: 'Dubbel', es: 'Doble' },
      { sv: 'Avec', es: 'Licor / digestivo', hint: 'Baileys, coñac… 4 cl' },
      { sv: 'Cocktails', es: 'Cócteles', hint: '185 kr' },
      { sv: 'Mocktails', es: 'Cócteles sin alcohol', hint: '130 kr' },
      { sv: 'Läsk', es: 'Refresco' },
    ],
  },

  // ════════════════ SECCIÓN 7 · Cerrar la mesa ════════════════
  {
    id: 'cuenta',
    section: '7 · Cerrar la mesa',
    title: 'La cuenta',
    subtitle: 'Notan, tack',
    color: '#8b5cf6',
    icon: '🧾',
    items: [
      { sv: 'Notan, tack', es: 'La cuenta, por favor' },
      { sv: 'Hur vill ni betala', es: '¿Cómo desean pagar?' },
      { sv: 'Kort eller kontant', es: '¿Tarjeta o efectivo?' },
      { sv: 'Det blir 480 kronor', es: 'Son 480 coronas' },
      { sv: 'Vill ni ha kvitto', es: '¿Desean recibo?' },
      { sv: 'Tack och välkomna åter', es: '¡Gracias y vuelvan pronto!' },
    ],
  },
]

// Banco de distractores y guía: solo las unidades de aprendizaje reales.
export const allItems = baseUnits.flatMap((u) =>
  u.items.map((it) => ({ ...it, unitId: u.id, unitTitle: u.title }))
)

// ──────────────────────────────────────────────────────────────────────────
//  Agrupamos por sección y, al final de cada sección con varias unidades,
//  añadimos una lección de REPASO ⭐ con LO MÁS IMPORTANTE de esa sección
//  (no todo: tomamos los primeros ítems de cada unidad, que son los clave).
// ──────────────────────────────────────────────────────────────────────────
function pickKeyItems(sectionUnits) {
  // 2 ítems clave por unidad (los primeros = los más representativos)…
  const picked = sectionUnits.flatMap((u) => u.items.slice(0, 2))
  // …y como mucho 10 para que el repaso sea ágil, no exhaustivo.
  return picked.slice(0, 10)
}

const grouped = baseUnits.reduce((acc, u) => {
  const key = u.section || 'Otros'
  let sec = acc.find((s) => s.title === key)
  if (!sec) {
    sec = { title: key, units: [] }
    acc.push(sec)
  }
  sec.units.push(u)
  return acc
}, [])

// Insertamos la unidad de repaso en cada sección (si tiene 2+ lecciones).
grouped.forEach((sec, i) => {
  if (sec.units.length < 2) return
  sec.units.push({
    id: `repaso-${i + 1}`,
    section: sec.title,
    isReview: true,
    title: 'Repaso',
    subtitle: 'Lo más importante ⭐',
    color: '#ffc800',
    icon: '⭐',
    items: pickKeyItems(sec.units),
  })
})

export const sections = grouped

// Orden maestro de unidades (lecciones + repasos), para desbloqueo y mapa.
export const units = grouped.flatMap((s) => s.units)
