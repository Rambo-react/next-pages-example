## Manual

### 1) если нужно глобальные стили подключить, то только в файл _app.tsx

### 2) для картинки в next.config.js добавляем images: {}

```bash
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
        pathname: '/api/character/avatar/**'
      }
    ]
  }
};
```

### 3) перейти на другой адрес 

```bash
<Link href={'/characters'}>characters</Link>
```

### 4) layout оборачивает страницу 

```bash
import { NextPage } from "next";
import { PropsWithChildren } from "react";

import styles from "@/styles/Home.module.css";

import { Navbar } from "../Navbar/Navbar";
import { ReactElement } from "react";

export const Layout: NextPage<PropsWithChildren> = (props) => {

  const {children} = props

  return (
    <main className={styles.main}>
        <Navbar />
         {children}
        </main>
  )
}

export const getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}
```

```bash
//_app.tsx

import "@/styles/globals.css";

import type { ReactElement, ReactNode } from "react";
import type {NextPage} from 'next'
import type {AppProps} from 'next/app'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NextPageWithLayout< P= {}, IP=P> = NextPage<P, IP> & {
  getLayout? : (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({Component, pageProps}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

```bash
// characters/index.tsx
import { useCharacters } from "@/assets/hooks/useCharacters";
import { CharacterCard } from "@/components/CharacterCard/CharacterCard";
import { HeadMeta } from "@/components/HeadMeta/HeadMeta";
import { getLayout } from "@/components/Layout/Layout";



 function Characters() {

  const  characters  = useCharacters()

  return (
    <>
      <HeadMeta title={'Characters'} /> 
          {characters && characters.map((character) => (
          <CharacterCard character={character} key={character.id} />
         ))}
             
    </>
  );
}


Characters.getLayout = getLayout
export default Characters
```

### 5) параметры в адресной строке 
создать файл characters/[id].tsx

```bash
import { useCharacter } from "@/assets/hooks/useCharacter";
import { CharacterCard } from "@/components/CharacterCard/CharacterCard";
import { HeadMeta } from "@/components/HeadMeta/HeadMeta";
import { getLayout } from "@/components/Layout/Layout";

 function Character() {

  const  character  = useCharacter()

  return (
    <>
      <HeadMeta title={'Characters'} /> 
          {character && <CharacterCard character={character} />}
             
    </>
  );
}


Character.getLayout = getLayout
export default Character
```

переход по пути добавляем Link

```bash
function Characters() {

  const  characters  = useCharacters()

  return (
    <>
      <HeadMeta title={'Characters'} /> 
          {characters && characters.map((character) => (
          <Link key={character.id} href={`/characters/${character.id}`}><CharacterCard character={character}  /></Link>
         ))}
             
    </>
  );
}
```

### 6) статические файлы должны находиться в папке public
 если есть картинка например next.svg 
 доступ к ней можно получить напрямую '/next.svg' , без указания public

### 7) переменные окружения создаем в файле '.env.local'
 если нужно что бы переменную было видно в бразуере нужен префикс NEXT_PUBLIC
 иначе можно давать любое имя

```bash
NEXT_PUBLIC_RICK_AND_MORTY_API_URL=https://rickandmortyapi.com/api
```

используем например в useCharacter.ts

```bash
export const useCharacter = (): Nullable<CharacterType> => {
  const [character, setCharacter] = useState<Nullable<CharacterType> >(null)

  const router = useRouter()

  useEffect(()=> {
    axios.get(`${process.env.NEXT_PUBLIC_RICK_AND_MORTY_API_URL}/character/${router.query.id}`).then((res)=> setCharacter(res.data))
  }, [])

  return character
}
```

### 8) абсолютные пути в tsconfig.json
 добавляем baseUrl: '.'

```bash
{
  "compilerOptions": {
    "baseUrl": ".",
    ...
    }
  }
}
```

теперь можно использовать пути относительно корневой папки 

```bash
// было
import { useCharacters } from "@/assets/hooks/useCharacters";
// стало
import { useCharacters } from "assets/hooks/useCharacters";
```


### 9) при переходе на не существующую страницу, есть дефолтная 404
 но, можно ее кастомизировать: создать файл pages/404.tsx
 
 пример 
```bash

import { getLayout } from '@/components/Layout/Layout'
import React from 'react'

export const NotFount = () => {
  return (
    <div>404 Not Fount</div>
  )
}

NotFount.getLayout = getLayout
export default NotFount
```

### 10) все страницы по умолшчнию статические STATIC GENERATION плюс в (SEO оптимизации)

### 11) если есть такая функция export const getStaticProps ,
 то она вызывается единожды на сервере во время билда потом возвращается страница

```bash
import { API } from "assets/api/api"
import { CharacterType, ResponseType } from "assets/api/rick-and-morty-api"
import { Header } from "components/Header/Header"
import { PageWrapper } from "components/PageWrapper/PageWrapper"

export const getStaticProps = async () => {
  const characters = await API.rickAndMorty.getCharacters()

  return {
    props: {
      characters
    }
  }
}

type Props = {
  characters: ResponseType<CharacterType>
}

const Characters = (props: Props) => {

  const {characters} = props
  
  const characterList = characters.results.map(character=>(
    <div key={character.id}>{character.name}</div>
  ))

  return (
    <PageWrapper>
        <Header/>
        {characterList}
    </PageWrapper>
  )
}

export default Characters
```

### 12) server side render
 getServerSideProps вызывается каждый раз когда вы запрашиваете страницу

```bash
export const getServerSideProps = async () => {
  const episodes = await API.rickAndMorty.getEpisodes()

  //если эпизоды не нашлись, то страница переключится на 404
   if (!episodes) {
    return {
      notFound: true
    }
   }

  return {
    props: {
      episodes
    }
  }
}
```

### 13) client side + react query
 _app.tsx

```bash
import type {AppProps} from 'next/app';
import {ReactElement, ReactNode, useState} from 'react';
import {NextPage} from 'next';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  
  const [queryClient] = useState(()=> new QueryClient)
  
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydrateState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
);
}
```

 locations/index.tsx

```bash
import { useQuery } from "@tanstack/react-query"
import { LocationType, ResponseType } from "assets/api/rick-and-morty-api"
import { Header } from "components/Header/Header"
import { PageWrapper } from "components/PageWrapper/PageWrapper"

// export const getStaticProps = async () => {
// }

const getLocations = () => {
  return fetch('https://rickandmortyapi.com/api', {
    method: 'GET'
  }).then(res=>res.json())
}


const Locations = () => {

  const {data: locations} = useQuery<ResponseType<LocationType>>(['locations'], getLocations)

  if (!locations) {
    return null
  }
  
  const locationsList = locations.results.map(location=>(
    <div key={location.id}>{location.name}</div>
  ))

  return (
    <PageWrapper>
        <Header/>
        {locationsList}
    </PageWrapper>
  )
}

export default Locations
```

### 14) данные которые мы запросили на сревере, мы хотим их внедрить на клиентскую сторону 
 но запрос мы делаем на сервере. И приходят готовые данные с сервака.
 гидратация - приходит html и в момент когда она в браузер загрузилась
 на нее начинают подгружаться события и тд( javascript в общем).
 Еще dehydratedState для кеша: делает кеш единым.
 Нагрузку дали на сервер.
 Initialstate достали из useQuery, и записали из пропсов.
 данные последней инстанции буду в Initialstate

```bash
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { LocationType, ResponseType } from "assets/api/rick-and-morty-api"
import { Header } from "components/Header/Header"
import { PageWrapper } from "components/PageWrapper/PageWrapper"

const getLocations = () => {
  return fetch('https://rickandmortyapi.com/api/location', {
    method: 'GET'
  }).then(res=>res.json())
}

export const getStaticProps = async () => {

  const queryClient = new QueryClient()

  await queryClient.fetchQuery(['locations'], getLocations)


  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const Locations = () => {

  const {data: locations} = useQuery<ResponseType<LocationType>>(['locations'], getLocations)

  if (!locations) {
    return null
  }
  
  const locationsList = locations.results.map(location=>(
    <div key={location.id}>{location.name}</div>
  ))

  return (
    <PageWrapper>
        <Header/>
        {locationsList}
    </PageWrapper>
  )
}

export default Locations
```

### 15) progressbar при переходе между страницами 
 hooks/useLoader.tsx

```bash
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
```

_app.tsx

```bash
import type {AppProps} from 'next/app';
import {ReactElement, ReactNode, useState} from 'react';
import {NextPage} from 'next';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLoader } from 'assets/hooks/useLoader';
import 'styles/nprogress.css'

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  
  const [queryClient] = useState(()=> new QueryClient)

  useLoader()
  
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydrateState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
);
}
```

### 16) Если у нашего компонента(страницы) есть функция getLayout , то 
 мы эту страницу оборачиваем BaseLayout и отрисовываем,
 если нету, то отрабатывает заглушка (page) => page), принимаем page и возвращаем тот же page

 _app.tsx

```bash
const getLayout = Component.getLayout ?? ((page) => page);

return getLayout(
  <QueryClientProvider client={queryClient}>
    <Hydrate state={pageProps.dehydrateState}>
      <Component {...pageProps} />
    </Hydrate>
  </QueryClientProvider>
);

// BaseLayout.tsx
import { NextPage } from "next";
import { PropsWithChildren, ReactElement } from "react";
import { Layout } from "../Layout";

export const BaseLayout: NextPage<PropsWithChildren> = (props) => {
  const {children} = props

  return (
    <Layout>
    {children}
    </Layout>
  )

}

export const getLayout = (page: ReactElement) => {
  return <BaseLayout>{page}</BaseLayout>
}
```

 что бы этот метод появился у нашей сттраницы , мы его должны определить 
 
 например pages/indexed.tsx

```bash
import Image from 'next/image';
import {NextPageWithLayout} from './_app';
import {PageWrapper} from '../components/PageWrapper/PageWrapper';
import {Header} from '../components/Header/Header';
import { getLayout } from 'components/Layout/BaseLayout/BaseLayout';

const Home: NextPageWithLayout = () => (
    <PageWrapper>
        <Header/>
        <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
        />
    </PageWrapper>
);

Home.getLayout = getLayout

export default Home;
```

 может быть несколько Layout, например в другом layout добавляется помимо header и footer , блок contacts или что-то другое
 например добавим Contacts

```bash
import { NextPage } from "next";
import { PropsWithChildren, ReactElement } from "react";
import { Layout } from "../Layout";

export const SpecialLayout: NextPage<PropsWithChildren> = (props) => {
  const {children} = props

  return (
    <Layout>
      <Contacts/>
    {children}
    </Layout>
  )

}

export const getSpecialLayout = (page: ReactElement) => {
  return <SpecialLayout>{page}</SpecialLayout>
}
```

characters.tsx

```bash
...
Characters.getLayout = getSpecialLayout

export default Characters
```
### 17) динамичемские роуты

characters/1
 [id].tsx

characters/234234234/1
 [...id].tsx - этот роут будет открываться на любой роут помимо id

 [[id]].tsx - этот роут опционален, тут может быть id или его может не быть, он всё равно откроется

### 18) getStaticProps принимает всегда контекст (context), можно достать параметры урла
 export const getStaticProps: GetStaticProps = async (ctx) => {
 Деструктуризируем   context : {params}
 export const getStaticProps: GetStaticProps = async ({params}) => {

```bash
  export const getStaticProps: GetStaticProps = async ({params}) => {

      // если нет в урле после / ничего, то берем из пустого обьекта 
    const {id} = params || {}
  
    const character = await API.rickAndMorty.getCharacter(id as string)
  
    if (!character) {
      return {
        notFound: true
      }
    }
  
    return {
      props: {
        character
      }
    }
  }
```

### 19) getStaticPaths  - асинхронная функция тоже вызывается на сервере и используется для статической
   генерации нескольких страниц сразу
   например у нас есть 20 персонажей и мы хотим их заранее сгенерировать для лучшего пользовательског оопыта
   что бы они быстрее отдавались, кэшировались
   делает запрос за всеми нашими персонажами
   используется в связке с getStaticProps
   getStaticPaths - генерирует пути для предзапроса данных
   должен вернуть массив с обьектами вида например: 
   [{params:{id:1}},{params:{id:2}},{params:{id:3}},{params:{id:4}}]
   getStaticProps - генерирует саму страничку, т.е. с 1 айдишкой, со 2 айдишкой и т.д.

```bash
import { API } from "assets/api/api"
import { CharacterType, ResponseType } from "assets/api/rick-and-morty-api"
import { CharacterCard } from "components/Card/CharacterCard/CharacterCard"
import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"

  // делаем пути для наших персонажей
export const getStaticPaths: GetStaticPaths = async () => {
  const {results} = await API.rickAndMorty.getCharacters()

  const paths = results.map(character => ({
    params: {id: String(character.id)}
  }))

  //paths: [{params:{id:1}},{params:{id:2}},{params:{id:3}},{params:{id:4}}]
  // по дэфолту с апишки нам приходит первая страница данных (их 20) с помощью getCharacters
  //если мы в адрес передаём /characters/30 например, а на сервере у нас сгенерировано 20
  //fallback: false - то мы получим 404(типо не жди, не будет тут ничего)
  //fallback: true - генерирует в фоне, используем лоадер 
  //fallback: 'blocking' - блокирует UI пока не сгенерирует новую страницу количество страниц сгенерированных на серваке станет 21 
  return {
    paths,
    fallback:false
  }
}

  //создаем страницы , если персонажей 20, то будет 20 страниц
export const getStaticProps: GetStaticProps = async ({params}) => {

  // если нет в урле после / ничего, то берем из пустого обьекта 
  const {id} = params || {}

  const character = await API.rickAndMorty.getCharacter(id as string)

  if (!character) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      character
    }
  }
}

type Props = {
  character: CharacterType
}


const Character = (props: Props) => {

  const {character} = props

  const router = useRouter()

  //fallback: true 
  if (router.isFallback) return <h1>Loading...</h1>

  return (
    <PageWrapper>
        <CharacterCard key={character.id} character={character} />
    </PageWrapper>
  )
}

Character.getLayout = getLayout

export default Character
```

### 20) параметры из router
[id].tsx
в query называется именно id, потому что файл называется [id].tsx

```bash
 const characterId = router.query.id

 return (
   <PageWrapper>
     <IdText>ID: {characterId.id}</IdText>
       <CharacterCard key={character.id} character={character} />
   </PageWrapper>
 )
```

### 21) меняем роут с помощью router.push

```bash
 const goToCharacters = () => {
  router.push('/characters')
}

return (
  <PageWrapper>
    <IdText>ID: {characterId}</IdText>
      <CharacterCard key={character.id} character={character} />
      <button onClick={goToCharacters}>GO TO CHARACTERS</button>
  </PageWrapper>
)
```

### 22) в nextjs можно менять мета информацию для каждой страницы, используем компонент Head 
для изменения шрифта, подключить css или еще что-то 

components/HeadMeta/HeadMeta.tsx

```bash
import Head from "next/head";

type PropsType = {
  title?: string;
};

export const HeadMeta = (props: PropsType) => {
  const { title } = props;

  const description = title
    ? `Rick and Morty ${title.toLowerCase()}`
    : "Master class for IT-incubator";

  return (
    <Head>
      <title>{title ?? "NextJS Master Class"}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.svg" />
    </Head>
  );
};
```

components/PageWrapper/PageWrapper.tsx

```bash
import { PropsWithChildren } from "react";
import styled from "styled-components";
import {HeadMeta} from '../HeadMeta/HeadMeta';

type PropsType = {
  title?: string;
};

export const PageWrapper = (props: PropsWithChildren<PropsType>) => {
  const { children, title } = props;

  return (
    <>
      <HeadMeta title={title} />
      <MainBlock>{children}</MainBlock>
    </>
  );
};

const MainBlock = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  row-gap: 15px;
  column-gap: 15px;
  position: relative;
  padding: 4rem 0;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 700px) {
    padding: 8rem 0 6rem;
  }
`;
```

### 23) ALIASES
 tsconfig.json

```bash
"compilerOptions": {
  ...
  "paths": {
    "@types/*": ["./assets/types/*"]
  }
}
```

### 24) БЭК на нексте, создаем эндпоинты
 создаем файл в pages/api/books.ts

```bash
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = BookType[]

type BookType = {
  id:number
  title: string
}

const booksDB = [
  {id: 1, title: 'name 1'},
  {id: 1, title: 'title 1'},
  {id: 1, title: 'name 2'},
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method === 'GET') {
    res.status(200).json(booksDB)
  }

}
```

### 25) достаем query params при запросе 
 например делаем фильтр по строке title
 /api/books?term=name

```bash
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = BookType[]

type BookType = {
  id:number
  title: string
}

const booksDB = [
  {id: 1, title: 'name 1'},
  {id: 1, title: 'title 1'},
  {id: 1, title: 'Name 2'},
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method === 'GET') {

    let books = booksDB

    const term = req.query.term as string

    if (term) {
      books.filter(books => books.title.toLowerCase().includes(term.toLowerCase()))
    }

    res.status(200).json(booksDB)
  }
}
```

### 26) все статические файлы: картинки и т.д. храняться в public
 при использовании наших картинок из public, next резервирует место на экране для этой картинки
 что бы при загрузке саой картинки не было скаканий экрана 0px => 20px 
 обязательно указываем ширину и высоту и альт

 1) доступ к ним напрямую через 
```bash
<Image src={'statuses/alive.png'} alt={''} width={20} height={20}/>
```

 2) доступ через импорт ширину и высоту не обязательно использовать
 возмет из картинки ширину и высоту
```bash
import aliveStatus from "public/statuses/alive.png";

<Image src={aliveStatus} alt={''} />
```

### 27) Типизация картинки , если ее передаем в качестве пропса 
 тут CharacterCard.tsx , импортируем файлы "картинки"

```bash
import { Card } from "../Card";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import aliveStatus from "public/statuses/alive.png";
import deadStatus from "public/statuses/dead.png";
import unknownStatus from "public/statuses/unknown.png";
import {CharacterType} from '../../../assets/api/rick-and-morty-api';
import { Status } from "./Status/Status";

const statusImages = {
  Alive: aliveStatus,
  Dead: deadStatus,
  unknown: unknownStatus,
};

type PropsType = {
  character: CharacterType;
};

export const CharacterCard = (props: PropsType) => {
  const { id, name, image, status } = props.character;

  return (
    <Card name={name}>
      <Status status={status} src={statusImages[status]}/>
      <Link href={`/characters/${id}`}>
        <ImageBlock src={image} alt={name} width={300} height={300} priority />
      </Link>
    </Card>
  );
};

const ImageBlock = styled(Image)`
  object-fit: cover;
`;
```

 Status.tsx используем картинки 
 типизация src: StaticImageData

```bash
import { CharacterStatusType } from "assets/api/rick-and-morty-api"
import Image, { StaticImageData } from "next/image"

type Props = {
  status: CharacterStatusType
  src: StaticImageData
}

export const Status = (props:Props ) => {

  const {status, src} = props

  return (
    <Image src={src} alt={''} width={20} height={20}/>
  )
}
```

### 28) fill - расширит картинку на высоту и ширину родительского элемента
 родительскому элементу нужно задать position : relative, fixed, absolute и т.д.

```bash
<Image src={src} alt={''} width={20} height={20} fill/>
```

### 29) Кастомные страницы 500 и 404
 создать файлы
 pages/404.tsx
 pages/500.tsx

```bash
import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"

const NotFound = () => {
 return <PageWrapper>404 NOT FOUND</PageWrapper>
}


NotFound.getLayout = getLayout
export default NotFound
```

### 30) ПРОИЗВОДИТЕЛЬНОСТЬ
 1) first contentful paint - время до загрузки первого контента
 2) time to interactive - (время до взаимодействия, наступает после гидратации) 
 в момент когда отрендарился ДОМ, осталось добавить интерактив, события, элементы

 в интрументах разработчика lighthouse

 ЛУЧШЕ всего использовать инкогнито во время проверки.

 1. делаем build
 2. start
 3. заходим в лайтхаус в инкогнито вкладке и запускаем

 в режиме dev кэш очищается постоянно, поэтому не получится точно определить производительность прилдожения

### 31) getStaticProps - (функция выполняется одни раз во время билда)
 всегда отдаётся одна и та же страница закэширована

### 32) getServerSideProps - при посещении страницы всегда выполняется функция и обращается на сервак
 (актуальные данные) динамический список товаров

### 33) getServerSideProps кэширование
 res - context.response

```bash
export const getServerSideProps: GetServerSideProps = async ({res}) => {

  //ставим заголовки, на 100 секунд данные остаются свежими,
  // весь код не выполняется а возвращает те же данные 
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=100')
  
  const episodes = await API.rickAndMorty.getEpisodes()

  //если эпизоды не нашлись, то страница переключится на 404
   if (!episodes) {
    return {
      notFound: true
    }
   }

  return {
    props: {
      episodes
    }
  }
}
```

### 34) ревалидация - перезапрос данных, например через некоторое время 

 getStaticProps - во время билда один раз выполнилась и все , но 
 если есть revalidate: 60 , (в секундах) то если мы перезапросим эту страницу через 60 секунд
 то он выполнит getStaticProps еще раз  
 в случае если не получится выполнить запрорс к данныем, то отобразит предыдущие данные 

```bash
export const getStaticProps = async () => {
  const characters = await API.rickAndMorty.getCharacters()

  return {
    props: {
      characters
    },
    revalidate: 60
  }
}
```

### 35) получаем статическую информацию из файловой системы
 если в этом файле при build изменять данные , то они не изменятся , т.к. уже сбилджены
 в dev режиме всё будет обновляться автоматом
  но для прода нам нужно сделать ревалидацию по требованию
 public/staticData.json

```bash
{
  "title": "OLD STATIC DATA"
}
```

pages/test/test.tsx

```bash
import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"
import path from "path"
import fs from 'fs/promises'

export const getStaticProps = async () => {
  
  //process.cwd() - корневая папка проекта
  const getParseData = async (): Promise<{title: string}> => {
    const filePath = path.join(process.cwd(), 'public', 'staticData.json')

    //fs - модуль для чтения данных из файловой системы
    try {
      const jsonData = await fs.readFile(filePath)
      return JSON.parse(jsonData.toString())
    } catch (err) {
      return {title: 'no title'}
    }

  }

  const { title } = await getParseData()

  return {
    props: {
      title
    }
  }
}

type Props = {
  title: string
}

const Test = (props: Props) => {

  const {title} = props
  
  return (
    <PageWrapper>
        {title}
    </PageWrapper>
  )
}

Test.getLayout = getLayout

export default Test
```

### 36) ревалидация по требованию
 создаем файл pages/api/revalidate.ts
 что бы обновить данные идем по адресу http://localhost:3000/api/revalidate?secret=KfILnCKwQLCd

```bash
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.NEXT_PUBLIC_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }
 
  try {
    // This should be the actual path not a rewritten path
    // e.g. for "/posts/[id]" this should be "/posts/1"
    // revalidate выполнит getStaticProps
    await res.revalidate('/test')
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
```

### 37) динамические импорты lazy loadings 
 генерируется все равно на сервере
 ```bash
const CharacterCard = dynamic(()=> import('components/Card/CharacterCard/CharacterCard')
.then(module => module.CharacterCard))
```

что бы отключить сервер сайд рендеринг для этого компонента

```bash
const CharacterCard = dynamic(()=> import('components/Card/CharacterCard/CharacterCard')
.then(module => module.CharacterCard),
  {ssr: false,
    loading: () => <h1>Loading.. </h1>
  }
)
```

### 38) приватные роуты, можно заходить только пользователю который зарегестрирован
создаем HOC , в котором проверяем зареган ли юзер
и в зависимости от этого отрисовываем children или редирект на какую-то страницу

 hoc/LoginNavigate.tsx

```bash
import { useRouter } from "next/router"
import { PropsWithChildren } from "react"

export const LoginNavigate = ({children}: PropsWithChildren) => {
  
  const router = useRouter()

  // запрос за данными пользователя(проверка то что юзер зареган)
  // useSelector(state => state.auth.isAuth)
    const isAuth = true 

    if (!isAuth) {
      // редирект куда-то 
      router.push('/test')
    }
 
  return (
    <div>{children}</div>
  )
}
```

 использование pages/private/index.tsx

```bash 
import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"
import { LoginNavigate } from "hoc/LoginNavigate"

const Private = () => {
  
  return (
    <LoginNavigate>
      <PageWrapper>
          PRIVATE PAGE
      </PageWrapper>
    </LoginNavigate>
  )
}

Private.getLayout = getLayout

export default Private
```

### 39) сделать редирект без моргания
 episodes.tsx

```bash
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
```

### 40) next redux wrapper 
 что бы использовать стор на стороне сервака 
 проверяем какие-то данные на клиенте, но на стороне сервера, как бы передаём стор на сервак 
 wrapper.
 библиотека
 https://github.com/kirill-konshin/next-redux-wrapper