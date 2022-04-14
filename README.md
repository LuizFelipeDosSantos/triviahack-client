# TRIVIHACK

## Description

Test your knowlegde in different areas with this quiz app and create your own quiz.

## User Stories

-  **404** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup** As an anon I can sign up in the platform so that I can start taking a quiz of my choice or create new ones
-  **Login** As a user I can login to the platform
-  **Logout** As a user I can logout from the platform so no one else can use it
- **Home Page** As a user I can choose single player or multi player mode.
-  **Quiz Categories** As a user I can choose a quiz category and see list of quizzes created by user and friends
-  **Quiz Level** As a user I can choose a level of difficulty
-  **Play Quiz** As a user I can answer 10 questions for each quiz and gain a score
-  **My Quizzes** As a user I can create, edit and delete my own quizzes
-  **Profile** As a user I can change my avatar, add friends and see leaderboard

## Backlog

-  **Play Quiz** As a user I can invite friends to play quiz

  
# Client

## Routes

- / - Login
- /signup - Signup form
- /home - homepage with mode choice
- /categories - quiz category list
- /level - level of difficulty
- /quiz - single quiz game
- /quiz/list - list of quizzes created by user
- /quiz/create - create a new quiz
- /quiz/edit/:id - edit a quiz
- /profile - see user profile
- 404

## Pages

- Log in Page (public)
- Sign up Page (public)
- Home page (user only)
- List of Quiz Categories (user only)
- Level of Difficulty (user only)
- Quiz (user only)
- Quiz List (user only)
- Create Quiz (user only)
- Edit Quiz (user only)
- Profile Page (user only)
- 404 (public)

## Components // to be edited

- Question component
  - Input: restaurant: any
  - Output: favorite(restaurantId: string, on: boolean)
- ... component
  - Output: change(terms: string)

## IO


## Services // to be edited

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
  - auth.getUser() // synchronous
- Restaurant Service
  - restaurant.list()
  - restaurant.create(data)
  - restaurant.detail(id)
  - restaurant.addFavorite(id)
  - restaurant.removeFavorite(id)   

# Server

## Models

User model

```
username - String // required & unique
email - String // required & unique
password - String // required
avatar - UrlString
friends - [ObjectID<User>]
Score - Number (Score * Level - added with every quiz taken, except quizzed created by this user)
```

Quiz model

```
owner - ObjectID<User> // required
name - String // required
difficulty - enum [ easy, medium, hard ]
```

Question model

```
quiz - ObjectID<Quiz> // required
question - String // required
incorrect_answers - [String]
correct_answer - String
```

## API Endpoints/Backend Routes // to be edited

- GET /auth/me
- POST /auth/signup
  - body:
    - username
    - email
    - password
- POST /auth/login
  - body:
    - username
    - password
- POST /auth/logout
  - body: (empty)
- POST /user/me/favorite
  - body:
    - restaurantId
- DELETE /user/me/favorite/:restaurantId
  - body: (empty)
- GET /restaurant
- POST /restaurant
  - body:
    - name
    - phone
    - address
- GET /restaurant/:id

  

## Links

### Trello

[Link to your trello board](https://trello.com/b/sMbPrnWa/triviahack)

### Git

The url to your repository and to your deployed project

[Server repository Link](https://github.com/Rowe32/triviahack-server)
[Client repository Link](https://github.com/LuizFelipeDosSantos/triviahack-client)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)