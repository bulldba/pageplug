import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import moment from "moment";
import { DynamicHeight } from "utils/WidgetFeatures";
import { TimePrecision } from "./constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 3,
      defaultValue: DynamicHeight.FIXED,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "日期选择器",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["calendar", "date picker"],
  defaults: {
    isDisabled: false,
    datePickerType: "DATE_PICKER",
    rows: 7,
    label: "标签",
    labelPosition: LabelPosition.Top,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    labelTextSize: "0.875rem",
    dateFormat: "YYYY-MM-DD HH:mm",
    columns: 20,
    widgetName: "DatePicker",
    defaultDate: moment().toISOString(),
    minDate: "1920-12-31T18:30:00.000Z",
    maxDate: "2121-12-31T18:29:00.000Z",
    version: 2,
    isRequired: false,
    closeOnSelection: true,
    shortcuts: false,
    firstDayOfWeek: 1,
    timePrecision: TimePrecision.MINUTE,
    animateLoading: true,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
  },
};

export default Widget;
