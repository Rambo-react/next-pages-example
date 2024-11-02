import { useRouter } from "next/router"
import { PropsWithChildren } from "react"

export const LoginNavigate = ({children}: PropsWithChildren) => {
  
  const router = useRouter()

  // запрос за данными пользователя(проверка то что юзер зареган)
  // useSelector(state => state.auth.isAuth)
    const isAuth = false 

  if (!isAuth) {
    // редирект куда-то 
    router.push('/test')
  }
 
  return (
    <div>{children}</div>
  )
}
