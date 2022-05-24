import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Circle from "./Circle";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const Loader = () => (
  <View>
    <Text>Loading...</Text>
  </View>
);

export default function App() {
  const [array, setArray] = useState([
    { x: 40, y: 0 },
    { x: 90, y: 50 },
  ]);
  const [yValue, setYValue] = useState(0);
  const [xValue, setXValue] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <AnimatedCircularProgress
          size={200}
          width={100}
          fill={
            yValue > xValue
              ? Math.round((2777 * (xValue - yValue + 360)) / 10000)
              : Math.round((2777 * (xValue - yValue)) / 10000)
          }
          rotation={yValue}
          tintColor="#00e0ff"
          arcSweepAngle={
            yValue > xValue ? xValue - yValue + 360 : xValue - yValue
          }
          duration={150}
          backgroundColor="#3d5875"
        />
      </View>
      <View style={styles.section}>
        <Circle y={0} x={30} />
      </View>
      <View style={styles.section}>
        <Circle
          y={40}
          x={90}
          onChangeYValue={(y) => {
            setYValue(y);
            return y;
          }}
          onChangeXValue={(x) => {
            setXValue(x);
            return x;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    position: "absolute",
  },
});
