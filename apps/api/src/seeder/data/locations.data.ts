import { LocationType } from '@job-board/db';

export interface LocationSeedData {
  type: LocationType;
  slug: string;
  name: string;
  children?: LocationSeedData[];
}

export const locationsData: Record<string, LocationSeedData[]> = {
  HR: [
    {
      type: LocationType.COUNTRY,
      slug: 'croatia',
      name: 'Hrvatska',
      children: [
        {
          type: LocationType.REGION,
          slug: 'grad-zagreb',
          name: 'Grad Zagreb',
          children: [
            { type: LocationType.CITY, slug: 'zagreb', name: 'Zagreb' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'splitsko-dalmatinska',
          name: 'Splitsko-dalmatinska županija',
          children: [
            { type: LocationType.CITY, slug: 'split', name: 'Split' },
            { type: LocationType.CITY, slug: 'makarska', name: 'Makarska' },
            { type: LocationType.CITY, slug: 'sinj', name: 'Sinj' },
            { type: LocationType.CITY, slug: 'trogir', name: 'Trogir' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'primorsko-goranska',
          name: 'Primorsko-goranska županija',
          children: [
            { type: LocationType.CITY, slug: 'rijeka', name: 'Rijeka' },
            { type: LocationType.CITY, slug: 'opatija', name: 'Opatija' },
            { type: LocationType.CITY, slug: 'crikvenica', name: 'Crikvenica' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'osjecko-baranjska',
          name: 'Osječko-baranjska županija',
          children: [
            { type: LocationType.CITY, slug: 'osijek', name: 'Osijek' },
            { type: LocationType.CITY, slug: 'dakovo', name: 'Đakovo' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'istarska',
          name: 'Istarska županija',
          children: [
            { type: LocationType.CITY, slug: 'pula', name: 'Pula' },
            { type: LocationType.CITY, slug: 'rovinj', name: 'Rovinj' },
            { type: LocationType.CITY, slug: 'porec', name: 'Poreč' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'zadarska',
          name: 'Zadarska županija',
          children: [
            { type: LocationType.CITY, slug: 'zadar', name: 'Zadar' },
            {
              type: LocationType.CITY,
              slug: 'biograd',
              name: 'Biograd na Moru',
            },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'dubrovacko-neretvanska',
          name: 'Dubrovačko-neretvanska županija',
          children: [
            { type: LocationType.CITY, slug: 'dubrovnik', name: 'Dubrovnik' },
            { type: LocationType.CITY, slug: 'korcula', name: 'Korčula' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'varazdinska',
          name: 'Varaždinska županija',
          children: [
            { type: LocationType.CITY, slug: 'varazdin', name: 'Varaždin' },
          ],
        },
      ],
    },
  ],
  SI: [
    {
      type: LocationType.COUNTRY,
      slug: 'slovenia',
      name: 'Slovenija',
      children: [
        {
          type: LocationType.REGION,
          slug: 'osrednjeslovenska',
          name: 'Osrednjeslovenska regija',
          children: [
            { type: LocationType.CITY, slug: 'ljubljana', name: 'Ljubljana' },
            { type: LocationType.CITY, slug: 'domzale', name: 'Domžale' },
            { type: LocationType.CITY, slug: 'kamnik', name: 'Kamnik' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'podravska',
          name: 'Podravska regija',
          children: [
            { type: LocationType.CITY, slug: 'maribor', name: 'Maribor' },
            { type: LocationType.CITY, slug: 'ptuj', name: 'Ptuj' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'savinjska',
          name: 'Savinjska regija',
          children: [
            { type: LocationType.CITY, slug: 'celje', name: 'Celje' },
            { type: LocationType.CITY, slug: 'velenje', name: 'Velenje' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'gorenjska',
          name: 'Gorenjska regija',
          children: [
            { type: LocationType.CITY, slug: 'kranj', name: 'Kranj' },
            { type: LocationType.CITY, slug: 'bled', name: 'Bled' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'obalno-kraska',
          name: 'Obalno-kraška regija',
          children: [
            { type: LocationType.CITY, slug: 'koper', name: 'Koper' },
            { type: LocationType.CITY, slug: 'piran', name: 'Piran' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'jugovzhodna',
          name: 'Jugovzhodna Slovenija',
          children: [
            { type: LocationType.CITY, slug: 'novo-mesto', name: 'Novo mesto' },
          ],
        },
      ],
    },
  ],
  RS: [
    {
      type: LocationType.COUNTRY,
      slug: 'serbia',
      name: 'Srbija',
      children: [
        {
          type: LocationType.REGION,
          slug: 'beogradski-okrug',
          name: 'Beogradski okrug',
          children: [
            { type: LocationType.CITY, slug: 'beograd', name: 'Beograd' },
            { type: LocationType.CITY, slug: 'zemun', name: 'Zemun' },
            {
              type: LocationType.CITY,
              slug: 'novi-beograd',
              name: 'Novi Beograd',
            },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'juznobacki-okrug',
          name: 'Južnobački okrug',
          children: [
            { type: LocationType.CITY, slug: 'novi-sad', name: 'Novi Sad' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'nisavski-okrug',
          name: 'Nišavski okrug',
          children: [{ type: LocationType.CITY, slug: 'nis', name: 'Niš' }],
        },
        {
          type: LocationType.REGION,
          slug: 'sumadijski-okrug',
          name: 'Šumadijski okrug',
          children: [
            { type: LocationType.CITY, slug: 'kragujevac', name: 'Kragujevac' },
          ],
        },
        {
          type: LocationType.REGION,
          slug: 'zlatiborski-okrug',
          name: 'Zlatiborski okrug',
          children: [{ type: LocationType.CITY, slug: 'uzice', name: 'Užice' }],
        },
      ],
    },
  ],
};
