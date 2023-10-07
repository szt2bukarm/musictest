const getToken = async function() {
    const res = await 
    fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': '6dbd832bba9648c8b27858be075c90a4',
        'client_secret': '71bebeb3e82a4988b7a0f83ebef59e1b'
        })
    })
    const data = await res.json()
    return data.access_token
}

const getData = async function(artist) {
    let artists = []
    const accessToken = await getToken()
    const res = await
    fetch(`https://api.spotify.com/v1/search?q=${artist}&type=track`, {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
    });
    const data = await res.json()
    for (let i = 0; i < 10; i++) {
        artists.push(data.tracks.items[i].artists[0].name + " - " + data.tracks.items[i].name);
    }
    return artists
}


const search = document.querySelector('.search')
const searchQuery = document.querySelector('.search-query')
const results = document.querySelector('.results')
search.addEventListener('click',async function() {
    results.innerHTML = ""
    const res = await getData(searchQuery.value)
    console.log(res);
    res.forEach(el => {
        let html = `
        <p style="margin-bottom:5px; cursor:pointer" onclick="playID(this)">${el}</p>`

        results.insertAdjacentHTML('beforeend',html)
    });
})