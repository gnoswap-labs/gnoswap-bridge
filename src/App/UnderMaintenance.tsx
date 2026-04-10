import React, { ReactElement, useState } from 'react'

import maintenancePng from 'images/maintenance.png'

import { COLOR } from 'consts'

import { Text, View } from 'components'

import FormImage from 'components/FormImage'

const UnderMaintenance = (): ReactElement => {
  const [hideMaintenance, setHideMaintenance] = useState(false)
  const hide = (): void => setHideMaintenance(true)

  const isUnderMaintenance = false

  if (isUnderMaintenance && false === hideMaintenance) {
    return (
      <div className="fixed z-10 top-0 bg-[#202020] w-full h-full flex items-center">
        <View className="mx-auto items-center max-w-[640px] p-10 rounded-[2em] max-[575px]:rounded-none max-[575px]:p-5">
          <View style={{ marginBottom: 20 }}>
            <FormImage size={80} src={maintenancePng} />
          </View>
          <Text className="text-2xl font-medium mb-4 max-[575px]:mb-2">
            Under Maintenance
          </Text>
          <Text className="text-base mb-7 max-[575px]:mb-5">
            We will be back on Phoenix-1 soon.
          </Text>

          <a
            className="cursor-pointer text-white bg-bridge-sky no-underline py-3 px-7 rounded-[1.5rem]"
            href="https://classic-bridge.station.money"
          >
            Use Bridge Classic
          </a>
          {window.location.host !== 'bridge.station.money' && (
            <Text
              className="cursor-pointer text-bridge-sky underline mt-8"
              onClick={hide}
            >
              Enter anyway [just for testing]
            </Text>
          )}
        </View>
      </div>
    )
  }
  return <View />
}

export default UnderMaintenance
