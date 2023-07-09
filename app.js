require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// 1. require the body-parser
const bodyParser = require('body-parser')
// 2. let know your app you will be using it
app.use(bodyParser.urlencoded({ extended: true }))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:

app.get('/', async (request, response) => {

    response.render('index')
})

app.get('/artist-search', async (request , response) => {
try{

   const searchQuery = request.query.artistName
   console.log(searchQuery)
    const artistSearch = await spotifyApi.searchArtists(searchQuery)
    console.log(artistSearch.body.artists.items.images)
    response.render('artist-search-results', { artists: artistSearch.body.artists.items})
  } 
  catch (error){
    console.log(error)
  } 
})

app.get('/albums/:artistId', async (request, response) => {
try{
  const artistId = request.params.artistId;
  console.log(artistId)
  const artistAlbums = await spotifyApi.getArtistAlbums(artistId)
  console.log(artistAlbums.body.items);
  
  response.render('albums', {albums: artistAlbums.body.items});
}
catch (error){
  console.log(error)
} 
})

app.get('/tracks/:albumId', async (request, response) => {
  try{
    const albumId = request.params.albumId;
    console.log(albumId)
    const albumTracks = await spotifyApi.getAlbumTracks(albumId)
    console.log(albumTracks.body.items);
    
    response.render('tracks', {tracks: albumTracks.body.items});
  }
  catch (error){
    console.log(error)
  }
  
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
