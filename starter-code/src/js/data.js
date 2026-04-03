export async function getData() {
    const res = await fetch('./data.json')

    if(!res.ok) {
        throw new Error('Error loading JSON')
    }

    return res.json()
}