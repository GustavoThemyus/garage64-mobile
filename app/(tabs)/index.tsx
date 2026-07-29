// Imports dos componentes e bibliotecas
import CarCard from "@/src/components/CarCard";
import { CarFiltersOverlay } from "@/src/components/CarFiltersOverlay";
import { carsMoch } from "@/src/data/carsMoch";
import { filterCars } from "@/src/data/filterCars";
import { useState } from "react"; // Import do hook useState
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import do hook useSafeAreaInsets, que impede que os elementos fiquem atrás do Notch do celular.

// Essa é a função principal da tela inicial, que renderiza a lista de carros
export default function HomeScreen() {
  // Hook useSafeAreaInsets aplicado a constante insets
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions(); // Hook useWindowDimensions aplicado a constante width, que retorna a largura da tela
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Constante com useState que determina os dados de filtro aberto e fechado
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); // Constante com useState que determina os filtros selecionados

  // Função toggleFilter que alterna o estado dos filtros selecionados, com os states acima
  function toggleFilter(filterName: string) {
    // Caso 1: detecta que o filtro já está selecionado, e retira ele
    if (selectedFilters.includes(filterName)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filterName));
      // Caso 2: detecta que o filtro não está selecionado, e adiciona ele
    } else {
      setSelectedFilters([...selectedFilters, filterName]);
    }
  }

  // Função handleToggleFilter que alterna o estado de isFilterOpen usando animação (não está funcionando)
  function handleToggleFilter() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFilterOpen((prev) => !prev);
  }

  // Variáveis que determinam o layout dos cards de acordo com a largura da tela
  let columns: number = width < 430 ? 2 : width < 650 ? 3 : 4;
  let availableWidth: number = width - styles.container.padding * 2;
  let totalSpacing: number = (columns - 1) * styles.row.gap;
  let cardWidth: number = (availableWidth - totalSpacing) / columns;

  // Variável que armazena os carros filtrados com base nos critérios selecionados na função lá em cima
  const carsForShow = filterCars(carsMoch, { selectedFilters });

  // Renderiza a lista de carros filtrados com FlatList
  return (
    // <View> que contém o overlay de filtros e a lista de carros
    <View style={styles.container}>
      <CarFiltersOverlay
        // Propriedades recebendo funções e estados para controlar o overlay de filtros
        isOpen={isFilterOpen}
        onToggle={handleToggleFilter}
        toggleFilter={toggleFilter}
        selectedFilters={selectedFilters}
      />
      <FlatList
        // FlatList que renderiza os carros filtrados
        data={carsForShow}
        numColumns={columns}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingTop: 50,
          paddingBottom: 10,
        }}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.info.id.toString()}
        key={columns}
        renderItem={({ item }) => (
          // Render dos cards de carros
          <CarCard
            car={item}
            onPress={() => console.log("Clicou no " + item.info.model)}
            cardWidth={cardWidth}
          />
        )}
      />
    </View>
  );
}

// Estilos para o container principal e a lista de carros
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    padding: 16,
  },

  row: {
    gap: 15,
    marginBottom: 12,
    justifyContent: "center",
  },
});
