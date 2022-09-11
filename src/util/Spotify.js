let globalToken, timer;
const clientID = '0313551fc043404f9e015e2306460b03';
const redirectURI = 'https://playmaker-beta.vercel.app/';


export const Spotify = {
    getAccessToken() {
        globalToken = localStorage.getItem('globalToken');
        if(globalToken) {
            return globalToken;
        }
        const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (tokenMatch && expiresInMatch) {
            globalToken = tokenMatch[1];
            localStorage.setItem('globalToken', globalToken);
            setTimeout(() =>{
                localStorage.setItem('globalToken', '');
            }, expiresInMatch[1]*1000);
            const expires = Number(expiresInMatch[1]);
            window.setTimeout(() => {globalToken = ''; window.history.pushState('Access Token', null, '/');}, expires*1000);
            window.history.pushState('Access Token', null, '/');
            return globalToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessURL;
        }
    },

    savePlaylist(name, URIs){
        if(!(name && URIs.length)) {
            return;
        }
        const token = this.getAccessToken();
        const headers = {Authorization: `Bearer ${token}`};
        let userId;
        return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => response.json()).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: name})}).then(response => response.json()).then(jsonResponse => {
                    const playlistID = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({uris: URIs})
                    }).then(response => response.json()).then(jsonResponse => {
                        const playlistID = jsonResponse.id
                    })
                });
        });

    },

    search(term) {
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {return response.json()})
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } else {
                return jsonResponse.tracks.items.map(track => (
                    {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                        img: track.album.images[0].url
                    }
                ));
            }
        })
    },

    recommend(trackIDs){
        const token = this.getAccessToken();
        const headers = {Authorization: `Bearer ${token}`};
        let shuffled = trackIDs;
        if (trackIDs.length > 5){
            shuffled = trackIDs.sort(() => 0.5 - Math.random());
            shuffled = shuffled.slice(0, 5);
        }
        let input = shuffled.join('%2C');
        return fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${input}`, {
            headers: headers
        }).then(response => {return response.json()})
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } else {
                return jsonResponse.tracks.map(track => (
                    {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                        img: track.album.images[0].url
                    }
                ));
            }
        })
    }
}
