import { ReactElement, useState, useRef } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { CaretDownFill } from 'components/icons'
import NETWORK from '../consts/network'
import Text from './Text'
import { BlockChainType } from 'types'

type FormSelectProps<T> = {
  selectedValue: T
  optionList: {
    value: T
    label: string
    isDisabled?: boolean
    warning?: string
  }[]
  onSelect: (value: T) => void
  size?: 'sm' | 'lg'
  containerStyle?: React.CSSProperties
  menuContainerStyle?: React.CSSProperties
  selectedTextStyle?: React.CSSProperties
  itemStyle?: React.CSSProperties
  icons?: boolean
}

const FormSelect = <T,>({
  selectedValue,
  optionList,
  onSelect,
  containerStyle,
  menuContainerStyle,
  selectedTextStyle,
  itemStyle,
  icons,
}: FormSelectProps<T>): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ClickAwayListener onClickAway={(): void => setIsOpen(false)}>
      <div className="relative">
        <button
          type="button"
          onClick={(): void => setIsOpen(!isOpen)}
          className="cursor-pointer h-full py-[13px] px-[12px] pl-[15px] border-0 rounded-[10px] shadow-[0_12px_7px_-7px_rgba(0,0,0,0.34)] bg-bridge-gray flex justify-between items-center text-xs font-medium tracking-[-0.25px] text-[#e9e9e9] w-full hover:bg-[#323842] focus:outline-none max-[450px]:text-[10px] max-[450px]:py-[10px] max-[450px]:px-[9px] max-[450px]:pl-[12px]"
          style={containerStyle}
        >
          <div className="flex items-center">
            {icons && (
              <img
                className="inline h-[18px] w-[18px] object-contain"
                src={
                  NETWORK.blockChainImage[
                    optionList.find((x) => x.value === selectedValue)
                      ?.value as any as BlockChainType
                  ]
                }
                alt=""
              />
            )}
            <Text
              style={{
                ...selectedTextStyle,
                marginLeft: icons ? 8 : 0,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {optionList.find((x) => x.value === selectedValue)?.label}
            </Text>
          </div>
          <CaretDownFill style={{ fontSize: 9, paddingLeft: 6 }} />
        </button>

        {isOpen && (
          <div
            className="absolute z-10 mt-[5px] border-0 w-full p-0 rounded-[10px] shadow-[0_12px_7px_-7px_rgba(0,0,0,0.34)] bg-bridge-gray"
            style={menuContainerStyle}
          >
            {optionList.map((option, i) => (
              <div
                key={`option-${i}`}
                onClick={(): void => {
                  if (option.isDisabled) return
                  onSelect(option.value)
                  setIsOpen(false)
                }}
                className="cursor-pointer py-[13px] px-[12px] pl-[15px] text-[13px] hover:bg-[#323842] max-[450px]:text-[10px] max-[450px]:py-[10px] max-[450px]:px-[9px] max-[450px]:pl-[12px]"
                style={{
                  ...itemStyle,
                  borderTop: i === 0 ? 'none' : 'solid 1px #292929',
                  borderTopLeftRadius: i === 0 ? '10px' : '0',
                  borderTopRightRadius: i === 0 ? '10px' : '0',
                  borderBottomLeftRadius:
                    i === optionList.length - 1 ? '10px' : '0',
                  borderBottomRightRadius:
                    i === optionList.length - 1 ? '10px' : '0',
                }}
              >
                <div className="flex items-center">
                  {icons && (
                    <img
                      className="inline h-[18px] w-[18px] object-contain"
                      src={
                        NETWORK.blockChainImage[
                          option.value as any as BlockChainType
                        ]
                      }
                      alt=""
                      style={{ opacity: option.isDisabled ? 0.8 : 1 }}
                    />
                  )}
                  <Text
                    style={{
                      ...selectedTextStyle,
                      marginLeft: icons ? 8 : 0,
                      marginRight: 4,
                      color: option.isDisabled
                        ? '#474d57'
                        : icons
                        ? '#B9B9B9'
                        : '#FFFFFF',
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {option.label}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClickAwayListener>
  )
}

export default FormSelect
