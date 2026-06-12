export function interpolateTemplate(template, product, selectedSize = '') {
  if (!template) return '';
  const name = product.name || product.Name || '';
  const category = product.category || product.Category || '';
  const fabric = product.fabric || product.Fabric || '';
  const price = product.priceRange || product.PriceRange || '';
  
  return template
    .replace(/{ProductName}/g, name)
    .replace(/{Category}/g, category)
    .replace(/{Fabric}/g, fabric)
    .replace(/{Price}/g, price)
    .replace(/{Size}/g, selectedSize || 'N/A');
}
