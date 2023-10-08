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

const newReleaseseContainer = document.querySelector('.new-releases-container')
const getNewReleases = async function() {
    let placeholder =`
        <div class="item-card">
        <img class="item-image-placeholder">
        <div class="item-desc-placeholder">
            <div class="item-title-placeholder"></div>
            <p class="item-artist-placeholder"></p>
            <div class="item-info">
                <div class="item-type-placeholder"></div>
                <div class="item-trackcount-placeholder"></div>
            </div>
        </div>
    </div>`

    for (let i = 0; i < 6; i++) {
        newReleaseseContainer.insertAdjacentHTML('beforeend',placeholder)
    }

    const accessToken = await getToken()
    const res = await 
    fetch('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await res.json()
    newReleaseseContainer.innerHTML = ""
    
    for (let i = 0; i < 6; i++) {
        let html = `
            <div class="item-card">
                <img class="item-image" src="${data.albums.items[i].images[1].url}" alt="" srcset="">
                <div class="item-desc">
                    <p class="item-title">${(data.albums.items[i].name).length > 15 ? (data.albums.items[i].name).substring(0,15) + "..." : data.albums.items[i].name}</p>
                    <p class="item-artist">${data.albums.items[i].artists[0].name}</p>
                    <div class="item-info">
                        <div class="item-type">${data.albums.items[i].album_type}</div>
                        <div class="item-trackcount">${data.albums.items[i].total_tracks + " tracks"}</div>
                    </div>
                </div>
            </div>
        `
        
        newReleaseseContainer.insertAdjacentHTML('beforeend',html)
    }
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

// getNewReleases()