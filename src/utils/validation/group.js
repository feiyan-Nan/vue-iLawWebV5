import i18n from '@/utils/i18n'
import rules from './rules'

const TEXT = i18n.getText()
const group = {
  projName: {
    validators: [rules(TEXT.PROJECT_NAME).notEmpty, rules(TEXT.PROJECT_NAME).noEmoji, rules(TEXT.PROJECT_NAME).noSpecial]
  }
}

export default group