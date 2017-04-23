import React from 'react'
import {css} from 'glamor'

import Share from '../Share'
import VideoPlayer from '../VideoPlayer'

import {
  PUBLIC_BASE_URL
} from '../../constants'

import {
  Interaction, fontFamilies,
  P as SerifP, colors
} from '@project-r/styleguide'

const {H3} = Interaction

const styles = {
  detail: css({
    width: '100%',
    padding: '30px 45px',
    float: 'left'
  }),
  detailTitle: css({
    lineHeight: '20px'
  }),
  detailRole: css({
    fontSize: 17,
    fontFamily: fontFamilies.sansSerifRegular,
    color: colors.secondary
  })
}

const Detail = ({t, share, data: {id, name, role, quote, image, video}}) => (
  <div {...styles.detail}>
    <div style={video ? {
      maxWidth: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    } : {}}>
      <H3 {...styles.detailTitle}>
        {name} <span {...styles.detailRole}>{role}</span>
      </H3>
      {video
        ? (
          <div style={{
            marginBottom: 20,
            marginTop: 10
          }}>
            <VideoPlayer key={id} src={{...video, poster: image}} autoPlay />
          </div>
          )
        : <SerifP>«{quote}»</SerifP>
      }
      {share && <Share
        url={`${PUBLIC_BASE_URL}/community?id=${id}`}
        emailSubject={t('testimonial/detail/share/emailSubject', {
          name,
          role
        })} />}
    </div>
  </div>
)

Detail.defaultProps = {
  share: true
}

export default Detail
