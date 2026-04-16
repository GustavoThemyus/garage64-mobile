import { carsMoch } from "@/src/data/carsMoch";
import { FlatList, Text, View, useWindowDimensions, StyleSheet } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

export default function CarDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    flex: 1,
  }
})