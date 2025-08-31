import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  cssVarsRoot: ":where(:root, :host)",
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: "white", _dark: "#0f0f0f" } },
          subtle: { value: { _light: "gray.50", _dark: "#1a1a1a" } },
          muted: { value: { _light: "gray.100", _dark: "#252525" } }
        },
        fg: {
          DEFAULT: { value: { _light: "gray.900", _dark: "gray.50" } },
          muted: { value: { _light: "gray.600", _dark: "gray.400" } },
          subtle: { value: { _light: "gray.500", _dark: "gray.500" } }
        },
        border: {
          DEFAULT: { value: { _light: "gray.200", _dark: "#2a2a2a" } },
          subtle: { value: { _light: "gray.100", _dark: "#1f1f1f" } }
        }
      }
    }
  }
});

export const system = createSystem(defaultConfig, config);