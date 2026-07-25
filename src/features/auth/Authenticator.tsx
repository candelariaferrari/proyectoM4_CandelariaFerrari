/* Engloba toda la aplicacion para darle la info correspondiente   */
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../../services/firebase";

//valor del contexto, para centralizar estados
interface AuthContextValue {
  user: User | null;
  loading: boolean;
}
//creamos el contexto
const AuthContext = createContext<AuthContextValue>({ user: null, loading: true }) //estado inicial

//hook
export function useAuth() {
  return useContext(AuthContext) //valor que devuelve 
}

//provider
interface AuthenticatorProps {
  children: ReactNode;
}

export function Authenticator({ children }: AuthenticatorProps) {
  //estados 
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //simula como una subcripción 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    //manejamos el cleanup
    return unsubscribe;
  }, [])

  //da la info a children 
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}