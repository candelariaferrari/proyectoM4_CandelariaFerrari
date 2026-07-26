import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  type User
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { getAuthErrorMessage } from "./authErrors";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

const googleProvider = new GoogleAuthProvider();

/* Login */
export async function login({ email,password,}: LoginCredentials): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/*Register*/
export async function register({name,lastname,email,password,}: RegisterCredentials): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: `${name} ${lastname}`,
    });

    return userCredential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/* Login / registro con Google — si la cuenta no existe, Firebase la crea sola */
export async function loginWithGoogle(): Promise<User> {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/* Logout */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}
