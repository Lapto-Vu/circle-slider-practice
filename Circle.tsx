import React, { FC, useState, useRef, useCallback } from "react";
import { PanResponder, Dimensions } from "react-native";
import Svg, { Path, Circle, G, Text } from "react-native-svg";

interface Props {
  btnRadius?: number;
  dialRadius?: number;
  dialWidth?: number;
  meterColor?: string;
  circleColor?: string;
  textColor?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  textSize?: number;
  x?: number;
  y?: number;
  min?: number;
  max?: number;
  xCenter?: number;
  yCenter?: number;
  onChangeXValue?: (x: number) => number;
  onChangeYValue?: (y: number) => number;
}

const CircleSlider: FC<Props> = ({
  btnRadius = 20,
  dialRadius = 120,
  dialWidth = 40,
  meterColor = "#00ccde",
  circleColor = "#0088dc",
  textColor = "#fff",
  fillColor = "none",
  strokeColor = "#fff",
  strokeWidth = 0.5,
  textSize = 10,
  min = 0,
  x = 0,
  y = 0,
  max = 359,
  xCenter = Dimensions.get("window").width / 2,
  yCenter = Dimensions.get("window").height / 2,
  onChangeXValue = (x) => x,
  onChangeYValue = (y) => y,
}) => {
  const [xAngle, setXAngle] = useState(x);
  const [yAngle, setYAngle] = useState(y);

  const xPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onStartShouldSetPanResponderCapture: (e, gs) => true,
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        let xOrigin = xCenter - (dialRadius + btnRadius);
        let yOrigin = yCenter - (dialRadius + btnRadius);
        let a = cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);

        if (a <= min) {
          setXAngle(min);
        } else if (a >= max) {
          setXAngle(max);
        } else {
          setXAngle(a);
        }
      },
    })
  ).current;

  const yPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onStartShouldSetPanResponderCapture: (e, gs) => true,
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        let xOrigin = xCenter - (dialRadius + btnRadius);
        let yOrigin = yCenter - (dialRadius + btnRadius);
        let a = cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);

        if (a <= min) {
          setYAngle(min);
        } else if (a >= max) {
          setYAngle(max);
        } else {
          setYAngle(a);
        }
      },
    })
  ).current;

  const polarToCartesian = useCallback(
    (xAngle) => {
      let r = dialRadius;
      let hC = dialRadius + btnRadius;
      let a = ((xAngle - 90) * Math.PI) / 180.0;

      let x = hC + r * Math.cos(a);
      let y = hC + r * Math.sin(a);
      return { x, y };
    },
    [dialRadius, btnRadius]
  );

  const cartesianToPolar = useCallback(
    (x, y) => {
      let hC = dialRadius + btnRadius;

      if (x === 0) {
        return y > hC ? 0 : 180;
      } else if (y === 0) {
        return x > hC ? 90 : 270;
      } else {
        return (
          Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) +
          (x > hC ? 90 : 270)
        );
      }
    },
    [dialRadius, btnRadius]
  );

  const width = (dialRadius + btnRadius) * 2;
  const bR = btnRadius;
  const dR = dialRadius;
  const startCoord = polarToCartesian(yAngle);
  var endCoord = polarToCartesian(xAngle);

  return (
    <Svg width={width} height={width}>
      <Circle
        r={dR}
        cx={width / 2}
        cy={width / 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillColor}
      />

      <Path
        stroke={meterColor}
        strokeWidth={dialWidth}
        fill="none"
        d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 ${
          xAngle - yAngle > 180
            ? 1
            : xAngle > yAngle
            ? 0
            : yAngle - xAngle > 180
            ? 0
            : 1
        } 1 ${endCoord.x} ${endCoord.y}`}
      />

      <G x={startCoord.x - bR} y={startCoord.y - bR}>
        <Circle r={bR} cx={bR} cy={bR} fill={meterColor} />
        <Circle
          r={bR - 3}
          cx={bR}
          cy={bR}
          fill={circleColor}
          {...yPanResponder.panHandlers}
        />
        <Text
          x={bR}
          y={bR + textSize / 2}
          fontSize={textSize}
          fill={textColor}
          textAnchor="middle"
        >
          {onChangeYValue(yAngle) + ""}
        </Text>
      </G>

      <G x={endCoord.x - bR} y={endCoord.y - bR}>
        <Circle r={bR} cx={bR} cy={bR} fill={meterColor} />
        <Circle
          r={bR - 3}
          cx={bR}
          cy={bR}
          fill={circleColor}
          {...xPanResponder.panHandlers}
        />
        <Text
          x={bR}
          y={bR + textSize / 2}
          fontSize={textSize}
          fill={textColor}
          textAnchor="middle"
        >
          {onChangeXValue(xAngle) + ""}
        </Text>
      </G>
    </Svg>
  );
};

export default React.memo(CircleSlider);
