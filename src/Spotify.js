const Spotify = {
    //Store the Spotify API endpoint
    apiUrl: 'https://api.spotify.com/v1',
    //Placeholder for access token
    accessToken: '',
    //Get the access token from the URL
    getAccessToken() {
        console.log('Getting access token...');
        if (this.accessToken) {
            console.log(this.accessToken)
            return this.accessToken;
        }

        //Extract the access token from the URL
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&}]*)/);
        if (accessTokenMatch && expiresInMatch) {
            this.accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            //Clear the access token from the URL
            window.setTimeout(() => (this.accessToken = ''), expiresIn * 100);

            //Clear the URL parameters
            window.history.pushState('Access Token', null, '/');

            return this.accessToken;
        } else {
            //Redirect the user to Spotify authorization if the access token is not in the URL
            this.redirectToSpotifyAuthorization();
        }
    },

    //Check is the access token is valid
    isAccessTokenValid() {
        return !!this.accessToken;
    },

    //Redirect the use to Spotify authorization
    redirectToSpotifyAuthorization() {
        const clientId = '5f375cbbcb054cf6a3044f0a6f0ccc0c';
        const redirectUri = encodeURIComponent('http://localhost:3000/callback');
        const scopes = encodeURIComponent('playlist-modify-public playlist-modify-private');
        const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes}`;

        window.location.href = authorizationUrl;
    },

    //Make a request to the Spotify API
    async request(endpoint, method = 'GET', body = null) {
        this.getAccessToken();
        const url = `${this.apiUrl}${endpoint}`;

        const options = {
            method,
            headers: {
                Authorization: `Bearer ${this.getAccessToken()}`,
                'Content-Type': 'application/json',
                },
            };

            if (body) {
                options.body = JSON.stringify(body);
            }
            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error(`Failed to fetch data from Spotify API: ${response.statusText}`);
                }

                return response.json();
            } catch (error) {
                console.error('Error making request:', error.message);
                throw error;
            }
        },

    //Get the user's Spotify username:
    async getUserInfo() {
        const endpoint = '/me';
        const response = await this.request(endpoint);
        if (!response.id) {
            throw new Error('Failed to retrieve user information');
        }

        return response.id;
    },

    // Create a new playlist for the user on Spotify
    async createPlaylist(playlistName) {
        try {
            const userId = await this.getUserInfo();
            const endpoint = `/users/${userId}/playlists`;

            const response = await this.request(endpoint, 'POST', {
                name: playlistName,
                description: 'Made using the Jammming app!',
                public: false,
            });

            if (!response.id) {
                throw new Error('Failed to create a new playlist');
            }

            return response.id;
        } catch (error) {
            console.error('Error creating playlist:', error.message);
            throw error;
        }
    },
    
    //Add tracks to playlist in Spotify:
    async addTracksToPlaylist(playlistId, trackUris) {
        try {
          const endpoint = `/playlists/${playlistId}/tracks`;
    
          const response = await this.request(endpoint, 'POST', {
            uris: trackUris,
          });
    
          if (response.error) {
            throw new Error(response.error.message);
          }
    
          console.log('Tracks added to playlist successfully!');
        } catch (error) {
          console.error('Error adding tracks to playlist:', error.message);
          throw error;
        }
      },
    
    //This saves the playlist to Spotify and posts it to the user's profile
    async savePlaylist(playlistName, trackUris, addTrackToPlaylist) {
        try {
            //Create a new playlist
            const playlistId = await this.createPlaylist(playlistName);

            //Add tracks to the new playlist
            await this.addTracksToPlaylist(playlistId, trackUris);

            //Call the existing function to add tracks to the custom playlist in your app
            addTrackToPlaylist(trackUris);

            console.log('Playlist saved successfully!');
        } catch (error) {
            console.error('Error saving playlist', error.message);
        }
    },
};

  
  export default Spotify;