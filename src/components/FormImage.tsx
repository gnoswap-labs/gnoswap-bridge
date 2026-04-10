import { ReactElement } from 'react'

type FormImageProps = {
  src: string
  size?: number
  style?: React.CSSProperties
}

const FormImage = ({ src, size, style }: FormImageProps): ReactElement => {
  return (
    <div
      className="inline-block bg-contain bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${src})`,
        height: size ? `${size}px` : '100%',
        width: size ? `${size}px` : '100%',
        ...style,
      }}
    />
  )
}

export default FormImage
