import React from 'react'
import {css} from 'glamor'

import {parseDate, swissTime} from '../../lib/utils/formats'
import {intersperse} from '../../lib/utils/helpers'
import withT from '../../lib/withT'

import {
  Interaction, A, colors,
  fontFamilies, mediaQueries
} from '@project-r/styleguide'

import {CONTENT_PADDING} from '../Frame/constants'

import Share from '../Share'

import {
  PUBLIC_BASE_URL
} from '../../constants'

const BLOCK_PADDING_TOP = 10

const styles = {
  container: css({
    marginBottom: 60
  }),
  block: css({
    padding: `${BLOCK_PADDING_TOP}px 0`,
    borderTop: `1px solid ${colors.divider}`,
    position: 'relative',
    [mediaQueries.mUp]: {
      paddingLeft: CONTENT_PADDING
    }
  }),
  hr: css({
    height: 0,
    border: 0,
    borderTop: `1px solid ${colors.divider}`
  }),
  label: css({
    fontSize: 17,
    fontFamily: fontFamilies.sansSerifMedium,
    [mediaQueries.mUp]: {
      lineHeight: '25px',
      position: 'absolute',
      left: 0,
      top: BLOCK_PADDING_TOP + 3
    }
  })
}

const Label = ({children}) => (
  <div {...styles.label}>{children}</div>
)

const {H1, P} = Interaction

const weekday = swissTime.format('%A')

const Event = withT(({
  t,
  event: {
    title,
    description,
    link,
    date: rawDate,
    time,
    where,
    locationLink,
    slug
  }
}) => {
  const date = parseDate(rawDate)
  let location = !!where && intersperse(
    where.split('\n'),
    (d, i) => <br key={i} />
  )
  if (locationLink && location) {
    location = (
      <A href={locationLink} target='_blank'>
        {location}
      </A>
    )
  }

  return (
    <div {...styles.container}>
      <div {...styles.block}>
        <Label>Was</Label>
        <H1>{title}</H1>
        <P>
          {intersperse(
            (description || '').split('\n'),
            (d, i) => <br key={i} />
          )}
        </P>
        {!!link && (
          <P>
            <A href={link} target='_blank'>
              {link}
            </A>
          </P>
        )}
      </div>

      <div {...styles.block}>
        <Label>Wann</Label>
        <P>{[
          weekday(date),
          rawDate,
          time
        ].join(', ')}</P>
      </div>

      <div {...styles.block}>
        {!!where && <Label>Wo</Label>}
        {!!where && <P>{location}</P>}
        {!!where && <hr {...styles.hr} />}
        <P>
          <Share
            fill={colors.secondary}
            url={`${PUBLIC_BASE_URL}/events/${slug}`}
            emailSubject={title}
            tweet={title} />
        </P>
      </div>
    </div>
  )
})

export default Event