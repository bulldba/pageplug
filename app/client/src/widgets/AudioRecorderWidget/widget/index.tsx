import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import AudioRecorderComponent from "../component";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import { createBlobUrl } from "utils/AppsmithUtils";
import { FileDataTypes } from "widgets/constants";
import { Stylesheet } from "entities/AppTheming";

export interface AudioRecorderWidgetProps extends WidgetProps {
  accentColor: string;
  borderRadius: string;
  boxShadow?: string;
  iconColor: string;
  isDisabled: boolean;
  isValid: boolean;
  onRecordingStart?: string;
  onRecordingComplete?: string;
  blobURL?: string;
  isDirty: boolean;
}

class AudioRecorderWidget extends BaseWidget<
  AudioRecorderWidgetProps,
  WidgetState
> {
  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制组件的显示/隐藏",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.BOOLEAN,
            },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            controlType: "SWITCH",
            helpText: "让组件不可交互",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.BOOLEAN,
            },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "录音开始时触发",
            propertyName: "onRecordingStart",
            label: "onRecordingStart",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录音结束后触发",
            propertyName: "onRecordingComplete",
            label: "onRecordingComplete",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }
  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "iconColor",
            helpText: "设置组件的图标颜色",
            label: "图标颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "accentColor",
            helpText: "录音按钮的颜色",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓",
        children: [
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      accentColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      blobURL: undefined,
      dataURL: undefined,
      rawBinary: undefined,
      isDirty: false,
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  handleRecordingStart = () => {
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    if (this.props.blobURL) {
      URL.revokeObjectURL(this.props.blobURL);
    }

    this.props.updateWidgetMetaProperty("dataURL", undefined);
    this.props.updateWidgetMetaProperty("rawBinary", undefined);

    if (this.props.onRecordingStart) {
      super.executeAction({
        triggerPropertyName: "onRecordingStart",
        dynamicString: this.props.onRecordingStart,
        event: {
          type: EventType.ON_RECORDING_START,
        },
      });
    }
  };

  handleRecordingComplete = (blobUrl?: string, blob?: Blob) => {
    if (!blobUrl) {
      this.props.updateWidgetMetaProperty("blobURL", undefined);
      this.props.updateWidgetMetaProperty("dataURL", undefined);
      this.props.updateWidgetMetaProperty("rawBinary", undefined);
      return;
    }
    this.props.updateWidgetMetaProperty("blobURL", blobUrl);
    if (blob) {
      const blobIdForBase64 = createBlobUrl(blob, FileDataTypes.Base64);
      const blobIdForRaw = createBlobUrl(blob, FileDataTypes.Binary);

      this.props.updateWidgetMetaProperty("dataURL", blobIdForBase64, {
        triggerPropertyName: "onRecordingComplete",
        dynamicString: this.props.onRecordingComplete,
        event: {
          type: EventType.ON_RECORDING_COMPLETE,
        },
      });
      this.props.updateWidgetMetaProperty("rawBinary", blobIdForRaw, {
        triggerPropertyName: "onRecordingComplete",
        dynamicString: this.props.onRecordingComplete,
        event: {
          type: EventType.ON_RECORDING_COMPLETE,
        },
      });
    }
  };

  getPageView() {
    const {
      blobURL,
      bottomRow,
      iconColor,
      isDisabled,
      leftColumn,
      parentColumnSpace,
      parentRowSpace,
      rightColumn,
      topRow,
    } = this.props;

    return (
      <AudioRecorderComponent
        accentColor={this.props.accentColor}
        blobUrl={blobURL}
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        height={(bottomRow - topRow) * parentRowSpace}
        iconColor={iconColor}
        isDisabled={isDisabled}
        onRecordingComplete={this.handleRecordingComplete}
        onRecordingStart={this.handleRecordingStart}
        width={(rightColumn - leftColumn) * parentColumnSpace}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "AUDIO_RECORDER_WIDGET";
  }
}

export default AudioRecorderWidget;
