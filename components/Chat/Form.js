import React, {Component} from 'react'
import {gql, graphql} from 'react-apollo'
import {compose} from 'redux'
import AutosizeInput from 'react-textarea-autosize'

import withT from '../../lib/withT'
import withMe from '../../lib/withMe'
import {mergeField} from '../../lib/utils/fieldState'

import ErrorMessage from '../ErrorMessage'
import {InlineSpinner} from '../Spinner'
import {styles as fieldSetStyles} from '../FieldSet'

import {
  Field, Button, H2
} from '@project-r/styleguide'

const submitComment = gql`
mutation submitComment($feedName: String!, $content: String!) {
  submitComment(feedName: $feedName, content: $content)
}
`

class CommentForm extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      loading: false,
      serverError: undefined,
      values: {},
      errors: {},
      dirty: {}
    }
  }
  handleComment (value, shouldValidate, t) {
    this.setState(mergeField({
      field: 'comment',
      value,
      error: (
        value.trim().length <= 5 && t('faq/form/question/error')
      ),
      dirty: shouldValidate
    }))
  }
  send () {
    const {values} = this.state

    this.setState(() => ({
      loading: true,
      serverError: undefined
    }))

    this.props
      .mutate({ variables: { feedName: 'chat', content: values.comment } })
      .then(() => {
        this.setState((state) => ({
          loading: false,
          values: {
            ...state.values,
            comment: ''
          }
        }))
      })
      .catch(error => {
        this.setState(() => ({
          loading: false,
          serverError: error
        }))
      })
  }
  render () {
    const {t} = this.props

    const {
      dirty, values, errors,
      loading, serverError
    } = this.state

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .filter(Boolean)

    return (
      <div>
        <H2>Welcome to the Republik chat</H2>
        <form onSubmit={event => {
          event.preventDefault()
          if (errorMessages.length) {
            this.setState((state) => ({
              dirty: {
                question: true
              }
            }))
            return
          }
          this.send()
        }}>
          <Field label='comment'
            name='comment'
            renderInput={(props) => (
              <AutosizeInput {...fieldSetStyles.autoSize}
                {...props} />
            )}
            error={dirty.comment && errors.comment}
            value={values.comment}
            onChange={(_, value, shouldValidate) => {
              this.handleComment(value, shouldValidate, t)
            }} />
          <br /><br />
          {loading
            ? <InlineSpinner />
            : (
              <div style={{opacity: errorMessages.length ? 0.5 : 1}}>
                <Button type='submit'>
                  Submit
                </Button>
              </div>
            )
          }

          {!!serverError && <ErrorMessage error={serverError} />}
        </form>
      </div>
    )
  }
}

export default compose(
  graphql(submitComment),
  withMe,
  withT
)(CommentForm)
