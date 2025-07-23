import jwt_decode from "jwt-decode";

// Define the structure of your token payload
interface DecodedToken {
  isAdmin?: boolean;
  exp?: number;
  [key: string]: any; // Allows for additional properties
}

export function isAdmin(
  Token: string
): true | { success: false; error: string } {
  try {
    const decodedToken = jwt_decode<DecodedToken>(Token);
    console.log(decodedToken);

    if (decodedToken.isAdmin === true) {
      return true;
    } else {
      return { success: false, error: "is not admin" };
    }
  } catch (err) {
    return { success: false, error: "invalid token" };
  }
}

export function isValidTokenWithAdmin(
  Token: string
): true | { success: false; error: string } {
  try {
    const decodedToken = jwt_decode<DecodedToken>(Token);
    const currentDate = Date.now() / 1000;

    console.log(`current date: ${currentDate}`);
    console.log(`token exp: ${decodedToken.exp}`);

    if (!decodedToken.exp || currentDate > decodedToken.exp) {
      return { success: false, error: "token is expired" };
    }

    return isAdmin(Token);
  } catch (err) {
    return { success: false, error: "invalid token" };
  }
}
