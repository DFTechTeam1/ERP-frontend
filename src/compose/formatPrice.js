export function formatPrice(number) {
    const parts = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).formatToParts(number);
    
    return parts.map(part => {
        if (part.type !== 'currency') return part.value;
        return '';
    }).join('');
}