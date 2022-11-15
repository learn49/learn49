import React from 'react'
import decorateComponentWithProps from 'decorate-component-with-props'
import { EditorState, AtomicBlockUtils } from 'draft-js'
import embedStyles from './index.module.css'

const addEmbed = (editorState, data) => {
  const urlType = 'embed'
  const contentState = editorState.getCurrentContent()
  const contentStateWithEntity = contentState.createEntity(
    urlType,
    'IMMUTABLE',
    data
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity
  })
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
}

const EmbedComponent = ({ block, theme = {}, ...otherProps }) => {
  const { contentState, ...elementProps } = otherProps

  const entity = block.getEntityAt(0)
  const embedProps = contentState.getEntity(entity).getData()

  return (
    <div className={theme.embedStyles.embedWrapper}>
      <iframe
        {...elementProps}
        {...embedProps}
        className={theme.embedStyles.embed}
      />
    </div>
  )
}

const defaultTheme = { embedStyles }

const createEmbedPlugin = (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme
  let Embed = config.EmbedComponent || EmbedComponent
  if (config.decorator) {
    Embed = config.decorator(Embed)
  }
  const ThemedEmbed = decorateComponentWithProps(Embed, { theme })
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent()
        const entity = block.getEntityAt(0)

        const type = contentState.getEntity(entity).getType()

        if (type === 'embed') {
          return {
            component: ThemedEmbed,
            editable: false
          }
        }
      }

      return null
    },
    addEmbed
  }
}

export default createEmbedPlugin

export const Embed = EmbedComponent
