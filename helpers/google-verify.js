const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const validateGoogleSignIn = async (token = "") => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, picture: imgUrl, email } = ticket.getPayload();
  return { name, imgUrl, email };
};

module.exports = {
  validateGoogleSignIn,
};
