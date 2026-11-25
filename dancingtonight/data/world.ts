import type { Genre, RecurringSocial, School, Weekday } from "@/lib/types";

// Weekly socials and schools for 18 cities, collected on 2026-11-24 from
// public listings. Only weekly events are stored (monthly ones are left out).
// Details missing from the source are left empty, never guessed.

const CHECKED = "2026-11-24";
const SV = "https://www.salsavida.com/";

const SUN = 0, MON = 1, TUE = 2, WED = 3, THU = 4, FRI = 5, SAT = 6;
const S: Genre = "salsa", B: Genre = "bachata", K: Genre = "kizomba", Z: Genre = "zouk";

type Extra = Partial<Pick<RecurringSocial, "area" | "address" | "startTime" | "endTime" | "price" | "note">>;

// Paths starting with "?" or "event/" are Salsa Vida pages.
function src(path: string) {
  const isSV = path.startsWith("?") || path.startsWith("event/");
  return {
    url: isSV ? SV + path : path,
    label: isSV ? "Salsa Vida listing" : "Public listing",
    kind: "listing" as const,
    checkedOn: CHECKED,
  };
}

function social(
  citySlug: string,
  name: string,
  venue: string,
  weekdays: Weekday[],
  genres: Genre[],
  path: string,
  extra: Extra = {},
): RecurringSocial {
  const id = `${citySlug}-${name}-${weekdays.join("")}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { id, type: "social", name, citySlug, venue, weekdays, genres, source: src(path), ...extra };
}

function school(
  citySlug: string,
  name: string,
  genres: Genre[],
  path: string,
  extra: Partial<Pick<School, "area" | "schedule" | "price" | "note">> = {},
): School {
  const id = `${citySlug}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { id, type: "school", name, citySlug, genres, source: src(path), ...extra };
}

const STALE = "The source showed an earlier 2026 date. Confirm it is still running.";

export const worldSocials: RecurringSocial[] = [
  // Seoul (additions)
  social("seoul", "Latin Club Sol Nightly Social", "Latin Club Sol", [WED, THU, FRI, SAT], [S, B], "?p=64282", { area: "Mapo" }),
  social("seoul", "TURN Latin Club Gangnam Social", "TURN Latin Club", [SUN, MON, TUE, WED, THU, FRI, SAT], [S, B], "?p=64279", { area: "Gangnam", note: "Listed as running daily." }),
  social("seoul", "Club Latin Friday Bachata & Zouk", "Club Latin", [FRI], [B, Z], "https://global-dance-finder-astro.pages.dev/venues/seoul/club-latin/", { area: "Gangnam", startTime: "22:00" }),

  // Barcelona (additions)
  social("barcelona", "2 Salsa vs Bachata", "C/ de Llança 5", [THU], [S, B], "event/spain/catalunya/barcelona/barcelona-city/2-salsa-versus-bachata-at-c-de-llanca/", { startTime: "21:00", endTime: "02:00", price: "€8" }),
  social("barcelona", "Viernes de Bachata Nights & Dio Club Salsa", "Dio Club", [FRI], [S, B], "?p=27237", { price: "€9 to €10", note: "Two dance floors." }),
  social("barcelona", "Salsa & Bachata Nights at Mojito Club", "Mojito Club", [THU, FRI, SAT, SUN], [S, B], "?p=27232", { note: STALE }),

  // Tokyo
  social("tokyo", "El Café Latino Roppongi", "El Café Latino", [SUN, MON, TUE, WED, THU, FRI, SAT], [S, B], "?p=20876", { area: "Roppongi", price: "¥1,000 to ¥2,500", note: "Listed as lessons then social dancing most nights. Confirm the night's program." }),
  social("tokyo", "Bachata Sensual Thursday", "Studio Pepe", [THU], [B], "?p=105439", { area: "Roppongi", note: "Lesson followed by a social." }),
  social("tokyo", "Monika & Victor Tuesday Bachata", "La Tropi Azabu", [TUE], [B], "event/japan/tokyo/monika-victor-tuesday-bachata/", { area: "Azabu", note: STALE }),

  // Bangkok
  social("bangkok", "Bachata On Mondays", "Bangkok", [MON], [B, S, K], "?p=25661", { startTime: "20:00", endTime: "24:00", price: "150 to 450 THB", note: "Class 20:00 to 21:00, then social." }),
  social("bangkok", "Latin Soul Tuesdays", "Red Door BKK", [TUE], [S, B, K], "event/thailand/bangkok/latin-soul-tuesday-party-at-red-door-bkk/", { area: "Sukhumvit 24", startTime: "20:00", endTime: "24:00", price: "150 to 300 THB" }),
  social("bangkok", "AfroKiz Tuesdays", "Euphorium", [TUE], [K], "?p=25663", { startTime: "20:00", endTime: "23:00", price: "300 to 450 THB", note: "Kizomba and urban kiz. Class first." }),
  social("bangkok", "Kizomba Connection Thursdays", "Saint of Salt", [THU], [K], "?p=25664", { area: "Sukhumvit 51", startTime: "20:00", price: "250 to 400 THB", note: "Workshop 20:00 to 21:30, then social." }),

  // Singapore
  social("singapore", "SBK on Mondays", "Midland House", [MON], [S, B, K], "?p=91970", { price: "S$12 to S$25", note: "Workshops, then a three room social." }),
  social("singapore", "Señor Taco Latin Nights", "Señor Taco", [TUE, WED, THU, FRI, SAT], [S], "?p=23104", { area: "Clarke Quay", price: "S$15", note: "Class, then live music social." }),
  social("singapore", "Bachata Fridays", "En Motion Dance School", [FRI], [B], "?p=23110", { price: "S$3 to S$5" }),
  social("singapore", "Salsa Saturdays", "En Motion Dance School", [SAT], [S, B, Z], "?p=23111", { price: "S$5", note: "About 60% salsa, 20% bachata, 20% zouk." }),
  social("singapore", "Caliente Salsa & Bachata Social", "Caliente Dance Studio", [WED, SAT], [S, B], "event/singapore/caliente-salsa-bachata-social-night/", { price: "S$10" }),
  social("singapore", "IxDE Salsa Social", "IxDE Studio", [WED], [S], "?p=23106", { price: "S$15" }),
  social("singapore", "Latin Sundowner", "Cuba Libre", [SUN], [S, B], "?p=23105", { area: "Clarke Quay", price: "S$8" }),

  // Sydney
  social("sydney", "Mambo G's Monday Salsa Social", "Cyprus Community Club", [MON], [S], "?p=22522", { area: "Stanmore", price: "A$20", note: "Another part of the listing names Darlinghurst. Confirm the venue." }),
  social("sydney", "Rouge Salchata Tuesdays", "Rouge Bar", [TUE], [S, B], "?p=22585", { area: "Cockle Bay Wharf", price: "A$15 to A$16" }),
  social("sydney", "Salsa Tuesdays", "Establishment Bar", [TUE], [S], "?p=24284", { area: "George Street", startTime: "20:00", endTime: "03:00", note: "Free class at 20:00." }),
  social("sydney", "Salsa Wednesdays", "Café del Mar", [WED], [S, K], "event/australia/sydney/salsa-wednesdays-at-cafe-del-mar/", { area: "Cockle Bay Wharf", startTime: "19:30", endTime: "24:00", note: "Kizomba upstairs. Another listing names The Rawson." }),
  social("sydney", "Pontoon Salsa Thursdays", "Pontoon Bar", [THU], [S, B], "?p=22581", { area: "Cockle Bay Wharf", price: "Free" }),
  social("sydney", "Latin Nights by the Bay", "Darling Harbour", [FRI], [S, B], "?p=22523", { startTime: "19:00", price: "Free" }),
  social("sydney", "Rouge Salsa Saturdays", "Rouge", [SAT], [S, B], "?p=91309", { area: "Darling Harbour", startTime: "20:00", endTime: "01:00", price: "A$10 to A$16" }),

  // Dubai
  social("dubai", "Bailamé Tuesday Latin Night", "Twenty Three Rooftop Bar", [TUE], [S, B, K], "?p=23262", { area: "Grand Plaza Mövenpick", startTime: "22:00", endTime: "02:30", price: "AED 60" }),
  social("dubai", "Latin Crazy Thursdays", "Royal Palette, VOCO Hotel", [THU], [B], "event/united-arab-emirates/dubai/latin-crazy-thursdays/", { startTime: "21:30", price: "Free" }),
  social("dubai", "Latin Nights at SoBe", "SoBe, W Dubai The Palm", [FRI], [S, B], "?p=23264", { area: "Palm Jumeirah", price: "AED 69" }),
  social("dubai", "La Grande Latin Social", "La Grande", [FRI], [S, B, K, Z], "?p=23275", { note: "Day and venue differ between listings. Confirm before going." }),
  social("dubai", "Afro Latin Social Dancing Night", "Dubai Salsa Club", [SAT], [S, B, K], "?p=23276", { startTime: "22:00", endTime: "01:00", price: "AED 65" }),

  // Istanbul
  social("istanbul", "Centro Latin Night", "Jolly Joker Kanyon", [TUE], [S, B], "?p=81162", { area: "Levent", startTime: "22:00", endTime: "01:30", price: "400 TL with a drink" }),
  social("istanbul", "Bachata Night", "Hully's House", [THU], [B], "?p=23976", { area: "Bostancı", price: "₺350, cash only" }),
  social("istanbul", "Sunset Latin Night", "Boulevard 216 Terrace", [SUN], [S, B], "?p=23977", { price: "₺300 to ₺350", note: "Open air terrace." }),

  // Madrid
  social("madrid", "Tuesday Salsa", "Temple Madrid", [TUE], [S, B], "?p=27327", { startTime: "21:00", price: "€8 to €10" }),
  social("madrid", "Kizomba Tuesdays", "The Host", [TUE], [K], "?p=27328", { price: "€15 with a drink" }),
  social("madrid", "Bachata Nights", "The Host", [WED, FRI], [B], "?p=27328", { price: "€15 with a drink" }),
  social("madrid", "Salsa & Bachata Thursdays", "The Host", [THU], [S, B], "?p=27328", { price: "€15 with a drink" }),
  social("madrid", "Crossover Saturdays", "The Host", [SAT], [S, B, K], "?p=27328", { price: "€15 with a drink" }),
  social("madrid", "Salsera Bachatera Night", "Temple Room", [FRI, SAT], [S, B, K], "?p=27329", { startTime: "00:00", endTime: "06:00", price: "€15 to €20" }),
  social("madrid", "Azúcar Latin Socials", "Azúcar Salsa Disco", [THU, FRI, SAT], [S, B], "?p=27326", { price: "€15 to €25 with a drink" }),
  social("madrid", "Weekend Latin Parties", "Mambo Swing", [FRI, SAT, SUN], [S, B], "?p=27325", { startTime: "19:00", price: "€15 to €20" }),

  // Lisbon
  social("lisbon", "Segundas SBK", "Jardim Roque Gameiro", [MON], [S, B, K], "?p=24066", { area: "Cais do Sodré", price: "Free", note: "Outdoor, May to September only." }),
  social("lisbon", "AfroLatine Nights", "Muxima Bar", [FRI, SAT], [K, S], "?p=24079", { price: "€10 to €15", note: "One field of the listing says Porto. Confirm the city." }),

  // Paris
  social("paris", "Balajo Mardi Salsa SBK", "Le Balajo", [TUE], [S, B, K], "?p=24540", { area: "Rue de Lappe", startTime: "22:00", endTime: "02:00", price: "€10 to €12", note: "Classes 19:30 and 20:30." }),
  social("paris", "Agua Party", "Agua", [TUE], [S, B, K], "?p=24539", { price: "€12", note: "Lessons 19:00 to 21:00, then three rooms." }),
  social("paris", "Mercredi Salsa", "Boom Boom Villette", [WED], [S], "?p=24544", { price: "Free" }),
  social("paris", "Salsa, Bachata & Konpa Wednesday", "La Felicità", [WED], [S, B], "?p=24543", { price: "Free" }),
  social("paris", "Thursday Salsa & Bachata Night", "La Pachanga", [THU], [S, B], "?p=24545", { startTime: "19:30", price: "€12" }),
  social("paris", "Mixed Salsa Clubbing Thursdays", "Le Balajo", [THU], [S, B, K], "?p=24547"),
  social("paris", "Bachata Friday", "La Pachanga", [FRI], [B, S, K], "?p=24549", { startTime: "22:00", endTime: "05:00", note: "Classes at 20:00 and 21:00." }),
  social("paris", "Sabado Latino", "La Pachanga", [SAT], [S], "?p=47337", { startTime: "19:30", endTime: "05:00", price: "€12" }),
  social("paris", "La Candela", "Factory Club", [SAT], [S, B], "?p=24552", { area: "Thiais (outside Paris)", startTime: "20:30", price: "€13" }),
  social("paris", "Salsa Sundays", "Café Oz", [SUN], [S], "?p=49795", { price: "Free" }),

  // London
  social("london", "Monday Salsa & Bachata", "Salsateca Warren Street", [MON], [S, B], "?p=23190"),
  social("london", "Mondays at Wimbledon", "Incognito Dance", [MON], [S, B], "?p=23207", { area: "Wimbledon" }),
  social("london", "Todo Latino Tuesdays", "Sway Bar", [TUE], [S, B], "?p=63799", { area: "Holborn", price: "£10 to £15" }),
  social("london", "Tuesday Fulham Salsa & Bachata", "Incognito Dance", [TUE], [S, B], "?p=23177", { area: "Fulham" }),
  social("london", "Sway Wednesday", "Sway Bar", [WED], [S, B], "?p=63792", { area: "Great Queen Street", price: "£15" }),
  social("london", "Wednesday Salsa & Bachata", "Salsateca Warren Street", [WED], [S, B], "?p=23193"),
  social("london", "Latin Krazy Thursdays", "Sway Bar", [THU], [S, B], "?p=63800", { note: "Free entry until 21:00." }),
  social("london", "Thursdays at Earl's Court", "Incognito Dance", [THU], [S, B], "?p=23176", { area: "Earl's Court" }),
  social("london", "Salsa On Sundays", "Cecil Sharp House", [SUN], [S, B], "?p=23199", { area: "Camden", note: "Free beginners' class first." }),
  social("london", "Salsateca Sundays", "St Saviour's and St Olave's School", [SUN], [S, B], "?p=23197", { area: "Bermondsey", price: "£15 to £17" }),
  social("london", "Bailando Sundays", "Be At One", [SUN], [B, S], "?p=97706", { area: "Regent Street", startTime: "20:30" }),

  // Berlin
  social("berlin", "Salsa & Bachata After Work", "HAVANNA Berlin", [WED], [S, B], "?p=23773", { area: "Schöneberg", startTime: "20:00", price: "€7", note: "Lesson from 19:00." }),
  social("berlin", "Salsa und Bachata Tanzclub", "Tanzschule Lockstep", [WED], [S, B], "?p=105964"),
  social("berlin", "Soda Social Club", "Soda Club, Kulturbrauerei", [THU, SUN], [S, B, K, Z], "?p=23776", { startTime: "20:00", endTime: "02:00", price: "€8", note: "Lesson at 19:00. Five floors." }),
  social("berlin", "Latin Thursday Rooftop", "Weekend Club", [THU], [S, B], "?p=91324", { area: "Alexanderplatz", price: "€10 to €16.50" }),
  social("berlin", "Friday Night Party", "HAVANNA Berlin", [FRI], [S, B], "?p=23774", { area: "Schöneberg", startTime: "22:00", price: "€10" }),

  // Amsterdam
  social("amsterdam", "Latin Nights", "Club Out", [WED, THU, FRI, SAT, SUN], [S, B], "?p=26166", { area: "Leidseplein" }),
  social("amsterdam", "The Latin Thursday", "Heineken Hoek", [THU], [S, B], "?p=98263", { startTime: "21:00", price: "€10 to €15" }),
  social("amsterdam", "Latin Friday", "Cancún", [FRI], [S, B, K], "?p=26165", { startTime: "22:00", endTime: "03:00" }),
  social("amsterdam", "Friday SalsaCafé", "Salsa4Fun", [FRI], [B], "?p=91355", { startTime: "21:00", endTime: "24:00", price: "€7" }),

  // Milan
  social("milan", "Caribbean Dance Night", "Piperita", [TUE], [S], "?p=97372", { price: "€12 to €20" }),
  social("milan", "Friday Latin Nights", "Time Club", [FRI], [S, B, K], "?p=23636", { area: "Pioltello", note: STALE }),

  // New York
  social("new-york", "Bachata Fridays", "Hotel Chantelle", [FRI], [B], "event/new-york/new-york-city/bachata-fridays-at-hotel-chantelle/", { startTime: "23:00", endTime: "04:00", note: "Dress code: no caps, shorts or gym wear." }),
  social("new-york", "Friday Sensual Bachata", "Sensual Movement NYC", [FRI], [B], "event/new-york/new-york-city/friday-sensual-bachata-at-sensual-movement-nyc/", { startTime: "21:00", price: "$15 to $25" }),
  social("new-york", "Weekend Bachata Social", "Ktown Dance Studio", [SAT], [B], "?p=91288", { address: "38 W 32nd St", startTime: "21:00", endTime: "02:00" }),
  social("new-york", "Salsa Bachata Sundays", "The Rose", [SUN], [S, B], "?p=22536", { address: "160 W 25th St", startTime: "18:30", endTime: "22:30", price: "$15 to $20" }),

  // Miami
  social("miami", "BachaTuesdays", "Ball & Chain", [TUE], [B], "?p=24259", { area: "Little Havana", startTime: "21:00", note: "Free class, then social." }),
  social("miami", "Bachata Miami Dreams", "Black Box Media", [WED], [B, Z], "?p=92121", { area: "North Miami", startTime: "22:30", endTime: "02:00", price: "$25" }),
  social("miami", "Latin Social Thursdays", "Hole 19, Miami Springs Country Club", [THU], [S, B], "event/florida/miami/latin-social-thursdays-at-hole-19-scratch-kitchen-bar/", { startTime: "20:30", note: "Free On2 class first." }),

  // Los Angeles
  social("los-angeles", "Monday Night Salsa and Bachata", "The Continental Club", [MON], [S, B], "?p=80686", { area: "Downtown", startTime: "20:00", price: "$15" }),
  social("los-angeles", "Friday Social", "Los Angeles Salsa & Bachata Dance Academy", [FRI], [S, B], "?p=105360", { area: "Santa Monica", price: "$25" }),

  // Mexico City
  social("mexico-city", "International Salsa Meetup", "Roma Norte / Condesa", [WED, FRI], [S, B], "?p=24157", { note: "Friday classes from 19:30." }),
  social("mexico-city", "Salsa Nights", "Mama Rumba", [WED, THU, FRI, SAT], [S, B], "?p=24145", { area: "Roma Norte", note: "Live salsa and son cubano." }),
  social("mexico-city", "ISM Salsa & Bachata Thursdays", "Marketeatro", [THU], [S, B], "event/mexico/mexico-city/ism-salsa-bachata-thursdays-at-marketeatro/", { area: "Roma Norte", startTime: "21:30", note: "Classes at 19:30 and 20:30." }),
  social("mexico-city", "Son Cubano Nights", "La Flor del Son", [THU, FRI, SAT], [S], "event/mexico/mexico-city/son-cubano-nights-at-la-flor-del-son/", { area: "Roma Norte", price: "Free" }),
  social("mexico-city", "Weekly Latin Nights", "Gran Salón El Incomparable", [THU, FRI, SAT, SUN], [S], "?p=24150", { area: "Venustiano Carranza", price: "From MX$50" }),
  social("mexico-city", "Sábado de Salsa", "Salón Cubanía", [SAT], [S], "?p=24153", { area: "Tlalpan", address: "Acoxpa 550, Ex Hacienda Coapa", note: "Live salsa." }),

  // Cali
  social("cali", "Martes Siboney Salsa y Pachanga", "Siboney Club", [TUE], [S], "?p=50666", { price: "Free" }),
  social("cali", "Rumba en El Templo de la Salsa", "Zaperoco", [TUE, THU, FRI, SAT], [S], "event/colombia/cali/rumba-en-el-templo-de-la-salsa-at-zaperoco/", { area: "San Vicente", address: "Av. 5 Nte #16-46" }),
  social("cali", "Salsa Wednesdays", "Living Club", [WED], [S], "?p=50674", { area: "Acopi", startTime: "21:30", endTime: "03:00", price: "COP 10,000" }),
  social("cali", "Miércoles de Salsa Pal Bailador", "La Topa Tolondra", [WED], [S], "?p=50661", { startTime: "19:00", price: "COP 10,000" }),
  social("cali", "Salsa Nights", "MalaMaña Salsa Bar", [THU, FRI, SAT, SUN], [S], "?p=50670", { area: "San Pedro", startTime: "20:00", endTime: "02:00" }),
  social("cali", "Salsa & Bachata Thursday", "El Rincón de Heberth", [THU], [S, B], "?p=50991", { price: "COP 15,000" }),
  social("cali", "Friday Salsa Night", "El Rincón de Heberth", [FRI], [S], "?p=50672"),
  social("cali", "Viernes de Puro Golpe", "Siboney Club", [FRI], [S], "?p=50667", { price: "Free" }),
];

export const worldSchools: School[] = [
  school("tokyo", "Zona Libre Roppongi", [B], "?p=91972", { area: "Roppongi", schedule: "Beginner bachata, Tuesdays 13:00" }),
  school("singapore", "En Motion Dance School", [S, B, Z], "?p=23111"),
  school("sydney", "The Salsa Society", [S, B], "?p=22704", { area: "Warriewood", schedule: "Tue, Wed, Thu and Sun", price: "A$30" }),
  school("sydney", "Sydney Salsa Classes, CBD Studio", [S], "?p=22498", { area: "CBD" }),
  school("dubai", "MOOVnation", [S, B], "?p=23271"),
  school("lisbon", "UDance", [S, B, K], "?p=24068", { area: "Santos", schedule: "Monday to Saturday, 60 minute classes" }),
  school("paris", "SalsaNueva", [S], "?p=24557"),
  school("paris", "Studio Massaro", [S], "?p=24559"),
  school("london", "Caramelo Latin Dance Academy", [S, B], "?p=63796"),
  school("berlin", "La Mambita", [S], "event/germany/berlin/weekly-salsa-classes-at-la-mambita/", { area: "Schöneberg", schedule: "Nearly every day" }),
  school("berlin", "Humboldt Bachata Classes", [B], "?p=91373"),
  school("amsterdam", "Love For Salsa", [S, B], "?p=26141"),
  school("amsterdam", "Euphoria Academy", [S, B], "?p=26157"),
  school("amsterdam", "Pasito Dance School", [S, B], "?p=26159"),
  school("milan", "Studio Gem Milano", [S, B], "event/italy/milan/weekly-salsa-bachata-classes-at-studio-gem-milano/", { schedule: "Monday to Thursday" }),
  school("milan", "Bandits Dance Studio", [S, B], "?p=23640", { schedule: "Monday and Wednesday" }),
  school("milan", "Baila Conmigo", [S], "?p=23639", { schedule: "Cuban salsa, Monday to Friday" }),
  school("milan", "Dance 2Be", [S, B], "?p=23641"),
  school("new-york", "Nieves Latin Dance Studio", [S], "event/new-york/new-york-city/salsa-classes-at-nieves-latin-dance-studio/", { schedule: "Friday practice social 20:00 to 22:00", price: "Free for members, $25 guests" }),
  school("new-york", "Havana Social free lessons", [S, B], "?p=100057", { area: "45 Stone Street", schedule: "Fridays 19:00", price: "Free" }),
  school("miami", "Mady's Dance Factory", [B], "?p=92120", { schedule: "Wednesday bachata class" }),
  school("los-angeles", "Dancer University", [S], "?p=21865"),
  school("los-angeles", "Salsa Lessons at The Granada", [S], "?p=21859"),
  school("mexico-city", "BR Dance Studio", [S, B], "?p=24168"),
  school("mexico-city", "Salón Cubanía Classes", [S], "?p=24154", { area: "Tlalpan" }),
];
