import {LuGithub, LuLinkedin, LuMail} from 'react-icons/lu'

const ICON_MAP = {
  LuGithub,
  LuLinkedin,
  LuMail,
}

export function DynIcon({name, className}) {
  const Component = ICON_MAP[name]
  if (!Component) return null
  return <Component className={className}/>
}