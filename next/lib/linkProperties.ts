export const linkPropertiesWithoutRarity = { id: true, icon: true, name_de: true, name_en: true, name_es: true, name_fr: true } as const;
export const linkProperties = { ...linkPropertiesWithoutRarity, rarity: true } as const;
