import { useRouter } from "next/router"
import NProgress from 'nprogress'
import { useEffect } from "react"


export const useLoader = () => {
  const router = useRouter()

  useEffect(()=> {
    const startLoading = () => NProgress.start()
    const endtLoading = () => NProgress.done()
  
    router.events.on('routeChangeStart', startLoading)
    router.events.on('routeChangeComplete', endtLoading)
    router.events.on('routeChangeError', endtLoading)

    return () => {
      router.events.off('routeChangeStart', startLoading)
      router.events.off('routeChangeComplete', endtLoading)
      router.events.off('routeChangeError', endtLoading)
    }
  }, [router])

}