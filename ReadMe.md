### Description of the 15 Tiles Application

#### Description:
This is a "15 Tiles" application – a classic game for Android and iOS platforms, designed to support even the weakest devices. The application was developed using modern libraries and frameworks to achieve high performance and accurate design reproduction.

#### Technologies and Libraries:
1. **Expo**:
   - Used for quick start and development of the application with support for Android, iOS, and the web.
   - Commands: `expo start`, `expo start --android`, `expo start --ios`, `expo start --web`.

2. **React Native**:
   - The main framework for creating cross-platform mobile applications.

3. **Emotion**:
   - `@emotion/native`, `@emotion/react`, `@emotion/styled`: Provide a CSS-in-JS approach for styling components, significantly simplifying the process of writing and maintaining styles.

4. **Graphics Libraries**:
   - **React Native SVG**: For working with SVG graphics.
   - **Shopify React Native Skia**: For highly efficient rendering of graphics.
   - **React Native Skia Shadow**: For accurate reproduction of designs with shadows.
   - **Expo Linear Gradient**: For creating gradients.

5. **Font Management**:
   - **Expo Fonts**: For loading and using custom fonts (Inter, Krona One).

6. **Data Storage**:
   - **React Native Async Storage**: For storing local data, such as the best game results.
   - An attempt was made to implement data storage using `react-native-mmkv`, but there were difficulties with iOS support, as the author did not have access to an iOS emulator on Windows.

7. **Additional Libraries**:
   - **Axios**: For working with HTTP requests.
   - **Expo AV**: For working with media (audio/video).
   - **Expo Constants**: Provides access to various constants, such as application information.
   - **Expo Image**: For working with images.
   - **Expo Linking**: For working with links in the application.
   - **Expo Status Bar**: For controlling the device's status bar.

#### Implemented Features:
1. **Graphics and Design**:
   - The use of `react-native-svg`, `shopify/react-native-skia`, and `react-native-skia-shadow` libraries allowed for the creation of an efficient and precise graphical interface, especially with the use of shadows, achieving high visual quality.
   - The use of so many graphics libraries was not a necessity. Using both Canvas and SVG in one project is somewhat incorrect. However, in this application, it was explored when to use Canvas and when to use SVG.

2. **Saving Results**:
   - Implemented saving of best results using `@react-native-async-storage`, ensuring reliable data storage locally on the user's device.

3. **Styling**:
   - Using `@emotion/native` greatly simplified the process of writing styles. The CSS-in-JS approach provided flexibility and convenience in styling components.
