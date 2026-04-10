import { AnchorHTMLAttributes, ReactElement } from 'react'

export type Props = AnchorHTMLAttributes<HTMLAnchorElement>
const ExtLink = ({ children, ...attrs }: Props): ReactElement => (
  <a
    className="text-bridge-sky hover:opacity-100"
    {...attrs}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)

export default ExtLink
