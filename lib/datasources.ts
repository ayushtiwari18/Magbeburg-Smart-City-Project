const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

export async function getTaxRevenue() {
  const res = await fetch(`${RAW}/steuereinnahmen/json/steuereinnahmen-2010-2025.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Tax fetch failed");
  return res.json();
}

export async function getMietspiegel() {
  const res = await fetch(`${RAW}/mietspiegel-2024/nach-wohnflaeche.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Mietspiegel fetch failed");
  return res.json();
}

export async function getClimateMonthly() {
  const res = await fetch(`${RAW}/sensor-data/json/klima-monat.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Climate fetch failed");
  return res.json();
}
