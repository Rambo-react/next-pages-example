import { API } from "assets/api/api"
import {  EpisodeType, ResponseType } from "assets/api/rick-and-morty-api"
import { Card } from "components/Card/Card"
import { Header } from "components/Header/Header"
import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"
import { GetServerSideProps } from "next"

// res - context.response
export const getServerSideProps: GetServerSideProps = async ({res}) => {
  
 // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=100')
  
  const episodes = await API.rickAndMorty.getEpisodes()

  // проверка авторизованности
  const isAuth = false

  //если эпизоды не нашлись, то страница переключится на 404
   if (!episodes) {
    return {
      notFound: true
    }
   }

   if (!isAuth) {
    return {
      redirect: {
        destination: '/test',
        permanent: false
      }
    }
   }


  return {
    props: {
      episodes
    }
  }
}

type Props = {
  episodes: ResponseType<EpisodeType>
}


const Episodes = (props: Props) => {

  const {episodes} = props
  
  const episodesList = episodes.results.map(episode=>(
    <Card key={episode.id} name={episode.name}/>
  ))

  return (
    <PageWrapper>
        {episodesList}
    </PageWrapper>
  )
}

Episodes.getLayout = getLayout
export default Episodes