/**
 * generateStyleRecommendations(outfit)
 *
 * Fully dynamic, category-aware recommendation engine.
 * Reads outfit.name, outfit.fabric, outfit.occasion, outfit.color, outfit.description.
 *
 * Priority order (to avoid cross-category mismatches):
 *   1. Kids  — detected first so "Kids Sherwani" never gets adult wedding recs
 *   2. Men   — sherwani/kurta/blazer in men's context
 *   3. Women — lehenga/saree/gown/dress/ethnic-suit etc.
 *   4. Generic fallback
 *
 * Replace this function body with an AI API call when ready.
 */
export function generateStyleRecommendations(outfit) {
  // ── No outfit selected ─────────────────────────────────────────────────────
  if (!outfit) {
    return {
      score:     80,
      footwear:  'Classic Flats',
      jewellery: 'Simple Stud Earrings',
      handbag:   'Tote Bag',
      hairstyle: 'Natural Loose Hair',
      makeup:    'Natural Glow',
      bestFor:   'Everyday Wear',
      tips: [
        'Keep it simple and comfortable.',
        'Choose neutral accessories.',
        'Light makeup works best.',
      ],
    };
  }

  const name   = (outfit.name        || '').toLowerCase();
  const occ    = (outfit.occasion    || '').toLowerCase();
  const fabric = (outfit.fabric      || '').toLowerCase();
  const color  = (outfit.color       || '').toLowerCase();

  const isSilk     = fabric.includes('silk')   || fabric.includes('satin') || fabric.includes('velvet');
  const fabricBonus = isSilk ? 4 : fabric.includes('wool') ? 3 : fabric.includes('linen') ? 2 : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1 — KIDS (must come first to override adult archetype keywords)
  // ─────────────────────────────────────────────────────────────────────────
  const isKids = (
    name.includes('kids ')    ||
    name.includes('boys ')    ||
    name.includes('girls ')   ||
    name.includes('princess') ||
    name.includes('birthday') ||
    name.includes('frock')    ||
    name.includes('playwear') ||
    name.includes('cartoon')  ||
    // These below appear in kids folder names assigned by getProductDetails
    name.includes('hoodie set') ||
    name.includes('kurta set')  ||
    name.includes('jacket set') ||
    name.includes('denim outfit') ||
    name.includes('cotton set')
  );

  if (isKids) {
    const isKidsEthnic  = name.includes('kurta set') || name.includes('sherwani') || name.includes('ethnic');
    const isKidsFormal  = name.includes('jacket set') || name.includes('blazer');
    const isKidsParty   = name.includes('frock') || name.includes('princess') || name.includes('birthday') || name.includes('gown');

    if (isKidsEthnic) return {
      score: 90,
      footwear:  'Ethnic Jutti / Sandals for Kids',
      jewellery: 'Maala or Kids Ethnic Accessories',
      handbag:   'Mini Embroidered Potli',
      hairstyle: 'Neat Side-Part or Traditional Braid',
      makeup:    'Natural & Minimal (No Makeup)',
      bestFor:   'Festive Occasions & Cultural Events',
      tips: [
        `${outfit.name} looks best paired with subtle gold accessories.`,
        'A matching dupatta or stole adds a festive finishing touch.',
        'Traditional footwear like jutti completes the ethnic look.',
        'Keep the look natural and playful for little ones.',
      ],
    };

    if (isKidsFormal) return {
      score: 87,
      footwear:  'Dress Shoes or Smart Loafers',
      jewellery: 'Minimalist Clip Accessories',
      handbag:   'Mini Backpack or Satchel',
      hairstyle: 'Neat Combed or Side-Part',
      makeup:    'Natural (No Makeup)',
      bestFor:   'School Events, Parties & Formal Gatherings',
      tips: [
        'A clean, tucked-in shirt under the jacket looks sharp.',
        `${outfit.fabric || 'Soft fabric'} ensures all-day comfort.`,
        'Smart shoes elevate the formal look effortlessly.',
        'Keep colours coordinated for a polished finish.',
      ],
    };

    if (isKidsParty) return {
      score: 92,
      footwear:  'Ballet Flats or Glitter Sandals',
      jewellery: 'Cute Hair Clips, Bow Pins or Flower Crown',
      handbag:   'Mini Glitter Clutch or Candy Bag',
      hairstyle: 'Princess Curls, Pigtails or Loose Waves',
      makeup:    'Natural & Fresh (No Makeup)',
      bestFor:   'Birthdays, Parties & Special Occasions',
      tips: [
        `${outfit.name} is perfect for making little ones feel like royalty.`,
        'Hair accessories like tiaras or bows enhance the princess look.',
        'Glitter sandals add a magical sparkle to the outfit.',
        `${outfit.fabric || 'Net / Satin'} flows beautifully for twirling and dancing.`,
      ],
    };

    // Kids casual default
    return {
      score: 88,
      footwear:  'Canvas Sneakers or Mary Janes',
      jewellery: 'Cute Hair Clips or Cartoon Pins',
      handbag:   'Mini Backpack or Sling Bag',
      hairstyle: 'Pigtails, Loose Braids or Natural Hair',
      makeup:    'Natural (No Makeup)',
      bestFor:   `${occ || 'Everyday Casual'} & Playdates`,
      tips: [
        `Soft ${fabric || 'cotton'} keeps the little one comfortable all day.`,
        'Colourful accessories add a playful and fun touch.',
        'Sneakers or sandals keep it practical for active kids.',
        'Layer with a light jacket or hoodie for cooler evenings.',
      ],
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2 — MEN (sherwani, kurta, blazer, shirt, tshirt in men's context)
  // ─────────────────────────────────────────────────────────────────────────
  const isMenSherwani = name.includes('sherwani');
  const isMenKurta    = name === 'cotton kurta' || (name.includes('kurta') && !isKids);
  const isMenBlazer   = name.includes('executive suit') || name.includes('slim fit blazer') || name.includes('premium office blazer') || name.includes('formal trouser');
  const isMenCasual   = name.includes('linen casual shirt') || name.includes('denim jacket') || name.includes('streetwear hoodie') || name.includes('polo t-shirt') || name.includes('cargo outfit');

  if (isMenSherwani) return {
    score: Math.min(99, 93 + fabricBonus),
    footwear:  'Embroidered Mojaris or Ethnic Jutti',
    jewellery: 'Safa Turban Pin, Brooch & Kada',
    handbag:   'Clutch / Potli for Accessories',
    hairstyle: 'Neat Slicked-Back or Side-Parted Look',
    makeup:    'Groomed Beard, Light Highlighter on T-Zone',
    bestFor:   'Weddings, Baraat & Festive Celebrations',
    tips: [
      `${outfit.name} is the epitome of groom elegance — coordinate with the bride's palette.`,
      `${fabric || 'Silk blend'} drapes regally; steam before wearing to remove creases.`,
      'A matching or contrasting dupatta adds a royal touch.',
      'Accessorise with a statement brooch on the collar for a signature look.',
      'Gold or silver buttons complement embroidered sherwanis beautifully.',
    ],
  };

  if (isMenKurta) return {
    score: Math.min(99, 88 + fabricBonus),
    footwear:  'Kolhapuri Chappals or Ethnic Sandals',
    jewellery: 'Minimal Kada or Chain',
    handbag:   'Minimal Clutch or Pocket Handkerchief',
    hairstyle: 'Natural or Casual Slicked Look',
    makeup:    'Clean Shave or Groomed Beard',
    bestFor:   `${occ || 'Festive & Casual Ethnic'} Occasions`,
    tips: [
      `${outfit.name} pairs effortlessly with churidar or slim-fit pyjama.`,
      'Kolhapuri sandals add an authentic ethnic character.',
      'A light stole or dupatta draped over the shoulder elevates the look.',
      `${fabric || 'Cotton'} breathes well — ideal for warm festive evenings.`,
    ],
  };

  if (isMenBlazer) return {
    score: Math.min(99, 88 + fabricBonus),
    footwear:  'Oxford Brogues, Derby Shoes or Loafers',
    jewellery: 'Sleek Watch, Cufflinks or Lapel Pin',
    handbag:   'Leather Portfolio or Structured Briefcase',
    hairstyle: 'Neat Side-Part, Slicked-Back or Undercut',
    makeup:    'Clean Shave or Sculpted Beard, Matte Skin',
    bestFor:   'Business Meetings, Formal Events & Office',
    tips: [
      'A well-fitted blazer is non-negotiable — ensure shoulders align perfectly.',
      `${fabric || 'Wool blend'} suits benefit from dry-cleaning every 3–4 wears.`,
      'A quality watch is the ultimate power accessory for formal wear.',
      'Neutral shirt underneath (white, light blue) maximises versatility.',
      'Pocket squares in a complementary colour add distinguished flair.',
    ],
  };

  if (isMenCasual) return {
    score: 84 + fabricBonus,
    footwear:  name.includes('jacket') || name.includes('hoodie') ? 'Clean White Sneakers or Chelsea Boots' : 'Loafers, Derby Casuals or Sneakers',
    jewellery: 'Minimal Chain or Bracelet',
    handbag:   'Canvas Tote, Backpack or Crossbody',
    hairstyle: 'Textured Crop, Quiff or Natural Style',
    makeup:    'Light Moisturiser, Clean Groomed Look',
    bestFor:   'Casual Outings, Weekends & Everyday Wear',
    tips: [
      `${outfit.name} is versatile — pair up with chinos or down with joggers.`,
      'White sneakers are the universal casual companion.',
      'Roll the sleeves up for a relaxed, effortless look.',
      `${fabric || 'Cotton'} is breathable and perfect for all-day comfort.`,
    ],
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3 — WOMEN (lehenga, saree, blazer-dress, gown, dress, ethnic-suit)
  // ─────────────────────────────────────────────────────────────────────────
  const isWedding = occ.includes('wedding') || name.includes('lehenga') || name.includes('bridal') || name.includes('banarasi') || name.includes('kanjeevaram');
  const isSaree   = name.includes('saree');
  const isFormal  = occ.includes('formal') || occ.includes('office') || name.includes('blazer') || name.includes('office blazer');
  const isEthnic  = name.includes('kurta') || name.includes('kurti') || name.includes('anarkali') || name.includes('ethnic suit') || name.includes('cotton ethnic');
  const isGown    = name.includes('gown');
  const isDress   = name.includes('dress') || name.includes('maxi') || name.includes('floral');
  const isCasual  = occ.includes('casual') || name.includes('denim') || name.includes('co-ord') || name.includes('jeans');

  if (isWedding) return {
    score: Math.min(99, 93 + fabricBonus),
    footwear:  'Embroidered Heels or Bridal Sandals',
    jewellery: 'Kundan / Polki Set, Maang Tikka & Earrings',
    handbag:   'Bridal Potli Clutch',
    hairstyle: 'Braided Bun with Floral Pins or Gajra',
    makeup:    'Bold Lip, Kohl Eyes, Dewy Base & Highlighter',
    bestFor:   'Weddings & Grand Festive Celebrations',
    tips: [
      `${outfit.name} demands regal accessories — opt for full Kundan or Polki.`,
      `${fabric || 'The fabric'} drapes beautifully — keep posture upright to showcase it.`,
      'A contrasting dupatta or stole in a rich hue adds depth.',
      'Gold jewellery harmonises with warm-toned embroidery perfectly.',
      'A light spritz of oriental fragrance completes the bridal aesthetic.',
    ],
  };

  if (isSaree) return {
    score: Math.min(99, 91 + fabricBonus),
    footwear:  'Embroidered Heels or Embellished Flats',
    jewellery: 'Temple Jewellery, Jhumkas & Bangles',
    handbag:   'Embroidered Sling or Potli Bag',
    hairstyle: 'Sleek Bun with Maang Tikka or Gajra',
    makeup:    `${color.includes('red') ? 'Bold Red Lip' : 'Deep Berry or Coral Lip'}, Kohl Eyes`,
    bestFor:   `${occ || 'Festive / Wedding'} Occasions`,
    tips: [
      `${outfit.name} looks regal with a matching or contrast blouse design.`,
      'Pre-pleat the saree for a neat, even drape throughout the event.',
      'Temple or antique gold jewellery complements traditional sarees.',
      `${fabric || 'Silk'} fabric shines under warm lighting — ideal for evening events.`,
      'Safety pins discreetly placed keep pleats intact while you move.',
    ],
  };

  if (isFormal) return {
    score: Math.min(99, 87 + fabricBonus),
    footwear:  'Block-Heel Pumps, Pointed Flats or Ankle Boots',
    jewellery: 'Minimalist Gold Studs or Sleek Watch',
    handbag:   'Structured Leather Tote or Portfolio Bag',
    hairstyle: 'Sleek Low Bun or Straight Blowout',
    makeup:    'Nude Lip, Defined Brows, Light Contour',
    bestFor:   'Office, Formal Meetings & Business Events',
    tips: [
      'Keep accessories understated — one statement piece at a time.',
      `${fabric || 'The fabric'} benefits from steaming or ironing before wear.`,
      'A silk scarf or pocket square elevates the blazer ensemble.',
      'Neutral makeup tones maintain a sharp, professional presence.',
    ],
  };

  if (isEthnic) return {
    score: Math.min(99, 89 + fabricBonus),
    footwear:  'Ethnic Block Heels, Kolhapuris or Flats',
    jewellery: 'Jhumkas, Chandbalis or Layered Oxidised Necklace',
    handbag:   'Embroidered Sling or Box Clutch',
    hairstyle: 'Low Bun with Gajra or Open Straight Hair',
    makeup:    'Warm Tones, Subtle Shimmer, Kohl-Lined Eyes',
    bestFor:   `${occ || 'Festive Ethnic'} Events`,
    tips: [
      `${outfit.name} pairs beautifully with traditional gold or oxidised jewellery.`,
      'A contrasting dupatta adds depth and traditional character.',
      'Kohl-lined eyes create a striking ethnic aesthetic.',
      `${fabric || 'Cotton silk'} drapes elegantly — choose a relaxed silhouette.`,
    ],
  };

  if (isGown) return {
    score: Math.min(99, 91 + fabricBonus),
    footwear:  'Strappy Stilettos or Embellished Block Heels',
    jewellery: 'Statement Earrings or a Choker Necklace',
    handbag:   'Embellished Clutch or Chain Sling',
    hairstyle: 'Soft Hollywood Waves or Sleek High Ponytail',
    makeup:    `Smoky Eye, ${color.includes('red') ? 'Red Lip' : 'Nude Gloss'}, Highlighter`,
    bestFor:   'Evening Events, Parties & Cocktail Nights',
    tips: [
      `${fabric || 'The fabric'} catches light beautifully — ideal for evening events.`,
      'Bold earrings or a choker make the neckline the focal point.',
      'Finish with dewy highlight on cheekbones for a radiant evening glow.',
      'A structured clutch keeps the look sleek without adding bulk.',
    ],
  };

  if (isDress) return {
    score: Math.min(99, 87 + fabricBonus),
    footwear:  'Block Heels, Mules or Strappy Sandals',
    jewellery: 'Dainty Layered Necklace or Statement Earrings',
    handbag:   'Mini Shoulder Bag or Wicker Basket',
    hairstyle: 'Soft Waves, Open Hair or French Braid',
    makeup:    `Fresh Skin, ${color.includes('white') || color.includes('beige') ? 'Coral Lip' : 'Glossy Pink Lip'}`,
    bestFor:   `${occ || 'Brunch, Dates & Casual Events'}`,
    tips: [
      `${fabric || 'The fabric'} flows beautifully — avoid over-accessorising.`,
      'A cinched belt at the waist adds shape to maxi silhouettes.',
      'Layered delicate necklaces add dimension without clutter.',
      'Soft waves pair effortlessly with flowing silhouettes.',
    ],
  };

  if (isCasual) return {
    score: 85 + fabricBonus,
    footwear:  'Loafers, Slides or White Sneakers',
    jewellery: 'Minimal Chain Necklace or Hoop Earrings',
    handbag:   'Canvas Tote or Crossbody Bag',
    hairstyle: 'Messy Bun, Half-Up or Natural Waves',
    makeup:    'No-Makeup Makeup, Tinted Moisturiser & Gloss',
    bestFor:   'Everyday Casual Outings & Weekends',
    tips: [
      `${outfit.name} is versatile — dress up with accessories or keep it minimal.`,
      'White sneakers are the universal casual companion.',
      'A lightweight jacket layered on top extends wearability across seasons.',
      'Soft waves or a messy bun complete the effortless aesthetic.',
    ],
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 4 — Generic fallback
  // ─────────────────────────────────────────────────────────────────────────
  return {
    score: 85 + fabricBonus,
    footwear:  'Heeled Mules or Classic Sneakers',
    jewellery: 'Dainty Gold Necklace & Stud Earrings',
    handbag:   'Crossbody or Mini Tote',
    hairstyle: 'Soft Waves or Sleek Bun',
    makeup:    'Dewy Skin, Glossy Lip',
    bestFor:   outfit.occasion || 'Versatile Occasions',
    tips: [
      `${outfit.name || 'This look'} works best with understated accessories.`,
      'Match your footwear tone to the outfit for a cohesive look.',
      'A single statement piece is all you need.',
      `${fabric ? fabric + ' fabric' : 'The fabric'} benefits from steaming before wear.`,
    ],
  };
}
