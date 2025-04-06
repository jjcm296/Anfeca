# Anfeca

## API Routes
### Authentication
| Purpose                | Method | Route                                | Consumes                                          | Returns                                            |
|------------------------|--------|--------------------------------------|---------------------------------------------------|----------------------------------------------------|
| Login                  | POST   | `/api/auth/login`                    | JSON object `{ email, password }`                 | Access token and refresh token                     |
| Register               | POST   | `/api/auth/register`                 | JSON object `{ name, lastName, email, password }` | Success message, JSON Guardian and Account objects |         
| Send verification code | POST   | `/api/auth/verification-code`        | JSON object `{ email }`                           | Success message                                    |
| Verify code            | POST   | `/api/auth/verification-code/verify` | JSON object `{ email, code }`                     | Success message                                    |
| Refresh access token   | POST   | `/api/auth/token/refresh`            | JSON object `{ refreshToken }`                    | New access token                                   |

### Kid
| Purpose                | Method | Route                                | Consumes                         | Returns                 |
|------------------------|--------|--------------------------------------|----------------------------------|-------------------------|
| Create kid profile     | POST   | `/api/kids`                          | JSON Object `{ name }`           | JSON Kid profile object |

## Questions banks
| Purpose                | Method | Route                                | Consumes               | Returns         |
|------------------------|--------|--------------------------------------|------------------------|-----------------|
| Create questions bank  | POST   | `/api/question-banks`                | JSON Object `{ name }` | Success message |

## ConcentraTDA Google acc
- anfecaconcentratda@gmail.com  
- Password321

## command to run the API
`npm i bcrypt cors dotenv express jsonwebtoken mongodb mongoose sib-api-v3-sdk`

## Account registered
zuzzet.hs14@gmail.com
Hola123*

## Technologies used
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- ~~joi~~ I'll implement it later
- Brevo API

## docs I've been using
- [Mongoose ](https://mongoosejs.com/docs/validation.html#custom-validators)
- [Nodemailer](https://www.nodemailer.com/)
- [Brevo](https://developers.brevo.com/reference/sendtransacemail)
- [Express](https://expressjs.com/)
- [crypto](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback) 
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) 
- [JSON Web Token](https://jwt.io/introduction) 
- [Auth0](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/) 
- [JWT & Refresh tokens](https://dev.to/jeanvittory/jwt-refresh-tokens-2g3d)  
- [refresh tokens](https://auth0.com/docs/secure/tokens/refresh-tokens)