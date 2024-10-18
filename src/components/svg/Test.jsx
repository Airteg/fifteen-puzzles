import React from "react";
import Svg, {
  G,
  Rect,
  Path,
  Mask,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

const Test = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none">
      <G filter="url(#a)">
        <Rect width={220} height={220} x={10} y={10} fill="#D5F7FF" rx={8} />
        <Rect
          width={217}
          height={217}
          x={11.5}
          y={11.5}
          stroke="#D5F7FF"
          strokeWidth={3}
          rx={6.5}
        />
        <G filter="url(#b)">
          <Path
            fill="#FAFF3F"
            stroke="#216169"
            d="M198.935 209.5H41.065c-5.879 0-10.565-4.351-10.565-9.631V40.131c0-5.28 4.686-9.631 10.565-9.631h157.87c5.879 0 10.565 4.35 10.565 9.63V199.87c0 5.28-4.686 9.631-10.565 9.631Z"
          />
        </G>
        <G filter="url(#c)">
          <Path
            fill="#595959"
            d="M126.939 60.763H49.061A6.06 6.06 0 0 0 43 66.823v77.88a6.06 6.06 0 0 0 6.06 6.06h77.879a6.06 6.06 0 0 0 6.061-6.06v-77.88a6.06 6.06 0 0 0-6.061-6.06Z"
          />
        </G>
        <Path
          fill="url(#d)"
          d="M126.788 60.915H49.212a6.06 6.06 0 0 0-6.06 6.06v77.576a6.061 6.061 0 0 0 6.06 6.061h77.576a6.06 6.06 0 0 0 6.06-6.061V66.975a6.06 6.06 0 0 0-6.06-6.06Z"
        />
        <Path
          fill="url(#e)"
          d="M125.879 61.824H50.121a6.06 6.06 0 0 0-6.06 6.06v75.758a6.061 6.061 0 0 0 6.06 6.061h75.758a6.06 6.06 0 0 0 6.06-6.061V67.884a6.06 6.06 0 0 0-6.06-6.06Z"
        />
        <G filter="url(#f)">
          <Path
            fill="#216169"
            d="M78.552 117.116h8.32V94.311c-1.094.25-2.148.578-3.164.984-1 .407-1.914.899-2.742 1.477l-3.656-5.227a27.732 27.732 0 0 1 4.101-2.132 27.53 27.53 0 0 1 4.242-1.407 32.06 32.06 0 0 1 4.313-.773 40.545 40.545 0 0 1 4.336-.234l-.024.046h.024v30.071h7.945v6.515H78.552v-6.515Z"
          />
        </G>
        <G filter="url(#g)">
          <Mask
            id="h"
            width={15}
            height={10}
            x={181}
            y={115}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m192.135 124.897-10.679-4.14c.982-.266 1.815-.939 2.371-1.82.557-.882.835-1.958.699-3.031l10.679 4.14a4.618 4.618 0 0 1-.698 3.031c-.557.881-1.389 1.554-2.372 1.82Z"
            />
          </Mask>
          <G mask="url(#h)">
            <Path
              fill="#02555F"
              d="m192.135 124.897-10.679-4.14c.366-.1.707-.254 1.025-.453l10.68 4.14c-.318.2-.664.354-1.026.453Z"
            />
            <Path
              fill="#02545E"
              d="m193.161 124.444-10.68-4.14c.19-.122.373-.256.541-.41l10.679 4.14a4.198 4.198 0 0 1-.54.41Z"
            />
            <Path
              fill="#02535C"
              d="m193.697 124.035-10.68-4.141c.141-.124.271-.256.395-.4l10.68 4.14a4.157 4.157 0 0 1-.395.401Z"
            />
            <Path
              fill="#02515B"
              d="m194.092 123.634-10.68-4.14c.117-.134.224-.272.322-.417l10.679 4.14a3.697 3.697 0 0 1-.321.417Z"
            />
            <Path
              fill="#015059"
              d="m194.413 123.217-10.679-4.14c.029-.048.064-.092.093-.14a6.9 6.9 0 0 0 .184-.312l10.679 4.141c-.058.104-.116.209-.183.311-.03.048-.059.096-.094.14Z"
            />
            <Path
              fill="#014F58"
              d="m194.69 122.765-10.679-4.14c.09-.166.166-.336.233-.512l10.68 4.14a4.698 4.698 0 0 1-.234.512Z"
            />
            <Path
              fill="#014D56"
              d="m194.923 122.249-10.679-4.141c.08-.205.147-.421.195-.636l10.68 4.14a4.193 4.193 0 0 1-.196.637Z"
            />
            <Path
              fill="#014C55"
              d="m195.123 121.612-10.68-4.14c.119-.507.15-1.038.087-1.567l10.68 4.141a4.542 4.542 0 0 1-.087 1.566Z"
            />
          </G>
          <Path
            fill="#014B54"
            d="m195.205 120.046-10.679-4.14-7.719-61.797 10.684 4.14 7.714 61.797Z"
          />
          <Mask
            id="i"
            width={14}
            height={8}
            x={174}
            y={51}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m174.741 51.27 10.679 4.14c.244.093.474.219.684.37.732.531 1.251 1.392 1.387 2.464l-10.68-4.14c-.136-1.073-.651-1.938-1.386-2.465a3.083 3.083 0 0 0-.684-.37Z"
            />
          </Mask>
          <G mask="url(#i)">
            <Path
              fill="#014C55"
              d="m187.491 58.249-10.68-4.14c-.136-1.073-.651-1.938-1.386-2.465a2.893 2.893 0 0 0-.684-.37l10.68 4.14c.243.093.473.22.684.37.731.528 1.25 1.388 1.386 2.465Z"
            />
          </G>
          <Mask
            id="j"
            width={14}
            height={5}
            x={172}
            y={51}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m174.741 51.27 10.679 4.14a3.171 3.171 0 0 0-1.976-.087l-10.679-4.14a3.173 3.173 0 0 1 1.976.086Z"
            />
          </Mask>
          <G mask="url(#j)">
            <Path
              fill="#61B6C9"
              d="m183.449 55.323-10.68-4.14a3.286 3.286 0 0 1 1.267-.095l10.679 4.14a3.29 3.29 0 0 0-1.266.095Z"
            />
            <Path
              fill="#60B3C6"
              d="m184.711 55.23-10.68-4.14c.204.026.402.072.593.137l10.679 4.14a3.033 3.033 0 0 0-.592-.138Z"
            />
            <Path
              fill="#5EB0C3"
              d="m185.308 55.366-10.68-4.14c.037.013.079.026.117.043l10.68 4.14c-.042-.012-.08-.03-.117-.043Z"
            />
          </G>
          <Mask
            id="k"
            width={14}
            height={5}
            x={172}
            y={50}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m175.058 50.467 10.679 4.14c-.721-.28-1.548-.33-2.397-.103l-10.679-4.14a3.803 3.803 0 0 1 2.397.103Z"
            />
          </Mask>
          <G mask="url(#k)">
            <Path
              fill="#02555F"
              d="m183.345 54.503-10.68-4.14a3.93 3.93 0 0 1 1.527-.114l10.68 4.14a3.926 3.926 0 0 0-1.527.114Z"
            />
            <Path
              fill="#02545E"
              d="m184.872 54.39-10.68-4.141c.249.03.493.088.725.165l10.68 4.14a3.488 3.488 0 0 0-.725-.165Z"
            />
            <Path
              fill="#02535C"
              d="m185.597 54.554-10.68-4.14c.047.016.093.032.141.053l10.679 4.14a1.86 1.86 0 0 0-.14-.053Z"
            />
          </G>
          <Path
            fill="#025863"
            d="m130.592 141.596-10.679-4.14 61.543-16.699 10.679 4.14-61.543 16.699Z"
          />
          <Mask
            id="l"
            width={14}
            height={5}
            x={117}
            y={137}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m128.617 141.514-10.68-4.14c.595.231 1.274.273 1.976.087l10.68 4.14a3.181 3.181 0 0 1-1.976-.087Z"
            />
          </Mask>
          <G mask="url(#l)">
            <Path
              fill="#02535C"
              d="m128.617 141.514-10.68-4.14c.038.013.075.031.117.043l10.68 4.14a1.01 1.01 0 0 0-.117-.043Z"
            />
            <Path
              fill="#02545E"
              d="m128.733 141.553-10.679-4.14c.19.064.388.11.592.137l10.68 4.141a2.89 2.89 0 0 1-.593-.138Z"
            />
            <Path
              fill="#02555F"
              d="m129.33 141.69-10.68-4.14c.403.051.832.023 1.267-.094l10.68 4.14c-.44.118-.864.145-1.267.094Z"
            />
          </G>
          <Mask
            id="m"
            width={14}
            height={8}
            x={115}
            y={134}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="M117.253 137c-.732-.532-1.251-1.392-1.387-2.465l10.68 4.141c.136 1.072.651 1.938 1.386 2.465L117.253 137c3.561 1.383 7.123 2.762 10.679 4.141.212.155.441.276.684.369l-10.679-4.14a2.838 2.838 0 0 1-.684-.37Z"
            />
          </Mask>
          <G mask="url(#m)">
            <Path
              fill="#56A2B3"
              d="m128.617 141.515-10.68-4.141a3.093 3.093 0 0 1-.684-.369c-.731-.532-1.25-1.392-1.386-2.465l10.68 4.14c.136 1.073.651 1.938 1.386 2.465.215.15.444.272.684.37Z"
            />
          </G>
          <Mask
            id="n"
            width={14}
            height={9}
            x={115}
            y={134}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m128.3 142.317-10.68-4.14c-1.312-.508-2.295-1.761-2.503-3.436l10.68 4.14c.212 1.675 1.195 2.928 2.503 3.436Z"
            />
          </Mask>
          <G mask="url(#n)">
            <Path
              fill="#014C55"
              d="m128.3 142.317-10.68-4.14c-1.312-.508-2.295-1.761-2.503-3.436l10.68 4.14c.212 1.675 1.195 2.928 2.503 3.436Z"
            />
          </G>
          <Path
            fill="#65BCD1"
            d="m121.906 72.022-10.68-4.14 61.539-16.694 10.684 4.135-61.543 16.7Z"
          />
          <Path
            fill="#025863"
            d="m121.802 71.202-10.68-4.14 61.543-16.7 10.68 4.14-61.543 16.7Z"
          />
          <Path
            fill="#56A0B2"
            d="m126.55 138.675-10.679-4.14-7.719-61.797 10.68 4.14 7.718 61.797Z"
          />
          <Path
            fill="#014B54"
            d="m125.796 138.877-10.679-4.14-7.719-61.797 10.684 4.14 7.714 61.797Z"
          />
          <Mask
            id="o"
            width={14}
            height={10}
            x={108}
            y={67}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m118.832 76.878-10.68-4.14a4.612 4.612 0 0 1 .699-3.03c.556-.882 1.389-1.555 2.371-1.821l10.68 4.14c-.982.266-1.815.94-2.372 1.82a4.634 4.634 0 0 0-.698 3.031Z"
            />
          </Mask>
          <G mask="url(#o)">
            <Path
              fill="#56A2B3"
              d="m118.832 76.878-10.68-4.14a4.424 4.424 0 0 1 .087-1.566l10.679 4.14a4.537 4.537 0 0 0-.086 1.566Z"
            />
            <Path
              fill="#58A4B6"
              d="m118.918 75.312-10.679-4.14c.052-.22.114-.431.195-.637l10.68 4.14a4.785 4.785 0 0 0-.196.637Z"
            />
            <Path
              fill="#59A7B9"
              d="m119.113 74.671-10.679-4.14c.066-.177.147-.347.233-.513l10.68 4.14a6.061 6.061 0 0 0-.234.513Z"
            />
            <Path
              fill="#5BAABD"
              d="m119.351 74.158-10.679-4.14a4.327 4.327 0 0 1 .276-.456l10.68 4.14c-.03.048-.064.093-.094.14a4.27 4.27 0 0 0-.183.316Z"
            />
            <Path
              fill="#5CADC0"
              d="m119.623 73.703-10.679-4.14a4.94 4.94 0 0 1 .321-.418l10.68 4.14c-.112.134-.22.272-.322.418Z"
            />
            <Path
              fill="#5EB0C3"
              d="m119.949 73.285-10.68-4.14c.125-.145.255-.276.395-.4l10.68 4.14c-.14.124-.274.26-.395.4Z"
            />
            <Path
              fill="#60B3C6"
              d="m120.34 72.885-10.68-4.14a4.29 4.29 0 0 1 .541-.41l10.679 4.14c-.189.122-.368.26-.54.41Z"
            />
            <Path
              fill="#61B6C9"
              d="m120.88 72.476-10.679-4.14c.317-.2.659-.354 1.025-.454l10.68 4.14c-.367.1-.708.254-1.026.454Z"
            />
          </G>
          <Path
            fill="#71D4EB"
            d="M183.449 55.323c.982-.266 1.924-.076 2.655.456.732.532 1.251 1.393 1.387 2.465l7.718 61.797a4.618 4.618 0 0 1-.698 3.031c-.557.881-1.39 1.554-2.372 1.82l-61.543 16.699c-.982.267-1.924.076-2.655-.456-.732-.532-1.251-1.392-1.387-2.465l-7.718-61.797c-.136-1.073.141-2.153.698-3.03.557-.882 1.389-1.555 2.372-1.82l61.543-16.7Z"
          />
          <Path
            fill="#02636F"
            d="M183.345 54.503c2.382-.648 4.575.94 4.895 3.54l7.719 61.797c.326 2.604-1.341 5.234-3.72 5.877l-61.543 16.699c-2.382.648-4.575-.94-4.895-3.54l-7.719-61.797c-.326-2.603 1.342-5.234 3.72-5.877l61.543-16.699Zm11.86 65.543-7.718-61.797c-.136-1.073-.651-1.938-1.387-2.465-.735-.531-1.673-.722-2.655-.456l-61.543 16.7c-.982.265-1.815.938-2.372 1.82-.556.88-.834 1.957-.698 3.03l7.718 61.797c.136 1.073.652 1.938 1.387 2.465.731.532 1.673.723 2.655.456l61.543-16.699c.983-.266 1.815-.939 2.372-1.82.556-.882.834-1.958.698-3.031Z"
          />
          <Mask
            id="p"
            width={15}
            height={11}
            x={107}
            y={67}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path
              fill="#fff"
              d="m118.082 77.08-10.68-4.14c-.325-2.605 1.342-5.235 3.72-5.878l10.68 4.14c-2.378.647-4.045 3.278-3.72 5.877Z"
            />
          </Mask>
          <G mask="url(#p)">
            <Path
              fill="#014C55"
              d="m118.082 77.08-10.68-4.14a5.425 5.425 0 0 1 .103-1.897l10.68 4.14a5.337 5.337 0 0 0-.103 1.896Z"
            />
            <Path
              fill="#014D56"
              d="m118.185 75.183-10.68-4.14c.06-.265.143-.523.24-.775l10.68 4.14c-.097.252-.18.51-.24.775Z"
            />
            <Path
              fill="#014F58"
              d="m118.425 74.409-10.68-4.14c.085-.215.179-.422.283-.621l10.679 4.14c-.108.2-.202.407-.282.62Z"
            />
            <Path
              fill="#015059"
              d="m118.707 73.788-10.679-4.14c.1-.19.211-.373.331-.548l10.68 4.14c-.12.175-.231.358-.332.548Z"
            />
            <Path
              fill="#02515B"
              d="m119.038 73.236-10.679-4.14c.12-.175.25-.346.39-.506l10.68 4.14c-.14.16-.27.332-.391.506Z"
            />
            <Path
              fill="#02535C"
              d="m119.429 72.73-10.68-4.14c.147-.174.31-.336.478-.486l10.679 4.14a7.102 7.102 0 0 0-.477.487Z"
            />
            <Path
              fill="#02545E"
              d="m119.907 72.249-10.68-4.14c.208-.186.428-.352.663-.5l10.68 4.14a4.663 4.663 0 0 0-.663.5Z"
            />
            <Path
              fill="#02555F"
              d="m120.57 71.748-10.68-4.14a4.59 4.59 0 0 1 1.236-.547l10.68 4.14a4.365 4.365 0 0 0-1.236.547Z"
            />
          </G>
          <G filter="url(#q)">
            <Path
              fill="#216169"
              d="m137.864 79.627 33.499-9.56 1.531 8.358-25.311 7.223 1.655 9.01a56.178 56.178 0 0 1 4.23-2.1l.248-.11a38.288 38.288 0 0 1 4.799-1.69c3.075-.877 5.889-1.31 8.437-1.282 2.552.022 4.786.46 6.694 1.313 1.909.853 3.474 2.09 4.695 3.712 1.218 1.626 2.043 3.6 2.466 5.917.438 2.399.368 4.698-.217 6.899-.586 2.201-1.672 4.249-3.255 6.138-1.582 1.893-3.644 3.585-6.182 5.081a32.522 32.522 0 0 1-3.521 1.785 43.84 43.84 0 0 1-5.483 1.944c-1.785.51-3.579.91-5.377 1.205a46.34 46.34 0 0 1-5.289.568c-1.73.091-3.405.064-5.025-.067a32.178 32.178 0 0 1-4.612-.7l2.77-8.305c1.167.273 2.409.439 3.721.49 1.312.055 2.65.032 4.011-.061a35.742 35.742 0 0 0 4.082-.526 41.692 41.692 0 0 0 3.93-.915c1.608-.456 3.046-.962 4.308-1.512.49-.213.957-.436 1.392-.659 1.567-.815 2.816-1.687 3.753-2.621.934-.933 1.58-1.915 1.931-2.943a6.183 6.183 0 0 0 .233-3.149c-.2-1.091-.652-2.017-1.35-2.775-.698-.762-1.632-1.317-2.805-1.674-1.173-.356-2.588-.487-4.248-.4-1.66.086-3.555.432-5.674 1.038-.951.271-2.011.623-3.187 1.051-1.017.372-2.082.8-3.192 1.286-.173.075-.35.155-.528.231a55.219 55.219 0 0 0-4.044 2.015 60.32 60.32 0 0 0-4.18 2.524l-4.905-26.739Z"
            />
          </G>
        </G>
        <G fill="#216169" filter="url(#r)">
          <Path d="M50.436 170.77h18.107v3.589H54.538v5.283H66.43v3.373H54.54v7.947H50.43V170.77h.005ZM71.982 170.77h4.133v20.192h-4.133V170.77ZM81.348 170.769h18.106v3.589h-14v5.283h11.892v3.373H85.454v7.947h-4.106v-20.192ZM109.519 174.352h-7.475v-3.589h19.053v3.589h-7.476v16.603h-4.106v-16.603h.004ZM125.492 170.777h17.24v3.589h-13.134v4.031h11.631v3.373h-11.631v5.618h13.408v3.581h-17.514v-20.192ZM147.555 170.764h17.24v3.589h-13.133v4.031h11.63v3.373h-11.63v5.618h13.408v3.581h-17.515v-20.192ZM169.602 170.768h4.106l12.617 6.588v-6.588h4.106v20.192h-4.106v-9.265l-12.617-6.548v15.813h-4.106v-20.192Z" />
        </G>
      </G>
      <Defs>
        <LinearGradient
          id="d"
          x1={63.658}
          x2={112.345}
          y1={157.975}
          y2={53.554}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.17} stopColor="#A4B3BD" />
          <Stop offset={0.73} stopColor="#EEF1F3" />
          <Stop offset={0.85} stopColor="#fff" />
        </LinearGradient>
        <LinearGradient
          id="e"
          x1={64.167}
          x2={111.836}
          y1={156.881}
          y2={54.648}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FDFDFD" />
          <Stop offset={0.3} stopColor="#F4F4F4" />
          <Stop offset={0.79} stopColor="#DCDCDC" />
          <Stop offset={1} stopColor="#D0D0D0" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
export default Test;
