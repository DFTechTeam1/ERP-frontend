export function useDateFormatter(dateString) {
    // const date = new Date(dateString);
    // const months = [
    //     'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    //     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    // ];
    
    // const day = date.getDate();
    // const month = months[date.getMonth()];
    // const year = date.getFullYear();
    
    // return `${day} ${month} ${year}`;

    const date = new Date(dateString);
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    
    return date.toLocaleDateString('id-ID', options);
}