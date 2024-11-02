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
