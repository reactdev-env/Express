// I will create a router that will handle these three APIS
AUTHROUTER
- post/signup
- post/login  when the request came to login of user, it can be handled by the auth router
- post/logout



// I will create a another router that will handle these three APIS
Profile Router
-GET/Profile view
- Patch/profile/edit
- PATCH/profile/password

// I will create a another router that will handle these three APIS
ConnectionRequestRouter 
- POST /request/send/intrested/:userID
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId


// I will create a another router that will handle these two APIS
-GET/user/connections
- GET/user/requests/received
- GET/user/feed - gets you the profile of other users on platform

Status: ignore, intrested, accepted, rejected