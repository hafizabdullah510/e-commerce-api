### Register User

[x] 1- Get the request body
[x] 2- check if email already exists
[x] 3- set the role of first user admin
[x] 4- hash the password bcz cannot save password as string
[x] 5- use the bycrypt for above

### JWT

[x] 1- Create Utils folder
[x] 2- Create function jwt sign
[x] 3- Create Function jwt verify

### Cookie

[x] 1- use res.cookie(name,value,auguments(httpOnly,expires))
[x] 2- server send response back with cookie containing token

### CookieParser

Now to make browser automatically pass cookie with following requests instead of manual approach of slitting the token from authorization header and sending with next request
[x] 1- npm i cookie-parser
[x] 2- import cookie parser
[x] 3- use as middleware in server.js

### Cookie in Util

[x] 1- function addCookiesToResponse({res,user})
[x] 2- create json web token in this function instead of controller

### secure and signed

[x] 1- add secure to arguments of res.cookie (process.env.Node_ENV === 'production')
[x] 2- signed: true
[x] 3- add JWT_SECRET to cookieparser function in middleware
[x] 4- now log req.signedCookies instead

### LOGIN

[x] 1- get email and password from user
[x] 2- check if the user with email exists
[x] 3- check if the password matches
[x] 4- send token in cookie same as register

### LOGOUT

[] 1- make cookie value some string such as logout
[] 2- make the expirations time current time

### User Routes
