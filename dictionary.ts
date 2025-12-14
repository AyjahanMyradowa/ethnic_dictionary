
export interface DictionaryEntry {
  word: string;
  definition: string;
  pronunciation?: string;
  examples?: string[];
}

export const turkmenDictionary: DictionaryEntry[] = [
  {
    word: "ýagy",
    definition: "duşman",
    pronunciation: "yagy",
    examples: [
      "Ol meniň ýagym",
      "Ýagy bilen söhbetdeş bolmak kyn"
    ]
  },
  {
    word: "ýagy-duşman",
    definition: "Duşman, garşydaş, biri bilen duşmançylyk edýän adam",
    pronunciation: "yagy-duşman",
    examples: [
      "Ol meniň ýagy-duşmanym bolup galdy",
      "Ýagy-duşman bilen söhbetdeş bolmak kyn"
    ]
  },
  {
    word: "ak-sakal",
    definition: "Garry adam, ýaşuly kişi",
    pronunciation: "ak-sakal",
    examples: [
      "Ak-sakal uly tejribe bilen gürleýär",
      "Obanyň ak-sakallary maslahat berýärler"
    ]
  },
  {
    word: "gara-baş",
    definition: "Ýaş adam, ýigit",
    pronunciation: "gara-baş",
    examples: [
      "Gara-baş işe başlady",
      "Bu gara-başlar gaty çeýe"
    ]
  },
  {
    word: "ak-ýürek",
    definition: "Gowy ýürekli, mylaýym, rehimli adam",
    pronunciation: "ak-ýürek",
    examples: [
      "Ol ak-ýürekli adam",
      "Ak-ýürek adamlar hemişe kömek edýärler"
    ]
  },
  {
    word: "gara-ýürek",
    definition: "Erbet ýürekli, zalym, rehimsiz adam",
    pronunciation: "gara-ýürek",
    examples: [
      "Gara-ýürek adam hiç kime kömek etmeýär",
      "Onuň gara-ýüregi bar"
    ]
  },
  {
    word: "altyn-el",
    definition: "Ussady, hünärli elleri bolan adam",
    pronunciation: "altyn-el",
    examples: [
      "Ol altyn-el ussady",
      "Altyn-el adamlar hemme zady edip bilýärler"
    ]
  },
  {
    word: "demir-ýürek",
    definition: "Batyrgaý, gorkmaz, berk ýürekli adam",
    pronunciation: "demir-ýürek",
    examples: [
      "Demir-ýürek söweşçi",
      "Onuň demir-ýüregi bar, hiç zatdan gorkmaýar"
    ]
  },
  {
    word: "bal-dil",
    definition: "Süýji gürleýän, hoş sözli adam",
    pronunciation: "bal-dil",
    examples: [
      "Bal-dil adam bilen gürleşmek hoş",
      "Onuň bal-dili bar, hemme ony gowy görýär"
    ]
  },
  {
    word: "daş-ýürek",
    definition: "Rehimsiz, duýgusyz, gaty ýürekli adam",
    pronunciation: "daş-ýürek",
    examples: [
      "Daş-ýürek adam hiç kime acymaýar",
      "Onuň daş-ýüregi bar"
    ]
  },
  {
    word: "ak-niýet",
    definition: "Gowy niýetli, pak pikirli adam",
    pronunciation: "ak-niýet",
    examples: [
      "Ak-niýet adam bilen işlemek aňsat",
      "Onuň ak-niýeti bar, hiç kime ýamanlyk etmeýär"
    ]
  }
];

export function searchDictionary(query: string): DictionaryEntry[] {
  try {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return [];
    }
    
    const lowercaseQuery = query.toLowerCase().trim();
    
    return turkmenDictionary.filter(entry => {
      try {
        return entry.word.toLowerCase().includes(lowercaseQuery) ||
               entry.definition.toLowerCase().includes(lowercaseQuery);
      } catch (error) {
        console.error('Error filtering dictionary entry:', error, entry);
        return false;
      }
    });
  } catch (error) {
    console.error('Error in searchDictionary:', error);
    return [];
  }
}
