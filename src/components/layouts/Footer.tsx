import { ReactElement } from 'react'

import { ExtLink, Text, Row, View, Container } from 'components'

const Footer = (): ReactElement => {
  const community = [
    {
      href: `https://docs-terra.pages.dev/`,
      title: 'Docs',
    },
    {
      href: `https://terra.sc/discord`,
      title: 'Discord',
    },
    {
      href: `https://t.me/TerraNetworkLobby`,
      title: 'Telegram',
    },
    {
      href: `https://github.com/terra-project/bridge-web-app`,
      title: 'Github',
    },
  ]
  return (
    <Container className="flex flex-row items-center justify-between max-w-[640px] py-7 opacity-50 max-[575px]:w-auto max-[575px]:mt-0 max-[575px]:px-6">
      <Row
        style={{
          justifyContent: window.innerWidth > 575 ? 'space-between' : 'center',
          flex: 1,
          display: window.innerWidth > 575 ? 'flex' : 'block',
          textAlign: window.innerWidth > 575 ? 'initial' : 'center',
          alignItems: 'center',
          marginTop: -5,
        }}
      >
        <View>
          <Text className="text-sm font-normal tracking-[-0.22px]">
            &copy; Terraform Labs.
          </Text>
        </View>
        <Row
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            marginLeft: -30,
            marginTop: window.innerWidth > 575 ? 0 : 12,
          }}
        >
          {community.map(
            ({ href, title }) =>
              href && (
                <View key={title}>
                  <ExtLink
                    href={href}
                    style={{
                      paddingLeft: window.innerWidth > 575 ? 30 : 30,
                      fontSize: 13,
                      textTransform: 'uppercase',
                    }}
                  >
                    <Text className="text-sm font-normal tracking-[-0.22px]">
                      {title}
                    </Text>
                  </ExtLink>
                </View>
              )
          )}
        </Row>
      </Row>
    </Container>
  )
}

export default Footer
