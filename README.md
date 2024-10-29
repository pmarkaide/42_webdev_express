# Welcome to our Pokedex project! 🎉

This web app is the result of a Web Dev Challenge organized by [Hive Helsinki](https://www.hive.fi/en/).

After a hands-on workshop learning Full Stack dev with Postgree and React, we developed this app to learn first-hand how to build a complete web app.

## 🎯 Challenge requeriments

The coding challenge needed to include the following:

- A front end with at least 3 pages
- User authentication (username and password)
- An API
- The use of an external API
- A database

In the app people will be able to browse Pokémon, see various type of informations about these Pokémon and save their favourite ones.

Browsing the Pokémons should be available for anyone who visits the site, but a user should authenticate themselves (register, login) with a username and password to be able to save their favourites and see other people's profiles with their favourite Pokemon.

## Our Pokedex
TODO: add image / video

## 🚀 What we have Learned
This is the Stack we decided to use for this app:

* Frontend: Next.js, tailwind, skeleton and tostify
* Backend: Express, Axios, JWT + bcrypt, GoooleAuth
* Database: Docker and Postgree

In building this Pokedex, we have learned how to create a fetch call to external APIs from a server and present this information on a nice Frontend build in Next.js and styled with Tailwind. We mix this fetch information with our own database of liked Pokemon, so they can present already a detailed view of which ones are the people's favourites. This can be done by storing the fetched information in our database first, but the goal was to learn how to fetch and handle the response dynamically. To create this merge information, we first need to deploy a Docker container with Postgree, build some tables and learn how to make the Frontend send favourite Pokemon information to our database. To manage all the information exchange among the external API, the Backend database and the Frontend result we needed to develop a server with multiple endpoints (see examples below).

## 🌟 Features
* Responsive Design: Modern Stack for a seamless response.
* Browse: see all existing Pokemon in a nice card view
* Filter: filter the Pokemon you see by type
* Search: Easily find your favourite Pokémon by name.
* Details View: Click on any Pokémon to see its stats, type...
* Register: register as a user using email or GoogleAuth
* Favorite: like all your favourite Pokemon
* Profile: view your profile with your level and favorite Pokemon
* User search: see other registered user profiles
* Settings: manage your username, password etc.

## 📅 What’s Next?
We plan to deploy the app so we can learn this crucial aspect of FS.

Thanks for checking out my project! Happy exploring! 🌟



<h2 id="routes">📍 API Endpoint examples</h2>
​
<h3 id="get-auth-detail">GET /api/pokemons_with_likes</h3>

**RESPONSE**
```json
{
  "name": "bulbasaur",
  "weight": 20,
	"height": 10,
  "types": {},
	"favorites": 3,
	"...more objects"
}
```

<h3 id="post-auth-detail">POST /api/login</h3>

**REQUEST**
```json
{
  "username": "rich",
  "password": "1234"
}
```

**RESPONSE**
```json
{
  "token": "OwoMRHsaQwyAgVoc3OXmL1JhMVUYXGGBbCTK0GBgiYitwQwjf0gVoBmkbuyy0pSi",
	"message": "log",
	"user": "user{}",
}
```

<h3 id="post-auth-detail">POST /api/register</h3>

**REQUEST**
```json
{
  "username": "rich",
	"email": "rich@gmail.com",
  "password": "1234"
}
```
**RESPONSE**
```json
{
  "token": "OwoMRHsaQwyAgVoc3OXmL1JhMVUYXGGBbCTK0GBgiYitwQwjf0gVoBmkbuyy0pSi",
	"message": "Login succesful",
	"user": "user{}",
}
```

<h3 id="post-auth-detail">DELETE /api/users/favorites</h3>

**REQUEST**
- **Headers**:
  - `Authorization`: `Bearer <token>` _(Required)_

- **Body** (JSON):
```json
{
  "userId": "3",
	"pokemonId": "3",
}
```
**RESPONSE**
```json
{
	"message": "message: 'Favorite Pokémon removed successfully'",
}
```

<h3 id="post-auth-detail">PUT /api/users/:id/editUserInfo</h3>

**REQUEST**
- **Headers**:
  - `Authorization`: `Bearer <token>` _(Required)_

- **Body** (JSON):
```json
{
  "username": "cat",
	"email": "cat@gmail.com",
	"id": "1"
}
```
**RESPONSE**
```json
{
	"message": "message: 'Favorite Pokémon removed successfully'",
}
```

