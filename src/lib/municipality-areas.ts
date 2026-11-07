// Curated place-name directory, not an exhaustive gazetteer or delivery boundary.
// Sources: https://www.karlskrona.se/hitta-verksamheter/lediga-tomter/
// https://www.karlskrona.se/kommun-och-politik/det-har-ar-karlskrona/karlskronaanalysen/analysen-av-karlskrona/
// https://gis.karlskrona.se/arcgis/rest/services/agol/MyMapService/MapServer/0
// Groupings are browsing categories rather than official administrative divisions.
export const MUNICIPALITY_GROUPS = [
  { id: 'city', key: 'group_city', places: ['Trossö', 'Björkholmen', 'Saltö', 'Långö', 'Pantarholmen', 'Galgamarken', 'Bergåsa', 'Hästö', 'Dragsö', 'Wämö'] },
  { id: 'mainland', key: 'group_mainland', places: ['Lyckeby', 'Amiralen', 'Slottsbacken', 'Hultvägen', 'Kungsmarken', 'Gullberna', 'Bastasjö', 'Rödeby', 'Fridlevstad', 'Tving', 'Holmsjö', 'Nävragöl', 'Spjutsbygd'] },
  { id: 'coast', key: 'group_coast', places: ['Nättraby', 'Jämjö', 'Ramdala', 'Kristianopel', 'Fågelmara', 'Torhamn', 'Kättilsmåla', 'Trummenäs', 'Möcklö'] },
  { id: 'islands', key: 'group_islands', places: ['Hasslö', 'Aspö', 'Drottningskär', 'Sturkö', 'Tjurkö', 'Senoren', 'Ungskär', 'Utlängan'] },
  { id: 'rural', key: 'group_rural', places: ['Brömsebro', 'Saleboda', 'Strömsberg', 'Alnaryd', 'Sälleryd', 'Svanhalla'] },
] as const;