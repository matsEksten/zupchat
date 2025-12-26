import { FirebaseError } from "firebase/app";

export function getAccessibleAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "There is already an existing account with this email";
      case "auth/missing-password":
        return "Please enter your password.";
      case "auth/missing-email":
        return "Please enter your email.";
      case "auth/invalid-email":
        return "The email is not valid.";
      case "auth/weak-password":
        return "The password has to contain at least 6 chars.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        return "Incorrect email or password";
      case "auth/too-many-requests":
        return "Too many attempts - please try again later";
      case "auth/requires-recent-login":
        return "For security reasons you need to log out and log in again before deleting your account";
      default:
        return "Something went wrong - please try again in a moment";
    }
  }

  return "Something went wrong. Please try again.";
}
