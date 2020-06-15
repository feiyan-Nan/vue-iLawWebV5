import Vue from 'vue'
import IcTabPane from './components/tabs/TabPane'
import IcTabs from './components/tabs/Tabs'
import IcDropdown from './components/Dropdown'
import IcDropdownItem from './components/DropdownItem'
import IcDropdownMenu from './components/DropdownMenu'
import IcInput from './components/Input'
import IcTree from './components/Tree'
import IcForm from './components/form/Form'
import IcDialog from './components/Dialog'
import IcButton from './components/button/Button'
import IcDraggable from './components/drag/Draggable'
import IcDroppable from './components/drag/Droppable'
import DatePicker from './components/datePicker/DatePicker'
import MonthPicker from './components/datePicker/MonthPicker'
import YearPicker from './components/datePicker/YearPicker'
import IcPopover from './components/popover/Popover'
import IcTooltip from './components/Tooltip'
import IcModal from './components/modal/Modal'
import IPagination from './components/pagination/Pagination'
import IcSearch from './components/Search'
import Sort from './components/Sort'

import './directives'
import './components/toast'

const plugin = {}

plugin.install = () => {
  const components = [IcTabPane, IcTabs, IcDropdown, IcDropdownItem, IcDropdownMenu, IcInput, IcTree, IcForm, IcDialog, IcButton, IcDraggable, IcDroppable, DatePicker, MonthPicker, YearPicker, IcPopover, IcTooltip, IcModal, IPagination, IcSearch, Sort]
  components.forEach(item => {
    Vue.component(item.name, item)
  })
}

export default plugin
