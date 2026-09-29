// Release order, including the spring SE/e models and the renamed Air.
function generation(model: string): number {
  if (model === "iPhone Air") return 17;
  if (model === "iPhone SE 2022") return 13.5;
  if (model === "iPhone SE 2020") return 11.5;
  if (/^iPhone X[RS]/.test(model)) return 10.5;
  if (model === "iPhone X") return 10;
  const match = model.match(/^iPhone (\d+)(e)?\b/);
  return match ? Number(match[1]) + (match[2] ? 0.5 : 0) : 0;
}

export function compareIPhoneModels(a: string, b: string): number {
  const aIsPhone = a.startsWith("iPhone");
  const bIsPhone = b.startsWith("iPhone");
  if (aIsPhone !== bIsPhone) return aIsPhone ? -1 : 1;
  if (!aIsPhone) return 0;
  const variant = (name: string) => /Pro Max/.test(name) ? 3 : /Pro/.test(name) ? 2 : 1;
  return generation(b) - generation(a) || variant(b) - variant(a);
}
