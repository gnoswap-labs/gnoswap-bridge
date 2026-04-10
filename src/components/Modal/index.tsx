import { ReactElement, useState } from 'react'
import Modal from 'react-modal'
import { X } from 'components/icons'

Modal.setAppElement('#root')

const DefaultModal = ({
  isOpen,
  close,
  children,
  onRequestClose,
  header,
}: {
  isOpen: boolean
  close?: () => void
  children: ReactElement
  onRequestClose?: () => void
  header?: ReactElement
}): ReactElement => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="w-[550px] outline-none mx-auto bg-bridge-gray rounded-[32px] overflow-hidden max-sm:rounded-none max-sm:rounded-t-[20px] max-sm:mb-0"
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,.9)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        },
      }}
    >
      <div className="relative text-center pt-7 pb-[35px] text-base font-medium tracking-tight justify-center max-sm:pb-[26px]">
        {header}
        {close && (
          <a
            onClick={close}
            className="absolute top-[15px] right-[15px] inline-block p-2.5 cursor-pointer text-bridge-white hover:text-bridge-sky hover:no-underline"
          >
            <X size={24} />
          </a>
        )}
      </div>
      {children}
    </Modal>
  )
}

export default DefaultModal

export type ModalProps = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useModal = (): ModalProps => {
  const [isOpen, setIsOpen] = useState(false)
  return {
    isOpen,
    open: (): void => setIsOpen(true),
    close: (): void => setIsOpen(false),
  }
}
