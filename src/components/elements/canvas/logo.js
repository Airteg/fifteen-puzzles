import {
  BlurMask,
  Group,
  LinearGradient,
  Path,
  Shadow,
  vec,
} from "@shopify/react-native-skia";

export default function Logo({ cx = 0, cy = 0, scale = 1.5 }) {
  return (
    <Group transform={[{ scale }, { translateX: cx }, { translateY: cy }]}>
      {/* ------ Овал обличчя ------ */}
      <Path color="#000" style="stroke" path=""></Path>

      {/* Зовнішній квадрат */}
      <Group>
        <Path
          color="#FAFF3F"
          stroke="#02545E"
          path="M 177.9 179.5 H 20.1 C 14.2 179.5 9.5 175.1 9.5 169.9 V 10.1 C 9.5 4.8 14.2 0.5 20.1 0.5 H 177.9 C 183.8 0.5 188.5 4.8 188.5 10.1 V 169.9 C 188.5 175.2 183.8 179.5 177.9 179.5 Z"
        >
          <Shadow dx={-5} dy={4} blur={4} color="#0000003f" inner />
          <Shadow dx={0} dy={4} blur={4} color="#0000003f" />
        </Path>
      </Group>
      {/* Плитка Одиниця */}
      <Group>
        <Path
          color="#fff"
          style="fill"
          strokeWidth={1}
          path="M105.939 30.763H28.061A6.06 6.06 0 0 0 22 36.823v77.88a6.06 6.06 0 0 0 6.06 6.06h77.879a6.06 6.06 0 0 0 6.061-6.06v-77.88a6.06 6.06 0 0 0-6.061-6.06Z"
        >
          <Shadow dx={-10} dy={10} blur={12} color="#00000099" />
        </Path>
        <Path
          color="white"
          style="fill"
          path="M105.788 30.915H28.212a6.06 6.06 0 0 0-6.06 6.06v77.576a6.061 6.061 0 0 0 6.06 6.061h77.576a6.06 6.06 0 0 0 6.06-6.061V36.975a6.06 6.06 0 0 0-6.06-6.06Z"
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(31, 14.46)}
            colors={["white", "#F4F4F4"]}
          />
          <LinearGradient
            start={vec(31, 14.46)}
            end={vec(78, 36.37)}
            colors={["#F4F4F4", "#DCDCDC"]}
          />
          <LinearGradient
            start={vec(78, 36.37)}
            end={vec(100, 50)}
            colors={["#DCDCDC", "#D0D0D0"]}
          />
        </Path>
        {/* Цифра */}
        <Path
          color="#216169"
          path="M57.552 87.116h8.32V64.31c-1.094.25-2.148.578-3.164.984-1 .407-1.914.899-2.742 1.477l-3.656-5.227a27.732 27.732 0 0 1 4.101-2.132 27.53 27.53 0 0 1 4.242-1.407 32.06 32.06 0 0 1 4.313-.773 40.545 40.545 0 0 1 4.336-.234l-.024.046h.024v30.07h7.945v6.516H57.552v-6.515Z"
        >
          <Shadow dx={0} dy={4} blur={4} color="#0000003f" inner />
        </Path>
      </Group>

      {/* Плитка П'ять */}

      <Group>
        <Path
          path="M 154.7 20.2 C 155.7 20 156.7 20.1 157.4 20.7 C 158.1 21.2 158.7 22.1 158.8 23.1 L 166.5 84.9 C 166.6 86 166.4 87.1 165.8 88 C 165.3 88.9 164.4 89.5 163.4 89.8 L 101.9 106.5 C 100.9 106.8 100 106.6 99.2 106 C 98.5 105.5 98 104.6 97.9 103.6 L 90.1 41.8 C 90 40.7 90.3 39.6 90.8 38.7 C 91.4 37.9 92.2 37.2 93.2 36.9 L 154.7 20.2 Z "
          color="#71D4EB"
        >
          <Shadow dx={-12} dy={10} blur={10} color="#0000006f" />
        </Path>
        <Path
          path="M 164.7 25.2 C 165.7 25 166.7 25.1 167.4 25.7 C 168.1 26.2 168.7 27.1 168.8 28.1 L 176.5 89.9 C 176.6 91 176.4 92.1 175.8 93 C 175.3 93.9 174.4 94.5 173.4 94.8 L 111.9 111.5 C 110.9 111.8 110 111.6 109.2 111 C 108.5 110.5 108 109.6 107.9 108.6 L 100.1 46.8 C 100 45.7 100.3 44.6 100.8 43.7 C 101.4 42.9 102.2 42.2 103.2 41.9 L 164.7 25.2 Z "
          color="#71D4EB"
        />
        <Path
          color="#025863"
          path="M 108.5 110.5 C 108.5 110.5 108 109.6 107.9 108.6 L 100.1 46.8 C 100 45.7 100.3 44.6 100.8 43.7 C 101.4 42.9 102.2 42.2 103.2 41.9 L 164.7 25.2 C 165.7 25 166.7 25.1 167.4 25.7 L 157.7 20.7 C 157.4 20.7 156.7 20.1 155.7 20 L 93.2 36.9 C 93.2 36.9 92.2 37.2 91.4 37.9 C 90.8 38.7 90.3 39.6 90 40.7 L 97.9 103.6 C 97.9 103.6 98 104.6 98.5 105.5 Z"
        />
      </Group>

      {/* Цифра 5 */}
      <Group>
        <Path
          color="#216169"
          path="M 116.9 49.6 L 150.4 40.1 L 151.9 48.4 L 126.6 55.6 L 128.2 64.7 A 56.2 56.2 0 0 1 132.5 62.6 L 132.7 62.4 A 38.3 38.3 0 0 1 137.5 60.8 C 140.6 59.9 143.4 59.4 146 59.5 C 148.5 59.5 150.7 59.9 152.6 60.8 C 154.6 61.6 156.1 62.9 157.3 64.5 C 158.6 66.1 159.4 68.1 159.8 70.4 C 160.2 72.8 160.2 75.1 159.6 77.3 C 159 79.5 157.9 81.6 156.3 83.5 C 154.8 85.3 152.7 87 150.2 88.5 A 32.5 32.5 0 0 1 146.6 90.3 A 43.9 43.9 0 0 1 141.1 92.3 A 47.6 47.6 0 0 1 135.8 93.5 A 46.3 46.3 0 0 1 130.5 94 A 37.7 37.7 0 0 1 125.5 94 A 32.2 32.2 0 0 1 120.8 93.3 L 123.6 85 C 124.8 85.2 126 85.4 127.3 85.5 A 35.7 35.7 0 0 0 135.4 84.9 A 41.8 41.8 0 0 0 139.4 84 C 141 83.5 142.4 83 143.7 82.4 C 144.2 82.2 144.6 82 145.1 81.8 C 146.6 81 147.9 80.1 148.8 79.2 C 149.7 78.2 150.4 77.2 150.7 76.2 A 6.2 6.2 0 0 0 151 73.1 C 150.8 72 150.3 71.1 149.6 70.3 C 148.9 69.5 148 69 146.8 68.6 C 145.7 68.3 144.2 68.1 142.6 68.2 C 140.9 68.3 139 68.7 136.9 69.3 C 135.9 69.5 134.9 69.9 133.7 70.3 C 132.7 70.7 131.6 71.1 130.5 71.6 C 130.3 71.7 130.2 71.8 130 71.8 A 55.6 55.6 0 0 0 125.9 73.8 A 61 61 0 0 0 121.8 76.4 L 116.9 49.6 Z"
        />
      </Group>

      {/* Надпис Fifteen */}
      <Group>
        <Path
          color="#216169"
          path="M29.436 140.77h18.106v3.589H33.538v5.283H45.43v3.373H33.54v7.947H29.43V140.77h.005ZM50.982 140.77h4.133v20.192h-4.133V140.77ZM60.348 140.769h18.106v3.589h-14v5.283h11.892v3.373H64.454v7.947h-4.106v-20.192ZM88.52 144.352h-7.476v-3.589h19.053v3.589h-7.476v16.603h-4.106v-16.603h.004ZM104.492 140.777h17.24v3.589h-13.134v4.031h11.631v3.373h-11.631v5.618h13.408v3.581h-17.514v-20.192ZM126.555 140.764h17.24v3.589h-13.133v4.031h11.63v3.373h-11.63v5.618h13.408v3.581h-17.515v-20.192ZM148.602 140.768h4.106l12.617 6.588v-6.588h4.106v20.192h-4.106v-9.265l-12.617-6.548v15.813h-4.106v-20.192Z"
        />
      </Group>
    </Group>
  );
}
