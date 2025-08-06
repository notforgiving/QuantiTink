import { ReactComponent as Icon1Svg } from "assets/ionicons/icon1.svg";
import { ReactComponent as Icon2Svg } from "assets/ionicons/icon2.svg";
import { ReactComponent as Icon3Svg } from "assets/ionicons/icon3.svg";
import { ReactComponent as Icon4Svg } from "assets/ionicons/icon4.svg";
import { ReactComponent as Icon5Svg } from "assets/ionicons/icon5.svg";
import { ReactComponent as Icon6Svg } from "assets/ionicons/icon6.svg";
import { ReactComponent as Icon7Svg } from "assets/ionicons/icon7.svg";
import { ReactComponent as Icon8Svg } from "assets/ionicons/icon8.svg";
import { ReactComponent as Icon9Svg } from "assets/ionicons/icon9.svg";
import { ReactComponent as Icon10Svg } from "assets/ionicons/icon10.svg";
import { ReactComponent as Icon11Svg } from "assets/ionicons/icon11.svg";
import { ReactComponent as Icon12Svg } from "assets/ionicons/icon12.svg";
import { ReactComponent as Icon13Svg } from "assets/ionicons/icon13.svg";
import { ReactComponent as Icon14Svg } from "assets/ionicons/icon14.svg";
import { ReactComponent as Icon15Svg } from "assets/ionicons/icon15.svg";
import { ReactComponent as Icon16Svg } from "assets/ionicons/icon16.svg";
import { ReactComponent as Icon17Svg } from "assets/ionicons/icon17.svg";
import { ReactComponent as Icon18Svg } from "assets/ionicons/icon18.svg";
import { ReactComponent as Icon19Svg } from "assets/ionicons/icon19.svg";
import { ReactComponent as Icon20Svg } from "assets/ionicons/icon20.svg";
import { ReactComponent as Icon21Svg } from "assets/ionicons/icon21.svg";
import { ReactComponent as Icon22Svg } from "assets/ionicons/icon22.svg";
import { ReactComponent as Icon23Svg } from "assets/ionicons/icon23.svg";
import { ReactComponent as Icon24Svg } from "assets/ionicons/icon24.svg";
import { ReactComponent as Icon25Svg } from "assets/ionicons/icon25.svg";
import { ReactComponent as Icon26Svg } from "assets/ionicons/icon26.svg";
import { ReactComponent as Icon27Svg } from "assets/ionicons/icon27.svg";
import { ReactComponent as Icon28Svg } from "assets/ionicons/icon28.svg";
import { ReactComponent as Icon29Svg } from "assets/ionicons/icon29.svg";
import { ReactComponent as Icon30Svg } from "assets/ionicons/icon30.svg";
import { ReactComponent as Icon31Svg } from "assets/ionicons/icon31.svg";
import { ReactComponent as Icon32Svg } from "assets/ionicons/icon32.svg";
import { ReactComponent as Icon33Svg } from "assets/ionicons/icon33.svg";

export const rusAlfabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

export const ionIcons = [
  Icon1Svg,
  Icon2Svg,
  Icon3Svg,
  Icon4Svg,
  Icon5Svg,
  Icon6Svg,
  Icon7Svg,
  Icon8Svg,
  Icon9Svg,
  Icon10Svg,
  Icon11Svg,
  Icon12Svg,
  Icon13Svg,
  Icon14Svg,
  Icon15Svg,
  Icon16Svg,
  Icon17Svg,
  Icon18Svg,
  Icon19Svg,
  Icon20Svg,
  Icon21Svg,
  Icon22Svg,
  Icon23Svg,
  Icon24Svg,
  Icon25Svg,
  Icon26Svg,
  Icon27Svg,
  Icon28Svg,
  Icon29Svg,
  Icon30Svg,
  Icon31Svg,
  Icon32Svg,
  Icon33Svg,
];

export const getIconByRubAlfabet = (value: string) => {
  return ionIcons[rusAlfabet.indexOf(value) || 0];
};
