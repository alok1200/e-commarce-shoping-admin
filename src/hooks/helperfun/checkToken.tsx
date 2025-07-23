import jwt_decode from "jwt-decode";

interface DecodedToken {
  isAdmin?: boolean;
  exp: number;
  [key: string]: any; // allows for other props
}

type ValidationResult = true | { success: false; error: string };

export function isAdmin(token: string): ValidationResult {
  const decodedToken = jwt_decode<DecodedToken>(token);
  console.log(decodedToken);

  if (decodedToken.isAdmin === true) {
    return true;
  } else {
    return { success: false, error: "is not admin" };
  }
}

export function isValidTokenWithAdmin(token: string): ValidationResult {
  const decodedToken = jwt_decode<DecodedToken>(token);
  const currentDate = Date.now() / 1000;

  console.log(`current date: ${currentDate}`);
  console.log(`token expiration: ${decodedToken.exp}`);

  if (currentDate > decodedToken.exp) {
    return { success: false, error: "token is expired" };
  } else {
    return isAdmin(token);
  }
}
