import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { carsMoch } from "../data/carsMoch";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};

export function CarFiltersOverlay({ isOpen, onToggle }: Props) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  function toggleFilter(filterName: string) {
    if (selectedFilters.includes(filterName)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filterName));
    } else {
      setSelectedFilters([...selectedFilters, filterName]);
    }
  }
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  function handleToggleMenu() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle(); // Chama a função que avisa a Home para abrir/fechar
  }

  function handleSectionToggle(section: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  }

  const allBrands = carsMoch.map((item) => item.info.brand);
  const uniqueBrands = Array.from(new Set(allBrands));

  const allCountries = carsMoch.map((item) => item.info.countryCode);
  const uniqueCountries = Array.from(new Set(allCountries));

  const allTypes = carsMoch.map((item) => item.specs.type);
  const uniqueTypes = Array.from(new Set(allTypes));

  return (
    <>
      <View style={styles.root}>
        <View style={[styles.cardContainer, isOpen && styles.cardOpen]}>
          <BlurView intensity={70} tint="dark" style={styles.blur} />

          <View style={styles.content}>
            <TouchableOpacity onPress={handleToggleMenu} style={styles.button}>
              <AntDesign name="menu-fold" size={22} color="white" />
            </TouchableOpacity>

            {isOpen && (
              <ScrollView style={styles.panel}>
                <TouchableOpacity
                  style={styles.filterCategoryButton}
                  onPress={() => handleSectionToggle("brand")}
                >
                  <Text style={styles.categoryText}>Brand</Text>
                  <AntDesign
                    name={expandedSection === "brand" ? "down" : "right"}
                    size={12}
                    color="white"
                  />
                </TouchableOpacity>

                <View style={styles.separatorLine} />

                {expandedSection === "brand" && (
                  <View style={styles.expandedContent}>
                    {uniqueBrands.map((brand) => (
                      <View key={brand} style={styles.filterItemRow}>
                        <Text style={styles.itemText}>{brand}</Text>
                        <Switch
                          trackColor={{ true: "#dfc011" }}
                          style={{ transform: [{ scale: 0.8 }] }}
                          value={selectedFilters.includes(brand)}
                          onValueChange={() => toggleFilter(brand)}
                        />
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.filterCategoryButton}
                  onPress={() => handleSectionToggle("countryCode")}
                >
                  <Text style={styles.categoryText}>Country</Text>
                  <AntDesign
                    name={expandedSection === "countryCode" ? "down" : "right"}
                    size={12}
                    color="white"
                  />
                </TouchableOpacity>

                <View style={styles.separatorLine} />

                {expandedSection === "countryCode" && (
                  <View style={styles.expandedContent}>
                    {uniqueCountries.map((countryCode) => (
                      <View key={countryCode} style={styles.filterItemRow}>
                        <Text style={styles.itemText}>{countryCode}</Text>
                        <Switch
                          trackColor={{ true: "#dfc011" }}
                          style={{ transform: [{ scale: 0.8 }] }}
                          value={selectedFilters.includes(countryCode)}
                          onValueChange={() => toggleFilter(countryCode)}
                        />
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.filterCategoryButton}
                  onPress={() => handleSectionToggle("type")}
                >
                  <Text style={styles.categoryText}>Type</Text>
                  <AntDesign
                    name={expandedSection === "type" ? "down" : "right"}
                    size={12}
                    color="white"
                  />
                </TouchableOpacity>

                <View style={styles.separatorLine} />

                {expandedSection === "type" && (
                  <View style={styles.expandedContent}>
                    {uniqueTypes.map((type) => (
                      <View key={type} style={styles.filterItemRow}>
                        <Text style={styles.itemText}>{type}</Text>
                        <Switch
                          trackColor={{ true: "#dfc011" }}
                          style={{ transform: [{ scale: 0.8 }] }}
                          value={selectedFilters.includes(type)}
                          onValueChange={() => toggleFilter(type)}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </View>

      {isOpen === true && (
        <Pressable style={styles.backdrop} onPress={handleToggleMenu} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 10,
    left: 16,
    zIndex: 100,
  },

  cardContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "rgba(30,30,30,0.4)",
  },

  cardOpen: {
    width: 260,
    height: 320,
  },

  blur: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
  },

  button: {
    padding: 10,
    alignSelf: "flex-start",
  },

  panel: {
    flex: 1,
    paddingHorizontal: 20,
  },

  filterCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryText: {
    color: "#ffffff",
    padding: 8,
    fontSize: 20,
    fontWeight: 500,
  },

  itemText: {
    color: "#ffffff",
    padding: 8,
    fontSize: 18,
  },

  expandedContent: {
    paddingHorizontal: 12,
  },

  filterItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },

  separatorLine: {
    height: 1,
    backgroundColor: "#747474",
    marginVertical: 10,
    opacity: 0.4,
  },

  backdrop: {
    zIndex: 90,
    ...StyleSheet.absoluteFillObject,
  },
});
