<h1 align="center" style="font-weight: bold;">Project name 💻</h1>

<p align="center">
 <a href="#tech">Technologies</a> •
 <a href="#started">Getting Started</a> •
  <a href="#routes">API Endpoints</a> •
 <a href="#colab">Collaborators</a> •
 <a href="#contribute">Contribute</a>
</p>

<h2 id="routes">📍 API Endpoints</h2>
​
<!-- | route               | description
|----------------------|-----------------------------------------------------
| <kbd>GET /authenticate</kbd>     | retrieves user info see [response details](#get-auth-detail)
| <kbd>POST /authenticate</kbd>     | authenticate user into the api see [request details](#post-auth-detail)

<h3 id="get-auth-detail">GET /api/pokemons_with_likes</h3> -->

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

